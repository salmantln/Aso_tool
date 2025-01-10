import axios from 'axios';
import xml2js from 'xml2js';
import type { Review } from '@/types/review';

export interface Country {
  code: string;
  name: string;
  flag: string;
}


export default class ITunesReviewScraper {
  private appId: string;
  private country: string;
  private baseUrl: string;
  private MAX_PAGES = 20; // Apple's limit
  private CONCURRENT_REQUESTS = 3; // Number of parallel requests

  constructor(appId: string, country: string = 'us') {
    this.appId = appId;
    this.country = country;
    this.baseUrl = `https://itunes.apple.com/${this.country}/rss/customerreviews/page={page}/id=${appId}/sortby=mostrecent/xml`;
  }

  private async fetchPage(pageNumber: number): Promise<string | null> {
    try {
      const response = await axios.get(this.baseUrl.replace('{page}', pageNumber.toString()));
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        console.log(`Reached end of available pages at ${pageNumber}`);
      } else {
        console.error(`Error fetching page ${pageNumber}:`, error);
      }
      return null;
    }
  }

  private parseXmlToJson(xmlData: string): Promise<any> {
    return new Promise((resolve, reject) => {
      xml2js.parseString(xmlData, { explicitArray: false }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  private transformEntry(entry: any): Review {
    const textContent = entry.content?.find((c: any) => c.$.type === 'text')?._;
    const htmlContent = entry.content?.find((c: any) => c.$.type === 'html')?._;

    return {
      id: entry.id,
      title: entry.title,
      content: {
        text: textContent || null,
        html: htmlContent || null,
        cleanHtml: htmlContent || null
      },
      rating: parseInt(entry['im:rating']),
      version: entry['im:version'],
      author: {
        name: entry.author?.name || '',
        uri: entry.author?.uri || ''
      },
      voteSum: parseInt(entry['im:voteSum']),
      voteCount: parseInt(entry['im:voteCount']),
      updated: entry.updated,
      link: entry.link?.$.href || ''
    };
  }

  private async processBatch(pages: number[]): Promise<Review[]> {
    const [results] = await Promise.all([Promise.all(
        pages.map(async (page) => {
          const xmlData = await this.fetchPage(page);
          if (!xmlData) return [];

          const jsonData = await this.parseXmlToJson(xmlData);
          const feed = jsonData.feed;

          const entries = feed.entry ?
              (Array.isArray(feed.entry) ? feed.entry : [feed.entry]).filter(Boolean) :
              [];

          return entries.map(entry => this.transformEntry(entry));
        })
    )]);

    return results.flat();
  }

  public async getAllReviews(): Promise<Review[]> {
    const allReviews: Review[] = [];
    const pages = Array.from({ length: this.MAX_PAGES }, (_, i) => i + 1);

    // Process pages in batches
    for (let i = 0; i < pages.length; i += this.CONCURRENT_REQUESTS) {
      const batch = pages.slice(i, i + this.CONCURRENT_REQUESTS);
      console.log(`Fetching pages ${batch.join(', ')}...`);

      const batchResults = await this.processBatch(batch);
      if (batchResults.length === 0) {
        console.log('No more reviews available');
        break;
      }

      allReviews.push(...batchResults);

      // Add a small delay between batches to avoid rate limiting
      if (i + this.CONCURRENT_REQUESTS < pages.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return allReviews;
  }
}
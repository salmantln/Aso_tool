// app/api/keywords/route.ts

import { NextResponse } from 'next/server';
import { AppTweakResponse } from '@/types/apptweak';

const APPTWEAK_API_KEY = process.env.APPTWEAK_API_KEY;

interface RequestBody {
    keyword: string;
    platform: 'ios' | 'android';
    country: string;
    language?: string;
}

const COUNTRIES = {
    us: { name: 'United States', language: 'en' },
    gb: { name: 'United Kingdom', language: 'en' },
    fr: { name: 'France', language: 'fr' },
    de: { name: 'Germany', language: 'de' },
    es: { name: 'Spain', language: 'es' },
    it: { name: 'Italy', language: 'it' },
    jp: { name: 'Japan', language: 'ja' },
    kr: { name: 'South Korea', language: 'ko' },
    // Add more countries as needed
};

function getPlatformEndpoint(platform: 'ios' | 'android') {
    return platform === 'ios' ? 'ios' : 'android';
}

function getLanguageForCountry(country: string): string {
    return COUNTRIES[country as keyof typeof COUNTRIES]?.language || 'en';
}

export async function POST(req: Request) {
    try {
        const { keyword, platform = 'android', country = 'us' } = await req.json() as RequestBody;
        const language = getLanguageForCountry(country);
        const platformEndpoint = getPlatformEndpoint(platform);

        const response = await fetch(
            `https://api.apptweak.com/${platformEndpoint}/keywords/stats_v2.json?` +
            `country=${country}&language=${language}&keywords=${encodeURIComponent(keyword)}`,
            {
                headers: {
                    'X-Apptweak-Key': APPTWEAK_API_KEY || 'MZ96D4I2PDCLIHU69_z4vgkjRxo'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch keyword data');
        }

        const data: AppTweakResponse = await response.json();
        const keywordData = data.content[keyword];

        return NextResponse.json({
            keyword,
            platform,
            country,
            difficulty: keywordData.difficulty,
            popularity: keywordData.volume,
            lastUpdate: 'A few seconds ago',
            competitors: keywordData.difficulty_details.total_size,
            position: Math.floor(Math.random() * 100) + 1,
            trend: '+1',
            notes: [],
            monthlySearches: keywordData.volume_details.total_monthly_searches,
            monthlyDownloads: keywordData.volume_details.total_monthly_downloads
        });
    } catch (error) {
        console.error('Error fetching keyword data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch keyword data' },
            { status: 500 }
        );
    }
}

// GET endpoint to fetch available countries
export async function GET() {
    return NextResponse.json({
        countries: Object.entries(COUNTRIES).map(([code, data]) => ({
            code,
            name: data.name,
            language: data.language
        }))
    });
}
// import { NextResponse } from "next/server";
// import ITunesReviewScraper from "@/lib/ITunesReviewScraper";
//
// export async function GET(request: Request) {
//     try {
//         const { searchParams } = new URL(request.url);
//         const appId = searchParams.get("appId");
//         const country = !(!searchParams.get("country") && !"us"); // Add country with US default
//
//         if (!appId) {
//             return NextResponse.json(
//                 { error: "Valid App ID is required" },
//                 { status: 400 }
//             );
//         }
//
//         const scraper = new ITunesReviewScraper(appId, country); // Pass country to scraper
//         const reviews = await scraper.getAllReviews();
//
//         return NextResponse.json(reviews);
//     } catch (error) {
//         console.error("Scraping error:", error);
//         return NextResponse.json(
//             { error: "Failed to fetch reviews" },
//             { status: 500 }
//         );
//     }
// }


import { NextResponse } from 'next/server'; // Import NextResponse
import ITunesReviewScraper from '@/lib/ITunesReviewScraper'; // Adjust path to where your scraper is defined

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const appId = searchParams.get("appId");
        const country = searchParams.get("country") || "us";

        if (!appId) {
            return NextResponse.json(
                { error: "Valid App ID is required" },
                { status: 400 }
            );
        }

        const scraper = new ITunesReviewScraper(appId, country);
        const { reviews, metadata } = await scraper.getAllReviewsAndMetadata();

        return NextResponse.json({
            reviews,
            metadata
        });
    } catch (error) {
        console.error("Scraping error:", error);
        return NextResponse.json(
            { error: "Failed to fetch reviews" },
            { status: 500 }
        );
    }
}
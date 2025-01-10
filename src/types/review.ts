// types/review.ts
export interface Author {
    name: string;
    uri: string;
}

export interface ReviewContent {
    text: string | null;
    html: string | null;
    cleanHtml: string | null;
}

export interface Review {
    id: string;
    title: string;
    content: ReviewContent;
    rating: number;
    version: string;
    author: Author;
    voteSum: number;
    voteCount: number;
    updated: string;
    link: string;
}
// types/apptweak.ts

export interface AppTweakResponse {
    content: {
        [keyword: string]: {
            difficulty: number;
            difficulty_details: {
                total_size: number;
            };
            volume: number;
            volume_details: {
                total_monthly_downloads: number;
                total_monthly_searches: number;
            };
            is_branded: boolean;
            brand_details: Record<string, unknown>;
            canonical_keyword: string;
        };
    };
    metadata: {
        request: {
            path: string;
            params: {
                country: string;
                language: string;
                keywords: string[];
                format: string;
                use_dlds_algo_v2: boolean;
            };
            performed_at: string;
            store: string;
        };
        content: Record<string, unknown>;
    };
}

export interface KeywordData {
    keyword: string;
    difficulty: number;
    popularity: number;
    position?: number;
    trend?: string;
    lastUpdate: string;
    competitors: number;
    notes: string[];
}
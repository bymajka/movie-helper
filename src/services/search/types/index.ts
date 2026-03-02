import type { MediaType } from '@/services/media';

export interface SearchResult {
    id: number;
    media_type: MediaType;
    title?: string;
    name?: string;
    overview?: string | null;
    profile_path?: string | null;
    poster_path?: string | null;
    backdrop_path?: string | null;
    genre_ids?: number[];
    vote_average?: number | null;
}

export interface SearchOptions {
    query?: string;
    page?: number;
    language?: string;
}

export interface SearchResponse {
    results: SearchResult[];
    total_pages: number;
}

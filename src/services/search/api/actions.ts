'use server';

import { tmdbClient } from '@/shared/lib/tmdb-client';
import type { SearchResult, SearchOptions, SearchResponse } from '../types';

export async function fetchSearchMulti({
    query,
    page = 1,
    language = 'en-US',
}: SearchOptions = {}): Promise<SearchResponse> {
    if (!query) {
        return { results: [], total_pages: 0 };
    }

    const { data } = await tmdbClient.get<{
        results: SearchResult[];
        total_pages: number;
    }>('/search/multi', {
        params: {
            query,
            page,
            language,
            include_adult: false,
        },
    });

    return { results: data.results, total_pages: data.total_pages };
}

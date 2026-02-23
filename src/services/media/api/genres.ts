'use server';

import { tmdbClient } from '@/shared/lib/tmdb-client';
import type { Genre, GenresOptions } from '../types';

export async function fetchGenres({
    mediaType = 'movie',
    language = 'en-US',
}: GenresOptions = {}): Promise<Genre[]> {
    const endpoint = mediaType === 'movie' ? '/genre/movie/list' : '/genre/tv/list';

    const { data } = await tmdbClient.get<{ genres: Genre[] }>(endpoint, {
        params: { language },
    });

    return data.genres;
}

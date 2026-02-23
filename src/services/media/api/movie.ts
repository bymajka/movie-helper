'use server';

import { tmdbClient } from '@/shared/lib/tmdb-client';
import type {
    TrendingItem,
    TrendingOptions,
    MovieDiscoverItem,
    DiscoverOptions,
    MovieDetails,
    DetailsOptions,
    BaseDiscoverItem,
} from '../types';

export async function fetchTrending({
    mediaType = 'all',
    timeWindow = 'day',
    language = 'en-US',
}: TrendingOptions = {}): Promise<TrendingItem[]> {
    const { data } = await tmdbClient.get<{ results: TrendingItem[] }>(
        `/trending/${mediaType}/${timeWindow}`,
        { params: { language } }
    );
    return data.results;
}

export async function fetchDiscoverMovies({
    page = 1,
    language = 'en-US',
    with_genres,
    'vote_average.gte': voteGte,
    'vote_average.lte': voteLte,
}: DiscoverOptions = {}): Promise<MovieDiscoverItem[]> {
    const params: Record<string, string | number> = { page, language };

    if (with_genres?.length) {
        params.with_genres = with_genres.join(',');
    }
    if (voteGte != null) {
        params['vote_average.gte'] = voteGte;
    }
    if (voteLte != null) {
        params['vote_average.lte'] = voteLte;
    }

    const { data } = await tmdbClient.get<{ results: BaseDiscoverItem[] }>(
        '/discover/movie',
        { params }
    );

    return data.results.map((r) => ({
        ...r,
        media_type: 'movie' as const,
        release_date: (r as MovieDiscoverItem).release_date ?? '',
    }));
}

export async function fetchMovieDetails({
    id,
    language = 'en-US',
    region = 'US',
}: DetailsOptions): Promise<MovieDetails> {
    const { data } = await tmdbClient.get<MovieDetails>(`/movie/${id}`, {
        params: {
            language,
            append_to_response: [
                'credits',
                'images',
                'videos',
                'recommendations',
                'similar',
                'release_dates',
                'external_ids',
                'watch/providers',
            ].join(','),
            include_image_language: language,
            include_video_language: language,
            region,
        },
    });
    return data;
}

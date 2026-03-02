'use server';

import { tmdbClient } from '@/shared/lib/tmdb-client';
import type {
    TvDiscoverItem,
    DiscoverOptions,
    TvDetails,
    DetailsOptions,
    BaseDiscoverItem,
} from '../types';

export async function fetchDiscoverTv({
    page = 1,
    language = 'en-US',
    with_genres,
    'vote_average.gte': voteGte,
    'vote_average.lte': voteLte,
}: DiscoverOptions = {}): Promise<TvDiscoverItem[]> {
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
        '/discover/tv',
        { params }
    );

    return data.results.map((r) => ({
        ...r,
        media_type: 'tv' as const,
        first_air_date: (r as TvDiscoverItem).first_air_date ?? '',
    }));
}

export async function fetchTvDetails({
    id,
    language = 'en-US',
    region = 'US',
}: DetailsOptions): Promise<TvDetails> {
    const { data } = await tmdbClient.get<TvDetails>(`/tv/${id}`, {
        params: {
            language,
            append_to_response: [
                'credits',
                'images',
                'videos',
                'recommendations',
                'similar',
                'content_ratings',
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

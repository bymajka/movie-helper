'use client';

import { useEffect, useState } from 'react';
import { fetchGenres } from '../api/genres';
import type { GenreMap } from '../types';

export const useAllGenres = (language?: string) => {
    const [maps, setMaps] = useState<{
        movie: GenreMap;
        tv: GenreMap;
    }>({ movie: {}, tv: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        Promise.all([
            fetchGenres({ mediaType: 'movie', language }),
            fetchGenres({ mediaType: 'tv', language }),
        ])
            .then(([movieGenres, tvGenres]) => {
                const movieMap = Object.fromEntries(
                    movieGenres.map((g) => [g.id, g.name])
                );
                const tvMap = Object.fromEntries(
                    tvGenres.map((g) => [g.id, g.name])
                );
                setMaps({ movie: movieMap, tv: tvMap });
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [language]);

    return { maps, loading, error };
};

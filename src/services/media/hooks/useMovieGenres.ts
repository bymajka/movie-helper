'use client';

import { useEffect, useState } from 'react';
import { fetchGenres } from '../api/genres';
import type { Genre, GenresOptions } from '../types';

export const useMovieGenres = (opts?: GenresOptions) => {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const mediaType = opts?.mediaType;
    const language = opts?.language;

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetchGenres({ mediaType, language })
            .then(setGenres)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [mediaType, language]);

    return { genres, loading, error };
};

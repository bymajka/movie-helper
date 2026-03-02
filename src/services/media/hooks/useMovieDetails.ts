'use client';

import { useEffect, useState } from 'react';
import { fetchMovieDetails } from '../api/movie';
import type { MovieDetails, DetailsOptions } from '../types';

export const useMovieDetails = (
    id: number,
    opts?: Omit<DetailsOptions, 'id'>
) => {
    const [details, setDetails] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const language = opts?.language;
    const region = opts?.region;

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetchMovieDetails({ id, language, region })
            .then(setDetails)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id, language, region]);

    return { details, loading, error };
};

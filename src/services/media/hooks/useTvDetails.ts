'use client';

import { useEffect, useState } from 'react';
import { fetchTvDetails } from '../api/tv';
import type { TvDetails, DetailsOptions } from '../types';

export const useTvDetails = (id: number, opts?: Omit<DetailsOptions, 'id'>) => {
    const [details, setDetails] = useState<TvDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetchTvDetails({ id, ...opts })
            .then(setDetails)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id, opts?.language, opts?.region]);

    return { details, loading, error };
};

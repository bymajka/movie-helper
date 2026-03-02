'use client';

import { useState, useEffect } from 'react';
import { fetchTrending } from '../api/movie';
import type { TrendingItem, TrendingOptions } from '../types';

export const useTrending = (opts?: TrendingOptions, limit?: number) => {
    const [items, setItems] = useState<TrendingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const mediaType = opts?.mediaType;
    const timeWindow = opts?.timeWindow;
    const language = opts?.language;

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetchTrending({ mediaType, timeWindow, language })
            .then((data) => setItems(limit ? data.slice(0, limit) : data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [mediaType, timeWindow, language, limit]);

    return { items, loading, error };
};

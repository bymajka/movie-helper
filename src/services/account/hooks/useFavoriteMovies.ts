'use client';

import { useEffect, useState } from 'react';
import { fetchFavoriteMovies } from '../api/favorites';
import type { AccountMovieItem, AccountListResponse } from "../types";

interface UseFavoriteMoviesOptions {
  page?: number;
  language?: string;
  sortBy?: 'created_at.asc' | 'created_at.desc';
}

export const useFavoriteMovies = (
  accountId: number | null,
  sessionId: string | null,
  opts?: UseFavoriteMoviesOptions
) => {
  const [data, setData] = useState<AccountListResponse<AccountMovieItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId || !sessionId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetchFavoriteMovies({
      accountId,
      sessionId,
      page: opts?.page,
      language: opts?.language,
      sortBy: opts?.sortBy,
    })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [accountId, sessionId, opts?.page, opts?.language, opts?.sortBy]);

  return { data, loading, error };
};

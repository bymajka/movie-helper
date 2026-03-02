"use client";

import { useEffect, useState } from "react";
import { fetchWatchlistMovies } from "../api/watchlist";
import type { AccountMovieItem, AccountListResponse } from "../types";

interface UseWatchlistMoviesOptions {
  page?: number;
  language?: string;
  sortBy?: "created_at.asc" | "created_at.desc";
}

export const useWatchlistMovies = (
  accountId: number | null,
  sessionId: string | null,
  opts?: UseWatchlistMoviesOptions,
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

    fetchWatchlistMovies({
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

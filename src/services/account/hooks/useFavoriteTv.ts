'use client';

import { useEffect, useState } from 'react';
import { fetchFavoriteTv } from '../api/favorites';
import type { AccountTvItem, AccountListResponse } from "../types";

interface UseFavoriteTvOptions {
  page?: number;
  language?: string;
  sortBy?: 'created_at.asc' | 'created_at.desc';
}

export const useFavoriteTv = (
  accountId: number | null,
  sessionId: string | null,
  opts?: UseFavoriteTvOptions
) => {
  const [data, setData] = useState<AccountListResponse<AccountTvItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId || !sessionId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetchFavoriteTv({
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

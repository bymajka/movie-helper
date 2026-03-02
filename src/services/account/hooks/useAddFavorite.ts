'use client';

import { useState } from 'react';
import { addFavorite } from '../api/favorites';
import type { AccountMutationResponse } from "../types";

interface UseAddFavoriteOptions {
  accountId: number | null;
  sessionId: string | null;
}

export const useAddFavorite = ({ accountId, sessionId }: UseAddFavoriteOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    mediaType: 'movie' | 'tv',
    mediaId: number,
    favorite: boolean
  ): Promise<AccountMutationResponse | null> => {
    if (!accountId || !sessionId) {
      setError('Not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await addFavorite({
        accountId,
        sessionId,
        mediaType,
        mediaId,
        favorite,
      });
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update favorite';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};

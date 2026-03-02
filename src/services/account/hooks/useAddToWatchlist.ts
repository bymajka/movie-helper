"use client";

import { useState } from "react";
import { addToWatchlist } from "../api/watchlist";
import type { AccountMutationResponse } from "../types";

interface UseAddToWatchlistOptions {
  accountId: number | null;
  sessionId: string | null;
}

export const useAddToWatchlist = ({
  accountId,
  sessionId,
}: UseAddToWatchlistOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    mediaType: "movie" | "tv",
    mediaId: number,
    watchlist: boolean,
  ): Promise<AccountMutationResponse | null> => {
    if (!accountId || !sessionId) {
      setError("Not authenticated");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await addToWatchlist({
        accountId,
        sessionId,
        mediaType,
        mediaId,
        watchlist,
      });
      return response;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update watchlist";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};

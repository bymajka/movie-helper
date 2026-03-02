'use client';

import { useEffect, useState } from 'react';
import { fetchMovieAccountStates } from '../api/accountStates';
import type { MovieAccountStates } from "../types";

export const useMovieAccountStates = (
  movieId: number,
  sessionId: string | null
) => {
  const [data, setData] = useState<MovieAccountStates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetchMovieAccountStates({
      movieId,
      sessionId,
    })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [movieId, sessionId]);

  return { data, loading, error };
};

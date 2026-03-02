"use server";

import { tmdbClient } from "@/shared/lib/tmdb-client";
import type { MovieAccountStates, AccountStatesOptions } from "../types";

export async function fetchMovieAccountStates({
  movieId,
  sessionId,
}: AccountStatesOptions): Promise<MovieAccountStates> {
  const { data } = await tmdbClient.get<MovieAccountStates>(
    `/movie/${movieId}/account_states`,
    {
      params: {
        session_id: sessionId,
      },
    },
  );
  return data;
}

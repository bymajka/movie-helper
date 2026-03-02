"use server";

import { tmdbClient } from "@/shared/lib/tmdb-client";
import type {
  AccountMovieItem,
  AccountTvItem,
  AccountListResponse,
  AccountListOptions,
  AddWatchlistOptions,
  AccountMutationResponse,
} from "../types";

export async function fetchWatchlistMovies({
  accountId,
  sessionId,
  page = 1,
  language = "en-US",
  sortBy = "created_at.asc",
}: AccountListOptions): Promise<AccountListResponse<AccountMovieItem>> {
  const { data } = await tmdbClient.get<AccountListResponse<AccountMovieItem>>(
    `/account/${accountId}/watchlist/movies`,
    {
      params: {
        session_id: sessionId,
        page,
        language,
        sort_by: sortBy,
      },
    },
  );
  return data;
}

export async function fetchWatchlistTv({
  accountId,
  sessionId,
  page = 1,
  language = "en-US",
  sortBy = "created_at.asc",
}: AccountListOptions): Promise<AccountListResponse<AccountTvItem>> {
  const { data } = await tmdbClient.get<AccountListResponse<AccountTvItem>>(
    `/account/${accountId}/watchlist/tv`,
    {
      params: {
        session_id: sessionId,
        page,
        language,
        sort_by: sortBy,
      },
    },
  );
  return data;
}

export async function addToWatchlist({
  accountId,
  sessionId,
  mediaType,
  mediaId,
  watchlist,
}: AddWatchlistOptions): Promise<AccountMutationResponse> {
  const { data } = await tmdbClient.post<AccountMutationResponse>(
    `/account/${accountId}/watchlist`,
    {
      media_type: mediaType,
      media_id: mediaId,
      watchlist,
    },
    {
      params: {
        session_id: sessionId,
      },
    },
  );
  return data;
}

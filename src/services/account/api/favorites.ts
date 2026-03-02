"use server";

import { tmdbClient } from "@/shared/lib/tmdb-client";
import type {
  AccountMovieItem,
  AccountTvItem,
  AccountListResponse,
  AccountListOptions,
  AddFavoriteOptions,
  AccountMutationResponse,
} from "../types";

export async function fetchFavoriteMovies({
  accountId,
  sessionId,
  page = 1,
  language = "en-US",
  sortBy = "created_at.asc",
}: AccountListOptions): Promise<AccountListResponse<AccountMovieItem>> {
  const { data } = await tmdbClient.get<AccountListResponse<AccountMovieItem>>(
    `/account/${accountId}/favorite/movies`,
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

export async function fetchFavoriteTv({
  accountId,
  sessionId,
  page = 1,
  language = "en-US",
  sortBy = "created_at.asc",
}: AccountListOptions): Promise<AccountListResponse<AccountTvItem>> {
  const { data } = await tmdbClient.get<AccountListResponse<AccountTvItem>>(
    `/account/${accountId}/favorite/tv`,
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

export async function addFavorite({
  accountId,
  sessionId,
  mediaType,
  mediaId,
  favorite,
}: AddFavoriteOptions): Promise<AccountMutationResponse> {
  const { data } = await tmdbClient.post<AccountMutationResponse>(
    `/account/${accountId}/favorite`,
    {
      media_type: mediaType,
      media_id: mediaId,
      favorite,
    },
    {
      params: {
        session_id: sessionId,
      },
    },
  );
  return data;
}

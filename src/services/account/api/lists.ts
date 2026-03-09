"use server";

import { tmdbClient } from "@/shared/lib/tmdb-client";
import type {
  UserListsResponse,
  UserListsOptions,
  CreateListOptions,
  CreateListResponse,
  AddToListOptions,
  RemoveFromListOptions,
  DeleteListOptions,
  AccountMutationResponse,
  ListDetails,
  ListDetailsOptions,
} from "../types";

export async function fetchAccountLists({
  accountId,
  sessionId,
  page = 1,
}: UserListsOptions): Promise<UserListsResponse> {
  const { data } = await tmdbClient.get<UserListsResponse>(
    `/account/${accountId}/lists`,
    {
      params: {
        session_id: sessionId,
        page,
      },
    },
  );
  return data;
}

export async function createList({
  sessionId,
  name,
  description = "",
  language = "en",
}: CreateListOptions): Promise<CreateListResponse> {
  const { data } = await tmdbClient.post<CreateListResponse>(
    "/list",
    {
      name,
      description,
      language,
    },
    {
      params: {
        session_id: sessionId,
      },
    },
  );
  return data;
}

export async function addToList({
  listId,
  sessionId,
  mediaId,
}: AddToListOptions): Promise<AccountMutationResponse> {
  const { data } = await tmdbClient.post<AccountMutationResponse>(
    `/list/${listId}/add_item`,
    {
      media_id: mediaId,
    },
    {
      params: {
        session_id: sessionId,
      },
    },
  );
  return data;
}

export async function removeFromList({
  listId,
  sessionId,
  mediaId,
}: RemoveFromListOptions): Promise<AccountMutationResponse> {
  const { data } = await tmdbClient.post<AccountMutationResponse>(
    `/list/${listId}/remove_item`,
    {
      media_id: mediaId,
    },
    {
      params: {
        session_id: sessionId,
      },
    },
  );
  return data;
}

export async function deleteList({
  listId,
  sessionId,
}: DeleteListOptions): Promise<AccountMutationResponse> {
  const { data } = await tmdbClient.delete<AccountMutationResponse>(
    `/list/${listId}`,
    {
      params: {
        session_id: sessionId,
      },
    },
  );
  return data;
}

export async function fetchListDetails({
  listId,
}: ListDetailsOptions): Promise<ListDetails> {
  const { data } = await tmdbClient.get<ListDetails>(`/list/${listId}`);
  return data;
}

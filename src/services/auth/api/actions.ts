"use server";

import { tmdbClient } from "@/shared/lib/tmdb-client";
import type {
  GuestSession,
  RequestToken,
  UserAccount,
  UserSession,
} from "../types";

export async function createGuestSession(): Promise<GuestSession> {
  const { data } = await tmdbClient.get<GuestSession>(
    "/authentication/guest_session/new",
  );
  return data;
}

export async function createRequestToken(): Promise<RequestToken> {
  const { data } = await tmdbClient.get<RequestToken>(
    "/authentication/token/new",
  );
  return data;
}

export async function createUserSession(
  request_token: string,
): Promise<UserSession> {
  const { data } = await tmdbClient.post<UserSession>(
    "/authentication/session/new",
    {
      request_token: request_token,
    },
  );
  return data;
}

export async function getAccountDetails(
  sessionId: string,
): Promise<UserAccount> {
  const { data } = await tmdbClient.get<UserAccount>("/account", {
    params: {
      session_id: sessionId,
    },
  });
  return data;
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  const { data } = await tmdbClient.delete<{ success: boolean }>(
    "/authentication/session",
    {
      data: {
        session_id: sessionId,
      },
    },
  );
  return data.success;
}

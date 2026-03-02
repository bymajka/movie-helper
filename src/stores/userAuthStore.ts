'use client';

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  createRequestToken,
  createUserSession,
  getAccountDetails,
  deleteSession,
} from "@/services/auth";

interface UserAuthStore {
  sessionId: string | null;
  accountId: number | null;
  username: string | null;
  name: string | null;
  avatarPath: string | null;
  isLoading: boolean;
  hasHydrated: boolean;

  login: () => Promise<void>;
  logout: () => Promise<void>;
  handleCallback: (requestToken: string) => Promise<boolean>;
  fetchAccount: () => Promise<void>;
  isAuthenticated: () => boolean;
  setHasHydrated: (value: boolean) => void;
}

const TMDB_AUTH_URL = "https://www.themoviedb.org/authenticate";

export const useUserAuthStore = create<UserAuthStore>()(
  persist(
    (set, get) => ({
      sessionId: null,
      accountId: null,
      username: null,
      name: null,
      avatarPath: null,
      isLoading: false,
      hasHydrated: false,

      setHasHydrated: (value: boolean) => set({ hasHydrated: value }),

      login: async () => {
        set({ isLoading: true });
        try {
          const { request_token } = await createRequestToken();
          const callbackUrl = `${window.location.origin}/auth/callback`;
          const authUrl = `${TMDB_AUTH_URL}/${request_token}?redirect_to=${encodeURIComponent(callbackUrl)}`;
          window.location.href = authUrl;
        } catch (error) {
          console.error("Failed to create request token:", error);
          set({ isLoading: false });
        }
      },

      logout: async () => {
        const { sessionId } = get();
        if (sessionId) {
          try {
            await deleteSession(sessionId);
          } catch (error) {
            console.error("Failed to delete session:", error);
          }
        }
        set({
          sessionId: null,
          accountId: null,
          username: null,
          name: null,
          avatarPath: null,
        });
      },

      handleCallback: async (requestToken: string) => {
        set({ isLoading: true });
        try {
          const { session_id, success } = await createUserSession(requestToken);
          if (success) {
            set({ sessionId: session_id });
            await get().fetchAccount();
            return true;
          }
          return false;
        } catch (error) {
          console.error("Failed to create user session:", error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchAccount: async () => {
        const { sessionId } = get();
        if (!sessionId) return;

        try {
          const account = await getAccountDetails(sessionId);
          set({
            accountId: account.id,
            username: account.username,
            name: account.name,
            avatarPath: account.avatar.tmdb.avatar_path,
          });
        } catch (error) {
          console.error("Failed to fetch account details:", error);
          get().logout();
        }
      },

      isAuthenticated: () => {
        return get().sessionId !== null;
      },
    }),
    {
      name: "tmdb-user-session",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ sessionId, accountId, username, name, avatarPath }) => ({
        sessionId,
        accountId,
        username,
        name,
        avatarPath,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

'use client';

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";

interface GuestSessionStore {
    sessionId: string | null;
    expiresAt: string | null;
    initializing: boolean;

    initSession: () => Promise<void>;
    clearSession: () => void;
    isExpired: () => boolean;
}

export const useGuestSessionStore = create<GuestSessionStore>()(
    persist(
        (set, get) => ({
            sessionId: null,
            expiresAt: null,
            initializing: false,

            initSession: async () => {
                if (get().initializing || !get().isExpired()) return

                set({ initializing: true });

                try {
                    const res = await axios.get(
                      `https://api.themoviedb.org/3/authentication/guest_session/new`, 
                      {
                        headers: {
                            accept: "application/json",
                            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
                        }
                      }
                    )
                    const { guest_session_id, expires_at } = res.data
                    set({
                      sessionId: guest_session_id,
                      expiresAt: expires_at,
                    })
                  } finally {
                    set({ initializing: false })
                  }
            },

            clearSession: () => {
                set({ sessionId: null, expiresAt: null });
            },

            isExpired: () => {
                const exp = get().expiresAt
                if (!exp) return true
                return new Date(exp).getTime() <= Date.now()
            }
        }),

        {
            name: "tmdb-guest-session",
            storage: createJSONStorage(() => localStorage),  
            partialize: ({ sessionId, expiresAt }) => ({
                sessionId,
                expiresAt,
            }),
        }
    )
)
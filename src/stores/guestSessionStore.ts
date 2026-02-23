'use client';

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createGuestSession } from "@/services/auth";

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
                    const { guest_session_id, expires_at } = await createGuestSession();
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
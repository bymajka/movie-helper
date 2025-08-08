'use client';

import { useGuestSessionStore } from "@/stores/guestSessionStore";
import { useEffect } from "react";

export const GuestSessionProvider = ({ children }: { children: React.ReactNode }) => {
    const { initSession } = useGuestSessionStore();

    useEffect(() => {
        initSession();
    }, []);

    return <>{children}</>;
}
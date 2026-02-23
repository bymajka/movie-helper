'use server';

import { tmdbClient } from '@/shared/lib/tmdb-client';
import type { GuestSession } from '../types';

export async function createGuestSession(): Promise<GuestSession> {
    const { data } = await tmdbClient.get<GuestSession>(
        '/authentication/guest_session/new'
    );
    return data;
}

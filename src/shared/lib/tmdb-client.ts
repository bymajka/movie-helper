import axios from 'axios';

const TMDB_BASE = 'https://api.themoviedb.org/3';

export const tmdbClient = axios.create({
    baseURL: TMDB_BASE,
    headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        accept: 'application/json',
    },
});

export const TMDB_BASE_IMG_URL = 'https://image.tmdb.org/t/p/original';
export const TMDB_BASE_IMG_URL_W500 = 'https://image.tmdb.org/t/p/w500';

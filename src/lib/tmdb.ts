import axios from "axios";

export const TMDB_BASE = 'https://api.themoviedb.org/3'
export const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY!

export interface TrendingItem {
    id: number
    title?: string
    name?: string
    media_type: 'movie' | 'tv' | string
    backdrop_path: string | null
    poster_path: string | null
    genre_ids: number[]
    overview: string | null
    vote_average: number | null
}

export interface TrendingOptions {
    mediaType?: 'movie' | 'tv' | 'all';
    timeWindow?: 'day' | 'week';
    language?: string;
}

export interface Genre {
    id: number,
    name: string,
}

export interface MovieGenresOptions {
    mediaType?: 'movie' | 'tv';
    language?: string;
}

export interface DiscoverOptions {
    mediaType?: 'movie' | 'tv';
    with_genres?: number[];
    'vote_average.gte'?: number;
    'vote_average.lte'?: number;
    page?:number;
    language?: string;
}

export interface SearchResult {
    id: number;
    media_type: 'movie' | 'tv' | 'person';
    title?: string;
    name?:     string       // for TV & people
    overview?: string
    profile_path?: string   // for people
    poster_path?: string
    backdrop_path?: string
    genre_ids?: number[]
}

export interface SearchMultiOptions {
    query?: string;
    page?: number;
    language?: string;
}

export const TMDB_BASE_IMG_URL = 'https://image.tmdb.org/t/p/original';
export const TMDB_BASE_IMG_URL_W500 = 'https://image.tmdb.org/t/p/w500';

const tmdb = axios.create({
    baseURL: TMDB_BASE,
    headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        accept: 'application/json',
    }
  })

export async function fetchTrending({
    mediaType = 'all',
    timeWindow = 'day',
    language  = 'en-US'
}: TrendingOptions = {}): Promise<TrendingItem[]> {
    const { data } = await tmdb.get<{
        page: number
        results: TrendingItem[]
      }>(`/trending/${mediaType}/${timeWindow}`, {
        params: { language },
      })

    return data.results;
}

export async function fetchGenres({
    mediaType = 'movie',
    language = 'en-US'
}: MovieGenresOptions = {}) : Promise<Genre[]> {
    const endpoint =
    mediaType === 'movie' ? '/genre/movie/list' : '/genre/tv/list'
    const {data} = await tmdb.get<{
        genres: Genre[]
    }>(endpoint, {
        params: { language },
    })

    return data.genres;
}

export async function fetchDiscover({
    mediaType = 'movie',
    with_genres = [],
    'vote_average.gte': gte,
    'vote_average.lte': lte,
    page = 1,
    language = 'en-US'
}: DiscoverOptions = {}): Promise<TrendingItem[]> {
    const params: Record<string, any> = {page, language}
    if (with_genres?.length) params.with_genres = with_genres.join(',')
    if (gte != null)         params['vote_average.gte'] = gte
    if (lte != null)         params['vote_average.lte'] = lte
    
    const { data } = await tmdb.get<{ results: TrendingItem[] }>(
      `/discover/${mediaType}`,
      { params }
    )
    return data.results
}

export async function fetchSearchMulti({
    query, 
    page = 1,
    language = 'en-US'
}: SearchMultiOptions = {}): Promise<{results: TrendingItem[]; total_pages: number}> {
    const { data } = await tmdb.get<{
        results: TrendingItem[]
        total_pages: number
      }>('/search/multi', {
        params: { query, page, language, include_adult: false },
      })
      return { results: data.results, total_pages: data.total_pages }
}

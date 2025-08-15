import axios from "axios";

export const TMDB_BASE = 'https://api.themoviedb.org/3'
export const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY!

export type MediaType = 'movie' | 'tv' | 'all';

export interface BaseDiscoverItem {
    id: number,
    backdrop_path: string | null,
    poster_path: string | null,
    genre_ids: number[],
    overview: string | null,
    vote_average: number | null,
}

export interface Video {
    key: string,
    
}

export interface MovieDiscoverItem extends BaseDiscoverItem {
    title?: string,
    media_type: 'movie',
    release_date: string,
}

export interface TvDiscoverItem extends BaseDiscoverItem {
    name?: string,
    media_type: 'tv',
    first_air_date: string,
}

export type DiscoverItem = MovieDiscoverItem | TvDiscoverItem;

export interface Collection {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
}

export interface Company {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
}

export interface Country {
    iso_3166_1: string;
    name: string;
}

export interface Language {
    english_name: string;
    iso_639_1: string;
    name: string;
}

export interface TrendingItem {
    id: number
    title?: string
    name?: string
    media_type: MediaType
    backdrop_path: string | null
    poster_path: string | null
    genre_ids: number[]
    overview: string | null
    vote_average: number | null
}

export interface TrendingOptions {
    mediaType?: MediaType;
    timeWindow?: 'day' | 'week';
    language?: string;
}

export interface Genre {
    id: number,
    name: string,
}

export interface MovieGenresOptions {
    mediaType?: MediaType;
    language?: string;
}

export interface DiscoverOptions {
    mediaType?: MediaType;
    with_genres?: number[];
    'vote_average.gte'?: number;
    'vote_average.lte'?: number;
    page?:number;
    language?: string;
}

export interface SearchResult {
    id: number;
    media_type: MediaType;
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

export interface BaseOptions {
    id: number,
    language?: string,
    region?: string,
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export type MovieDetailsOptions = BaseOptions
export type TvDetailsOptions = BaseOptions

export interface MovieDetails {
    adult: boolean;
  backdrop_path: string | null;

  // Sometimes null; when present it’s an object with ids/paths
  belongs_to_collection: Collection | null;

  budget: number;

  genres: Genre[];

  homepage: string | null;

  id: number;

  imdb_id: string | null;

  origin_country?: string[];

  original_language: string;
  original_title: string;

  overview: string | null;

  popularity: number;

  poster_path: string | null;

  production_companies: Company[];
  production_countries: Country[];

  release_date: string; // YYYY-MM-DD
  revenue: number;

  runtime: number | null; 

  spoken_languages: Language[];

  status:
    | "Rumored"
    | "Planned"
    | "In Production"
    | "Post Production"
    | "Released"
    | "Canceled"
    | string; 

  tagline: string | null;

  title: string;

  video: boolean;

  videos: {
    results: {
      key: string
    }[]
  }

  vote_average: number;
  vote_count: number;

  // Credits data from append_to_response
  credits?: Credits;
}

export interface TvDetails {
    id: number,
    language?: string,
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
    // with_genres = [],
    // 'vote_average.gte': gte,
    // 'vote_average.lte': lte,
    page = 1,
    language = 'en-US',
    ...rest
}: DiscoverOptions = {}): Promise<DiscoverItem[]> {
    const params: Record<string, any> = {page, language}
    if (rest.with_genres?.length) params.with_genres = rest.with_genres.join(',')
    if (rest['vote_average.gte'] != null)         params['vote_average.gte'] = rest['vote_average.gte']
    if (rest['vote_average.lte'] != null)         params['vote_average.lte'] = rest['vote_average.lte']
    
    const { data } = await tmdb.get<{ results: BaseDiscoverItem[] }>(
      `/discover/${mediaType}`,
      { params: { page, language, ...rest } }
    )
    return data.results.map(r => (
        {
            ...r,
            media_type: mediaType,
        } as DiscoverItem
    ))
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

export async function fetchMovieDetails({
    id, language = 'en-US', region = 'US'
} : MovieDetailsOptions) : Promise<MovieDetails> {
    const { data } = await tmdb.get<MovieDetails>(`/movie/${id}`, {
        params: { 
            language,
            append_to_response: ["credits","images","videos","recommendations","similar",
                "release_dates","external_ids","watch/providers"
            ].join(","),
            include_image_language: language,
            include_video_language: language,
            region
        },
    })
    return data;
}

export async function fetchTvDetails({
    id, language = 'en-US', region = 'US'
} : TvDetailsOptions) : Promise<TvDetails> {
    const { data } = await tmdb.get<TvDetails>(`/tv/${id}`, {
        params: {
            language,
            append_to_response: ["credits","images","videos","recommendations","similar",
                "release_dates","external_ids","watch/providers"
            ].join(","),
            include_image_language: language,
            include_video_language: language,
            region
        }
    })
    return data;
}

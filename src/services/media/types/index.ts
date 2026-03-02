export type MediaType = 'movie' | 'tv' | 'all';

// Base types
export interface BaseDiscoverItem {
    id: number;
    backdrop_path: string | null;
    poster_path: string | null;
    genre_ids: number[];
    overview: string | null;
    vote_average: number | null;
}

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

export interface Genre {
    id: number;
    name: string;
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

// Trending
export interface TrendingItem {
    id: number;
    title?: string;
    name?: string;
    media_type: MediaType;
    backdrop_path: string | null;
    poster_path: string | null;
    genre_ids: number[];
    overview: string | null;
    vote_average: number | null;
}

export interface TrendingOptions {
    mediaType?: MediaType;
    timeWindow?: 'day' | 'week';
    language?: string;
}

// Discover
export interface MovieDiscoverItem extends BaseDiscoverItem {
    title?: string;
    media_type: 'movie';
    release_date: string;
}

export interface TvDiscoverItem extends BaseDiscoverItem {
    name?: string;
    media_type: 'tv';
    first_air_date: string;
}

export type DiscoverItem = MovieDiscoverItem | TvDiscoverItem;

export interface DiscoverOptions {
    with_genres?: number[];
    'vote_average.gte'?: number;
    'vote_average.lte'?: number;
    page?: number;
    language?: string;
}

// Details
export interface DetailsOptions {
    id: number;
    language?: string;
    region?: string;
}

export interface MovieDetails {
    adult: boolean;
    backdrop_path: string | null;
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
    release_date: string;
    revenue: number;
    runtime: number | null;
    spoken_languages: Language[];
    status:
        | 'Rumored'
        | 'Planned'
        | 'In Production'
        | 'Post Production'
        | 'Released'
        | 'Canceled'
        | string;
    tagline: string | null;
    title: string;
    video: boolean;
    videos: {
        results: { key: string }[];
    };
    vote_average: number;
    vote_count: number;
    credits?: Credits;
}

export interface TvDetails {
    adult: boolean;
    backdrop_path: string | null;
    created_by: {
        id: number;
        name: string;
        profile_path: string | null;
    }[];
    episode_run_time: number[];
    first_air_date: string;
    genres: Genre[];
    homepage: string | null;
    id: number;
    in_production: boolean;
    languages: string[];
    last_air_date: string;
    last_episode_to_air: {
        id: number;
        name: string;
        overview: string;
        air_date: string;
        episode_number: number;
        season_number: number;
    } | null;
    name: string;
    networks: Company[];
    number_of_episodes: number;
    number_of_seasons: number;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string | null;
    popularity: number;
    poster_path: string | null;
    production_companies: Company[];
    production_countries: Country[];
    seasons: {
        id: number;
        name: string;
        overview: string;
        poster_path: string | null;
        season_number: number;
        episode_count: number;
        air_date: string;
    }[];
    spoken_languages: Language[];
    status: string;
    tagline: string | null;
    type: string;
    vote_average: number;
    vote_count: number;
    videos: {
        results: { key: string }[];
    };
    credits?: Credits;
}

// Genres
export interface GenresOptions {
    mediaType?: MediaType;
    language?: string;
}

export type GenreMap = Record<number, string>;

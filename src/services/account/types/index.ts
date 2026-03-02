// Shared account media item types (used by favorites, watchlist, etc.)
export interface AccountMovieItem {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface AccountTvItem {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export interface AccountListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface AccountListOptions {
  accountId: number;
  sessionId: string;
  page?: number;
  language?: string;
  sortBy?: "created_at.asc" | "created_at.desc";
}

// Favorites
export interface AddFavoriteOptions {
  accountId: number;
  sessionId: string;
  mediaType: "movie" | "tv";
  mediaId: number;
  favorite: boolean;
}

// Watchlist
export interface AddWatchlistOptions {
  accountId: number;
  sessionId: string;
  mediaType: "movie" | "tv";
  mediaId: number;
  watchlist: boolean;
}

// Shared mutation response
export interface AccountMutationResponse {
  success: boolean;
  status_code: number;
  status_message: string;
}

// Account states (for checking favorite/watchlist/rating status)
export interface MovieAccountStates {
  id: number;
  favorite: boolean;
  watchlist: boolean;
  rated: { value: number } | false;
}

export interface AccountStatesOptions {
  movieId: number;
  sessionId: string;
}

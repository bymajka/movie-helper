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

export interface AccountMutationResponse {
  success: boolean;
  status_code: number;
  status_message: string;
}

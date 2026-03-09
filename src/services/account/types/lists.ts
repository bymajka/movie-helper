export interface UserList {
  id: number;
  name: string;
  description: string;
  favorite_count: number;
  item_count: number;
  iso_639_1: string;
  list_type: string;
  poster_path: string | null;
}

export interface UserListsResponse {
  page: number;
  results: UserList[];
  total_pages: number;
  total_results: number;
}

export interface UserListsOptions {
  accountId: number;
  sessionId: string;
  page?: number;
}

export interface CreateListOptions {
  sessionId: string;
  name: string;
  description?: string;
  language?: string;
}

export interface CreateListResponse {
  success: boolean;
  status_code: number;
  status_message: string;
  list_id: number;
}

export interface AddToListOptions {
  listId: number;
  sessionId: string;
  mediaId: number;
}

export interface RemoveFromListOptions {
  listId: number;
  sessionId: string;
  mediaId: number;
}

export interface DeleteListOptions {
  listId: number;
  sessionId: string;
}

export interface ListItem {
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
  media_type: "movie";
}

export interface ListDetails {
  id: number;
  name: string;
  description: string;
  poster_path: string | null;
  created_by: string;
  iso_639_1: string;
  item_count: number;
  favorite_count: number;
  list_type: string;
  items: ListItem[];
}

export interface ListDetailsOptions {
  listId: number;
}

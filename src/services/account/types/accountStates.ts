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

export interface AddWatchlistOptions {
  accountId: number;
  sessionId: string;
  mediaType: "movie" | "tv";
  mediaId: number;
  watchlist: boolean;
}

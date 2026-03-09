export interface AddFavoriteOptions {
  accountId: number;
  sessionId: string;
  mediaType: "movie" | "tv";
  mediaId: number;
  favorite: boolean;
}

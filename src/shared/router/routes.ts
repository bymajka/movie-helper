export const ROUTES = {
  HOME: "/",
  PROFILE: "/profile",
  PROFILE_LISTS: "/profile?section=lists",
  PROFILE_FAVORITES: "/profile?section=favorites",
  PROFILE_WATCHLIST: "/profile?section=watchlist",
  SEARCH: "/search",
  LIST: (id: number) => `/list/${id}`,
  MOVIE: (id: number) => `/movie/${id}`,
  TV: (id: number) => `/tv/${id}`,
} as const;

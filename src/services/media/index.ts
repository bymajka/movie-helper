// Movie API
export { fetchTrending, fetchDiscoverMovies, fetchMovieDetails } from './api/movie';

// TV API
export { fetchDiscoverTv, fetchTvDetails } from './api/tv';

// Genres API
export { fetchGenres } from './api/genres';

// Hooks
export {
    useTrending,
    useMovieDetails,
    useTvDetails,
    useMovieGenres,
    useAllGenres,
} from './hooks';

// Types
export type {
    MediaType,
    BaseDiscoverItem,
    Collection,
    Company,
    Country,
    Language,
    Genre,
    CastMember,
    CrewMember,
    Credits,
    TrendingItem,
    TrendingOptions,
    MovieDiscoverItem,
    TvDiscoverItem,
    DiscoverItem,
    DiscoverOptions,
    DetailsOptions,
    MovieDetails,
    TvDetails,
    GenresOptions,
    GenreMap,
} from './types';

// Constants
export const TMDB_BASE_IMG_URL = 'https://image.tmdb.org/t/p/original';
export const TMDB_BASE_IMG_URL_W500 = 'https://image.tmdb.org/t/p/w500';

import { create } from "zustand";

import { fetchGenres, type Genre } from "@/services/media";

interface MediaType {
    label: string;
    value: string;
}

const MEDIA_TYPES: MediaType[] = [
    {
        label: "Movies",
        value: "movie",
    },
    {
        label: "TV Shows",
        value: "tv",
    }
]

export interface FilterState {
    mediaTypes: MediaType[];
    selectedMediaTypes: Set<MediaType>;
    availableGenres: Genre[];
    selectedGenres: Set<Genre>; 
    rating_gte: number;
    rating_lte: number;
    genresLoading: boolean;
    genresError: string | null;

    //actions
    toggleMediaType:  (mt: MediaType) => void
    toggleGenre:      (genre: Genre) => void
    setMinRating:     (r: number) => void
    setMaxRating:     (r: number) => void
    resetFilters:     () => void
    loadGenres:       () => Promise<void>
}

export const useFilterStore = create<FilterState>((set) => ({
    mediaTypes: MEDIA_TYPES,
    selectedMediaTypes: new Set(),
    availableGenres: [],
    selectedGenres: new Set(),
    rating_gte:  1,
    rating_lte:  10,
    genresLoading: false,
    genresError: null,

    toggleMediaType: (mt: MediaType) => 
        set((state) => ({
            selectedMediaTypes: state.selectedMediaTypes.has(mt)
            ? new Set(Array.from(state.selectedMediaTypes).filter(x => x.value !== mt.value))
            : new Set([...state.selectedMediaTypes, mt]),
        })),
    
    toggleGenre: (genre: Genre) => 
        set((state) => ({
            selectedGenres: state.selectedGenres.has(genre)
            ? new Set(Array.from(state.selectedGenres).filter(g => g.id !== genre.id))
            : new Set([...state.selectedGenres, genre]),
        })),
    
    setMinRating: (r) => set({ rating_gte: r }),
    setMaxRating: (r) => set({ rating_lte: r }),

    resetFilters: () => set({
        selectedMediaTypes: new Set(),
        selectedGenres: new Set(),
        rating_gte: 1,
        rating_lte: 10,
    }),

    setSelectedMediaTypes: (mt: MediaType[]) =>
        set({
            selectedMediaTypes: new Set(mt),
        }),


    loadGenres: async () => {
        set({ genresLoading: true, genresError: null })
        try {
          const [movieGenres, tvGenres] = await Promise.all([
            fetchGenres({mediaType: 'movie'}),
            fetchGenres({mediaType: 'tv'}),
          ])
          
          // Deduplicate genres by ID to avoid duplicates
          const allGenres = [...movieGenres, ...tvGenres];
          const uniqueGenres = allGenres.filter((genre, index, self) => 
            index === self.findIndex(g => g.id === genre.id)
          );
          
          set({ availableGenres: uniqueGenres })
        } catch (err: unknown) {
          set({ genresError: err instanceof Error ? err.message : 'Unknown error' })
        } finally {
          set({ genresLoading: false })
        }
      }
}))
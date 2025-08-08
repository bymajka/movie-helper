import { useEffect, useState } from "react";
import { fetchGenres, MovieGenresOptions } from "@/lib/tmdb";

type GenreMap = Record<number, string>

export const useAllGenres = (opts?: MovieGenresOptions) => {
    const [maps, setMaps] = useState<{
        movie: GenreMap
        tv:    GenreMap
      }>({ movie: {}, tv: {} })
      const [loading, setLoading] = useState(true)
      const [error,   setError]   = useState<string | null>(null)

      useEffect(() => {
        setLoading(true)
        Promise.all([
          fetchGenres({mediaType: 'movie', language: opts?.language}),
          fetchGenres({mediaType: 'tv',    language: opts?.language}),
        ])
          .then(([movieGenres, tvGenres]) => {
            const movieMap = Object.fromEntries(
              movieGenres.map((g) => [g.id, g.name])
            )
            const tvMap = Object.fromEntries(
              tvGenres.map((g) => [g.id, g.name])
            )
            setMaps({ movie: movieMap, tv: tvMap })
          })
          .catch((err) => setError(err.message))
          .finally(() => setLoading(false))
      }, [opts?.language])

      return { maps, loading, error }
}
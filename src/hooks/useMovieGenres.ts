import { useEffect, useState } from "react";
import { fetchGenres, Genre, MovieGenresOptions } from "@/lib/tmdb";

export const useMovieGenres = (opts?: MovieGenresOptions) => {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetchGenres(opts)
            .then(setGenres)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [opts?.language]);

    return { genres, loading, error };
}
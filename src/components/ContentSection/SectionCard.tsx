"use client";

import { TrendingItem, TMDB_BASE_IMG_URL_W500 } from "@/lib/tmdb";
import { useMovieGenres } from "@/hooks/useMovieGenres";
import { useMemo } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FallbackCardImage } from "../shared/FallbackCardImage";

interface SectionCardProps {
    item: TrendingItem
    className?: string
}

export const SectionCard = ({item, className}: SectionCardProps) => {
    const {genres} = useMovieGenres();

    const genre = useMemo(() => {
        return genres.find(g => item.genre_ids?.includes(g.id))?.name;
    }, [genres, item.genre_ids]);

    return (
        <div className={`group cursor-pointer ${className}`}>
            <div className="relative md:aspect-[8/7] md:max-h-[294px] rounded-[20px] overflow-hidden bg-gray-900">
                <div className="relative h-2/3 overflow-hidden">
                    {/* Movie Poster */}
                    {item.backdrop_path ? <Image
                    src={`${TMDB_BASE_IMG_URL_W500}${item.backdrop_path}`}
                    alt={item.title || item.name || ''}
                    fill
                    sizes="(max-width: 639px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    /> : <FallbackCardImage />}
        
                    {/* Genre Badge */}
                    <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="text-primary bg-white/10 py-2.5 px-3 rounded-[30px] text-xs">
                            {genre}
                        </Badge>
                    </div>
                </div>

            <div className="h-1/3 bg-card p-4 flex flex-col justify-between">
                <div className="flex md:flex-row justify-between items-center">
                    <h3 className="text-primary font-semibold mb-2 line-clamp-1">
                        {item.title || item.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-0.5 mb-3">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-primary text-sm font-medium">{item.vote_average?.toFixed(1)}</span>
                    </div>
                </div>
                            
                    {/* Description */}
                    <p className="text-primary text-sm font-light leading-tight line-clamp-2">
                        {item.overview || ''}
                    </p>
                </div>
            </div>
        </div>
    )
}
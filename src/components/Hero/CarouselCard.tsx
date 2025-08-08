import { TMDB_BASE_IMG_URL, TrendingItem } from "@/lib/tmdb";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/shared/Toggle";
import { TbHeartFilled } from "react-icons/tb";
import Button from "@/components/shared/Button";
import { useAllGenres } from "@/hooks/useAllGenres";

interface CarouselCardProps {
    item: TrendingItem;
}

export const CarouselCard = ({ item }: CarouselCardProps) => {

    const { maps, loading, error } = useAllGenres({ language: 'en-US' });

    const genreMap = item.media_type === 'movie' ? maps.movie : maps.tv;

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <>
            <Image
                src={`${TMDB_BASE_IMG_URL}${item.backdrop_path}`}
                alt={item.title || item.name || ''}
                fill
                className="object-cover"
            />
            <div className="absolute bottom-12 left-12 flex flex-col gap-4 md:max-w-[623px]">
                <div className="flex flex-row gap-[9px]">
                    {item.genre_ids?.map((genreId) => {
                        const genre = genreMap[genreId];
                        return (
                            <Badge key={`${item.id}-${genreId}`} variant="secondary" className="text-white bg-white/10 py-2.5 px-3 rounded-[30px] text-xs">
                                {genre}
                            </Badge>
                        )
                    })}
                </div>
                <div>
                    <h2 className="text-primary text-[32px] pb-3 leading-none font-semibold">{item.title || item.name}</h2>
                    <div className="md:h-[60px] overflow-hidden">
                        <p className="text-primary text-sm leading-tight line-clamp-3">
                            {item.overview}
                        </p>
                    </div>
                </div>
                <div className="flex flex-row gap-4">
                    <Toggle className="rounded-[30px] border-none px-5 py-3 data-[state=off]:bg-primary data-[state=on]:bg-toggle-background data-[state=off]:text-toggle-background data-[state=on]:text-toggle-primary">
                        <span>
                            Add to Favorites
                        </span>
                        <TbHeartFilled className="w-6 h-6" />
                    </Toggle>
                    <Button variant="secondary" className="cursor-pointer rounded-[30px] px-5 py-3 bg-primary/50 text-primary-foreground border-none">
                        <span className="text-primary">
                            Details
                        </span>
                    </Button>
                </div>
            </div>
        </>
    )
}
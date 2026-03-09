import Image from "next/image";
import { FallbackCardImage } from "@/shared/components/FallbackCardImage";
import { Rating } from "@/shared/components/Rating";
import { extractYear } from "@/shared/utils";
import { TMDB_BASE_IMG_URL_W500 } from "@/services/media";

interface PosterCardProps {
  title: string;
  posterPath: string | null;
  rating?: number | null;
  releaseDate?: string;
  className?: string;
}

export const PosterCard = ({
  title,
  posterPath,
  rating,
  releaseDate,
  className,
}: PosterCardProps) => {
  const year = releaseDate ? extractYear(releaseDate) : null;

  return (
    <div className={`group cursor-pointer ${className}`}>
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-card">
        {posterPath ? (
          <Image
            src={`${TMDB_BASE_IMG_URL_W500}${posterPath}`}
            alt={title}
            fill
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <FallbackCardImage />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <Rating rating={rating} />
            {year && <span className="text-white/80 text-xs">{year}</span>}
          </div>
          <h3 className="text-primary text-sm font-medium line-clamp-2">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
};

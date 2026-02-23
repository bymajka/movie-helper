import Image from "next/image";
import { Badge } from "@/shared/components/badge";
import { FallbackCardImage } from "@/shared/components/FallbackCardImage";
import { Rating } from "@/shared/components/Rating";
import { TMDB_BASE_IMG_URL_W500 } from "@/services/media";

interface SectionCardProps {
  title: string;
  overview: string;
  backdropPath: string | null;
  rating?: number | null;
  genre?: string;
  className?: string;
}

export const SectionCard = ({
  title,
  overview,
  backdropPath,
  rating,
  genre,
  className,
}: SectionCardProps) => {
  return (
    <div className={`group cursor-pointer ${className}`}>
      <div className="relative aspect-[5/4] rounded-[20px] overflow-hidden bg-gray-900">
        <div className="relative h-[60%] overflow-hidden">
          {backdropPath ? (
            <Image
              src={`${TMDB_BASE_IMG_URL_W500}${backdropPath}`}
              alt={title}
              fill
              sizes="(max-width: 639px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <FallbackCardImage />
          )}

          {genre && (
            <div className="absolute top-3 left-3">
              <Badge
                variant="secondary"
                className="text-primary bg-white/10 py-2.5 px-3 rounded-[30px] text-xs"
              >
                {genre}
              </Badge>
            </div>
          )}
        </div>

        <div className="h-[40%] bg-card px-4 py-3 flex flex-col justify-between">
          <div className="flex flex-row justify-between items-center">
            <h3 className="text-primary font-semibold line-clamp-1">
              {title}
            </h3>
            <Rating rating={rating} />
          </div>

          <p className="text-primary text-sm font-light leading-tight line-clamp-2">
            {overview}
          </p>
        </div>
      </div>
    </div>
  );
};

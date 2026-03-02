import Image from "next/image";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/shared/components/carousel";
import { type CastMember, TMDB_BASE_IMG_URL } from "@/services/media";
import imagePlaceholder from "@/shared/assets/icons/image-placeholder.svg";

interface CastCarouselProps {
  items: CastMember[];
  setApi: (api: CarouselApi) => void;
}

export const CastCarousel = ({ items, setApi }: CastCarouselProps) => {
  return (
    <div className="overflow-hidden">
      <Carousel
        setApi={setApi}
        className="w-full overflow-hidden"
        opts={{
          align: "start",
          loop: false,
          dragFree: true,
          slidesToScroll: 5,
          containScroll: "trimSnaps",
        }}
      >
        <CarouselContent>
          {items.map((m) => (
            <CarouselItem
              key={m.id}
              className="basis-1/2 sm:basis-1/3 md:basis-1/5"
            >
              <CastCard cast={m} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

const CastCard = ({ cast }: { cast: CastMember }) => {
  return (
    <div className="group cursor-pointer w-full aspect-[3/4] rounded-[20px] overflow-hidden bg-card">
      <div className="relative h-2/3 bg-card">
        {cast.profile_path ? (
          <Image
            src={`${TMDB_BASE_IMG_URL}${cast.profile_path}`}
            alt={cast.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src={imagePlaceholder}
              alt="No Image"
              width={60}
              height={60}
              className="opacity-50"
            />
          </div>
        )}
      </div>

      <div className="h-1/3 bg-card p-3 flex flex-col justify-center">
        <h3 className="text-primary font-semibold leading-tight mb-1 truncate">
          {cast.name}
        </h3>
        <p className="text-primary text-sm font-light leading-tight opacity-90 truncate">
          {cast.character}
        </p>
      </div>
    </div>
  );
};

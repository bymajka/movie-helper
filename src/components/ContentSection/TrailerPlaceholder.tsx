import { MovieDetails } from "@/lib/tmdb";
import Image from "next/image";
import Button from "@/components/shared/Button";
import { Play } from "lucide-react";
import { TbHeartFilled } from "react-icons/tb";
import { Toggle } from "@/components/shared/Toggle";
import { TMDB_BASE_IMG_URL } from "@/lib/tmdb";

const TrailerPlaceholder = ({details, onPlay}: {details?: MovieDetails | null, onPlay: () => void}) => {
    const path = details?.backdrop_path;

    return (
        <div className="relative inset-0 rounded-[20px] overflow-hidden p-5">
            <Image src={path ? `${TMDB_BASE_IMG_URL}${path}` : "/image-placeholder.png"} alt="Trailer placeholder" fill className="object-cover" sizes="(max-width: 768px) 100vw, 72vw" priority={true} />
            <div className="absolute bottom-4 left-4 flex items-center gap-4">
                <Button className="cursor-pointer py-3 px-5 gap-[11px] rounded-[30px]" onClick={onPlay}>
                    <span className="text-sm font-medium">Watch Trailer</span>
                    <Play className="w-6 h-6" fill="currentColor" />
                </Button>
                <Toggle className="rounded-[30px] border-none px-5 py-3 data-[state=off]:bg-primary data-[state=on]:bg-toggle-background data-[state=off]:text-toggle-background data-[state=on]:text-toggle-primary">
                    <span>
                        Add to Favorites
                    </span>
                    <TbHeartFilled className="w-6 h-6" fill="currentColor" />
                </Toggle>
            </div>
        </div>
    )
}

export default TrailerPlaceholder;
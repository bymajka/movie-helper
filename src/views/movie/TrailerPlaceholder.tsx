import Image from "next/image";
import { Play } from "lucide-react";
import { TbHeartFilled } from "react-icons/tb";
import { Button } from "@/shared/components/button";
import { Toggle } from "@/shared/components/toggle";
import { TMDB_BASE_IMG_URL } from "@/services/media";

interface TrailerPlaceholderProps {
    backdropPath?: string | null;
    onPlay: () => void;
}

export const TrailerPlaceholder = ({ backdropPath, onPlay }: TrailerPlaceholderProps) => {
    return (
        <div className="relative inset-0 rounded-[20px] overflow-hidden p-5">
            <Image
                src={backdropPath ? `${TMDB_BASE_IMG_URL}${backdropPath}` : "/image-placeholder.png"}
                alt="Trailer placeholder"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 72vw"
                priority={true}
            />
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

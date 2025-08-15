import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export const Rating = ({ rating, className }: { rating: number | undefined, className?: string }) => {
    return (
        <div className={cn("flex items-center gap-0.5", className)}>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-primary text-sm font-medium">{rating?.toFixed(1)}</span>
        </div>
    )
}
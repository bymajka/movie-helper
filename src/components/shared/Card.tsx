import { Card as CardUI } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <CardUI className={cn("bg-card border-none", className)}>
            {children}
        </CardUI>
    )
}

export default Card;
import { Card as CardUI } from "@/components/ui/card";

const Card = ({ children }: { children: React.ReactNode }) => {
    return (
        <CardUI className="bg-background">
            {children}
        </CardUI>
    )
}

export default Card;
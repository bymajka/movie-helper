import { Button } from "@/shared/components/button";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface ContentSectionProps {
    withButton?: boolean
    title?: string
    children: ReactNode
    className?: string
    onViewAll?: () => void
    headerExtra?: ReactNode
}

export const ContentSection = ({title, children, className, withButton = true, onViewAll, headerExtra}: ContentSectionProps) => {
    return (
        <section className={`flex flex-col gap-4 ${className}`}>
            <div className="flex flex-row justify-between items-center flex-wrap gap-3">
                <div className="flex flex-row items-center gap-4 flex-wrap">
                    <h2 className="text-primary text-2xl font-semibold">
                        {title}
                    </h2>
                    {headerExtra}
                </div>
                {withButton && (
                <Button
                    variant="secondary"
                    className="rounded-full h-full w-auto px-3 py-2.5 flex items-center gap-1.5 bg-card"
                    onClick={onViewAll}
                >
                    <span className="text-primary">
                        View all
                    </span>
                    <ChevronRight className="w-4 h-4" />
                </Button>
                )}
            </div>

            {children}
        </section>
    )
}

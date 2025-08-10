import Button from "@/components/shared/Button";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface ContentSectionProps {
    title: string
    children: ReactNode
    className?: string
}

const ContentSection: React.FC<ContentSectionProps> = ({title, children, className}) => {
    return (
        <section className={`flex flex-col gap-4 ${className}`}>
            <div className="flex flex-row justify-between items-center">
                <h2 className="text-primary text-2xl font-semibold">
                    {title}
                </h2>
                <Button variant="secondary" className="rounded-full h-full w-auto px-3 py-2.5 flex items-center gap-1.5 bg-card">
                    <span className="text-primary">
                        View all
                    </span>
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            {children}
        </section>
    )
}

export {ContentSection};
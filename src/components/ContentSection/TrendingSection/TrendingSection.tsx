"use client";

import { ContentSection } from "@/components/ContentSection/ContentSection";
import { useTrending } from "@/hooks/useTranding";
import { SectionCard } from "../SectionCard";

export const TrendingSection = () => {
    const {items,loading,error} = useTrending({
        mediaType: "all",
        timeWindow: "week",
    }, 3);

    if(loading) return <div>Loading...</div>;
    if(error) return <div>Error: {error}</div>;

    return (
        <ContentSection title="Trending now">
            <div className="grid md:grid-cols-3 gap-6">
                {items.map((item) => {
                    return (
                        <SectionCard key={`${item.id}-${item.title || item.name}`} item={item} />
                    )
                })}
            </div>
        </ContentSection>
    )
}
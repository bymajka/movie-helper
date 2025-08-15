"use client";

import { ContentSection } from "@/components/ContentSection/ContentSection";
import { useTrending } from "@/hooks/useTranding";
import { SectionCard } from "../SectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export const TrendingSection = () => {
    const {items,loading,error} = useTrending({
        mediaType: "all",
        timeWindow: "week",
    }, 3);

    if(loading) return (
        <>
            <div className="flex flex-row justify-between items-center">
                <Skeleton className="md:h-8 md:w-[150px] rounded-2xl bg-card" />
                <Skeleton className="md:h-10 md:w-[85px] rounded-full bg-card" />
            </div>
        <div className="grid md:grid-cols-3 gap-6">
            {Array.from({length: 3}).map((_, index) => (
                <Skeleton key={index} className="w-full md:h-[294px] rounded-2xl bg-card" />
            ))}
        </div>
        </>
    );
    if(error) return <div>Error: {error}</div>;

    return (
        <ContentSection title="Trending now">
            <div className="grid md:grid-cols-3 gap-6">
                {items.map((item) => {
                    return (
                        <Link href={`/${item.media_type}/${item.id}`} key={`${item.id}-${item.title || item.name}`}>
                            <SectionCard item={item} />
                        </Link>
                    )
                })}
            </div>
        </ContentSection>
    )
}
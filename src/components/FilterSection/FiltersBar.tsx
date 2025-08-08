"use client";

import { useFilterStore } from "@/stores/filterStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from "@/components/shared/Button";
import { XIcon } from "lucide-react";


export const FiltersBar = () => {
    const router = useRouter();
    const { selectedMediaTypes, selectedGenres, rating_gte, rating_lte, toggleMediaType, toggleGenre, resetFilters } = useFilterStore();

  const push = () => {
    const params = new URLSearchParams()

    if (selectedMediaTypes.size) {
      params.set('mediaType', Array.from(selectedMediaTypes).map(mt => mt.value).join(','))
    }
    if (selectedGenres.size) {
      params.set('genres', Array.from(selectedGenres).map(g => g.id).join(','))
    }

    params.set('rating_gte', String(rating_gte))
    params.set('rating_lte', String(rating_lte))

    router.push(`/discover?${params.toString()}`)
  }

    useEffect(push, [selectedMediaTypes, selectedGenres, rating_gte, rating_lte])

    return (
        <div className="flex flex-row flex-wrap w-full md:gap-3 justify-start items-center">
            {Array.from(selectedMediaTypes).map((mt) => (
                <Button className="cursor-pointer text-primary rounded-[30px] py-2.5 px-3 border-none bg-toggle-active-background transition-all
        border" key={`${mt.value}-media-type-filter-bar`} onClick={() => toggleMediaType(mt)}>
                    {mt.label}
                    <XIcon className="w-4 h-4" />
                </Button>
            ))}
            {Array.from(selectedGenres).map((genre) => (
                <Button className="cursor-pointer text-primary rounded-[30px] py-2.5 px-3 border-none bg-toggle-active-background transition-all
                border" key={`${genre.id}-genre-filter-bar`} onClick={() => toggleGenre(genre)}>
                    {genre.name}
                    <XIcon className="w-4 h-4" />
                </Button>
            ))}
            <Button variant="ghost" className="rounded-[30px] cursor-pointer text-primary px-3 py-2.5 hover:bg-active-background" onClick={() => { resetFilters(); push() }}>
                Clear All
                <XIcon className="w-4 h-4" />
            </Button>
        </div>
    )
}
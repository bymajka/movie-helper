"use client";

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "../ui/carousel";
import { useEffect, useMemo, useState } from "react";
import { useTrending } from "@/hooks/useTranding";
import { CarouselCard } from "./CarouselCard";
import { Skeleton } from "@/components/ui/skeleton";

const MovieSwiper = () => {
    const [api, setApi] = useState<CarouselApi | null>(null);
    const [selected, setSelected] = useState(0);

    const { items, loading, error } = useTrending({
        mediaType: 'all',
        timeWindow: 'week',
    }, 4);

    const slides = useMemo(() => 
        items.map((i) => (
            <CarouselItem key={i.id} className="relative">
              <CarouselCard item={i}/>
            </CarouselItem>
          )),
        [items]
    )

    useEffect(() => {
        if(!api) return;
        const onSelect = () => {
            setSelected(api.selectedScrollSnap());
        }
        api.on("select", onSelect);
        onSelect();
        return () => {
            api.off("select", onSelect);
        }
    }, [api]);

    useEffect(() => {
        if (!api) return
        const iv = setInterval(() => api.scrollNext(), 5000)
        return () => clearInterval(iv)
      }, [api])

      if (loading) return <div>
        <Skeleton className="w-full md:mt-6 md:h-[560px] rounded-2xl bg-card" />
      </div>
      if (error) return <div>Error: {error}</div>

    return (
        <div className="relative rounded-2xl overflow-hidden md:mt-6">
            <Carousel
                setApi={setApi}
                className="w-full md:h-[560px]"
                opts={{ loop: true, align: 'start',  }}
            >
                <CarouselContent className="md:h-[560px]">
                    {slides}
                </CarouselContent>
            </Carousel>

            {/* 5️⃣ custom “pill” dots */}
            <div className="absolute bottom-12 right-12 flex gap-2">
                {api?.scrollSnapList().map((_, idx) => {
                const isActive = idx === selected
                return (
                    <button
                    key={idx}
                    onClick={() => {
                        api.scrollTo(idx)
                    }}
                    className={`
                        transition-all rounded-full cursor-pointer
                        ${isActive ? 'bg-white w-[50px] h-1' : 'bg-white/30 w-[43px] h-1 opacity-[0.8]'}
                    `}
                    />
                )
                })}
            </div>
        </div>
    )
}

export {MovieSwiper};
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionTrigger, AccordionItem, AccordionContent } from "@/components/shared/Accordion";
import { Input } from "@/components/ui/input";
import axios, { AxiosResponse } from "axios";

import  Logo  from "@/components/shared/Logo";
import Button from "@/components/shared/Button";
import { Toggle } from "@/components/shared/Toggle";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

interface Genre {
    id: number;
    name: string;
}

const TITLE = "Filters";
const BUTTON_TEXT = "See results";

const CATEGORIES = [
    {
        id: "movie",
        name: "Movies",
        value: "movie",
    },
    {
        id: "tv",
        name: "TV Shows",
        value: "tv",
    }
]

const FilterPanel = ({className}: {className?: string}) => {

    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
    const [minRating, setMinRating] = useState<number>(1);
    const [maxRating, setMaxRating] = useState<number>(10);
    const [mediaType, setMediaType] = useState<string[]>([]);

    useEffect(() => {
        const fetchGenres = async () => {
            const response : AxiosResponse<{genres: Genre[]}> = await axios.get("https://api.themoviedb.org/3/genre/movie/list?language=en", 
                {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
                    }
                }
            );
            const data = response.data?.genres;
            setGenres(data);
        }
        fetchGenres();
    }, []);

    const handleGenreToggle = (genreId: number) => {
        setSelectedGenreIds((prev) =>
            prev.includes(genreId) ? prev.filter(x => x !== genreId) : [...prev, genreId]
        );
    }

    const handleMediaTypeToggle = (type: string) => {
        setMediaType(prev =>
            prev.includes(type) ? prev.filter(x => x !== type) : [...prev, type]
        )
    }

    const handleMinRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = parseFloat(e.target.value);
        if (!isNaN(v) && v >= 1 && v <= maxRating) setMinRating(v);
    }

    const handleMaxRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = parseFloat(e.target.value);
        if (!isNaN(v) && v >= minRating && v <= 10) setMaxRating(v);
    }

    const href = {
        pathname: '/discover',
        query: {
            mediaType:   mediaType.join(","),
            genres:      selectedGenreIds.join(","),
            rating_gte:  minRating,
            rating_lte:  maxRating,
        }
    }

    const isDisabled = useMemo(() => {
        const ratingIsDefault = Number(minRating) === 1 && Number(maxRating) === 10;
        return selectedGenreIds.length === 0 && mediaType.length === 0 && ratingIsDefault;
    }, [selectedGenreIds, mediaType, minRating, maxRating]);

    return (  
        <Card className={`shadow-none flex flex-col md:min-w-70 max-w-70 border-none gap-0 md:p-4 ${className}`}>
            <CardHeader className="md:p-0 gap-0">
                <CardTitle/>
                <Logo className="md:mb-8" />
                <CardDescription className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-primary">
                        {TITLE}                        
                    </span>
                    <Link href={href}
                        passHref
                        onClick={(e) => {
                            if (isDisabled) e.preventDefault()
                          }}
                        aria-disabled={isDisabled} 
                        className={`${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                    <Button disabled={isDisabled} type="button" className="cursor-pointer text-primary/50 hover:text-primary hover:bg-primary/10 bg-primary/10 rounded-[30px] text-sm font-medium" size="default" >
                        {BUTTON_TEXT}
                    </Button>
                    </Link>
                </CardDescription>
                <Separator className="md:mt-4" />
            </CardHeader>
            <CardContent className="p-0">
                <Accordion type="multiple">
                    <AccordionItem value="item-1"> 
                        <AccordionTrigger className="cursor-pointer decoration-transparent">
                            <h3 className="font-medium text-primary">
                                Categories
                            </h3>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-row flex-wrap gap-2">
                            {CATEGORIES.map((type) => (
                                <Toggle withCloseIcon className="cursor-pointer rounded-[30px] p-2.5 border-none" key={type.id} onPressChange={() => handleMediaTypeToggle(type.value)}>
                                    {type.name}
                                </Toggle>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2"> 
                        <AccordionTrigger className="cursor-pointer no-underline decoration-transparent">
                            <h3 className="font-medium text-primary">
                                Genre
                            </h3>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-row flex-wrap gap-2">
                            {genres.map((genre) => (
                                <Toggle withCloseIcon className="cursor-pointer rounded-[30px] p-2.5 border-none" key={genre.id} onPressChange={() => handleGenreToggle(genre.id)}>
                                    {genre.name}
                                </Toggle>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3"> 
                        <AccordionTrigger className="cursor-pointer decoration-transparent">
                            <h3 className="font-medium text-primary">
                                Rating
                            </h3>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-row gap-2.5 items-center">
                            <Input type="number" min={1} max={maxRating} value={minRating} onChange={handleMinRatingChange} placeholder="1" className="rounded-[10px] ring-0 focus:ring-0 p-2.5" />
                            <span>to</span>
                            <Input type="number" min={minRating} max={10} value={maxRating} onChange={handleMaxRatingChange} placeholder="10" className="rounded-[10px] ring-0 focus:ring-0 p-2.5" />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    )
}

export {FilterPanel};
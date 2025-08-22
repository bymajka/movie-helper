"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionTrigger, AccordionItem, AccordionContent } from "@/components/shared/Accordion";
import { Input } from "@/components/ui/input";

import  Logo  from "@/components/shared/Logo";
import Button from "@/components/shared/Button";
import { Toggle } from "@/components/shared/Toggle";
import { useEffect, useMemo } from "react";
import { useFilterStore } from "@/stores/filterStore";
import { debounce } from "lodash";

import Link from "next/link";

const TITLE = "Filters";
const BUTTON_TEXT = "See results";
const ACCORDION_CATEGORIES_TITLE = "Categories";
const ACCORDION_GENRE_TITLE = "Genre";
const ACCORDION_RATING_TITLE = "Rating";

const FilterPanel = ({className}: {className?: string}) => {

    const {mediaTypes, selectedMediaTypes, availableGenres, selectedGenres, rating_gte, rating_lte, toggleMediaType, toggleGenre, setMinRating, setMaxRating, resetFilters, loadGenres} = useFilterStore();

    const href = {
        pathname: '/discover',
        query: {
            mediaType:   Array.from(selectedMediaTypes).map(mt => mt.value).join(","),
            genres:      Array.from(selectedGenres).map(g => g.id).join(","),
            rating_gte:  rating_gte,
            rating_lte:  rating_lte,
        }
    }

    useEffect(() => {
        loadGenres();
    }, []);

    const handleMinRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = parseFloat(e.target.value);
        debouncedSetMinRating(v);
    }

    const debouncedSetMinRating = useMemo(
        () => debounce((v: number) => {
            if (!isNaN(v) && v >= 1 && v <= rating_lte) setMinRating(v);
        }, 300),
        [setMinRating, rating_lte]
    );

    const handleMaxRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = parseFloat(e.target.value);
        debouncedSetMaxRating(v);
    }

    const debouncedSetMaxRating = useMemo(
        () => debounce((v: number) => {
            if (!isNaN(v) && v >= rating_gte && v <= 10) setMaxRating(v);
        }, 300),
        [setMaxRating, rating_gte]
    );

    const isDisabled = useMemo(() => {
        const ratingIsDefault = Number(rating_gte) === 1 && Number(rating_lte) === 10;
        return selectedGenres.size === 0 && selectedMediaTypes.size === 0 && ratingIsDefault;
    }, [selectedGenres, selectedMediaTypes, rating_gte, rating_lte]);

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
                                {ACCORDION_CATEGORIES_TITLE}
                            </h3>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-row flex-wrap gap-2">
                            {mediaTypes.map((type) => (
                                <Toggle 
                                    withCloseIcon 
                                    className="cursor-pointer rounded-[30px] p-2.5 border-none" 
                                    key={`${type.value}-media-type-filter-panel`} 
                                    onPressChange={() => toggleMediaType(type)}
                                    isActive={Array.from(selectedMediaTypes).some(mt => mt.value === type.value)}
                                >
                                    {type.label}
                                </Toggle>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2"> 
                        <AccordionTrigger className="cursor-pointer no-underline decoration-transparent">
                            <h3 className="font-medium text-primary">
                                {ACCORDION_GENRE_TITLE}
                            </h3>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-row flex-wrap gap-2">
                            {availableGenres.map((genre, index) => (
                                <Toggle 
                                    withCloseIcon 
                                    className="cursor-pointer rounded-[30px] p-2.5 border-none" 
                                    key={`genre-${genre.id}-${index}`} 
                                    onPressChange={() => toggleGenre(genre)}
                                    isActive={Array.from(selectedGenres).some(g => g.id === genre.id)}
                                >
                                    {genre.name}
                                </Toggle>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3"> 
                        <AccordionTrigger className="cursor-pointer decoration-transparent">
                            <h3 className="font-medium text-primary">
                                {ACCORDION_RATING_TITLE}
                            </h3>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-row gap-2.5 items-center">
                            <Input type="number" min={1} max={rating_lte} value={rating_gte} onChange={handleMinRatingChange} placeholder="1" className="rounded-[10px] ring-0 focus:ring-0 p-2.5" />
                            <span>to</span>
                            <Input type="number" min={rating_gte} max={10} value={rating_lte} onChange={handleMaxRatingChange} placeholder="10" className="rounded-[10px] ring-0 focus:ring-0 p-2.5" />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    )
}

export {FilterPanel};
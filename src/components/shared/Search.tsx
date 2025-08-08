"use client";

import { Search as SearchIcon } from "lucide-react";
import {Input} from "@/components/ui/input";
import {useSearch} from "@/hooks/useSearch";

interface SearchProps {
    placeholder?: string;
    value?:string;
    onChange?: (value:string) => void;
    className?: string;
}

const Search = ({placeholder, value, className}: SearchProps) => {
    const {handleSearch} = useSearch();
    return (
        <div className="relative h-full">
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => handleSearch(e.target.value)}
                className={`${className} flex items-center gap-2 rounded-full px-5 py-[18px] h-full`}
            />
            <SearchIcon className="w-6 h-6 absolute right-5 top-1/2 -translate-y-1/2 text-primary" />
        </div>
    )
}

export {Search};
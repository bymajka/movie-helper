"use client";
import {useState} from "react";

const useSearch = () => {
    const [search, setSearch] = useState("");

    const handleSearch = (value:string) => {
        setSearch(value);
    }

    return {search, handleSearch};
}

export {useSearch};
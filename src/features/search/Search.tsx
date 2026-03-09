"use client";

import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/shared/components/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useDebounce } from "@/shared/hooks";

const SEARCH_DEBOUNCE_MS = 300;

interface SearchProps {
  placeholder?: string;
  className?: string;
}

export const Search = ({ placeholder, className }: SearchProps) => {
  const router = useRouter();
  const params = useSearchParams();
  const urlQuery = params.get("query") ?? "";
  const [q, setQ] = useState(urlQuery);
  const isUserTyping = useRef(false);

  const debouncedQuery = useDebounce(q, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    if (!isUserTyping.current) {
      setQ(urlQuery);
    }
  }, [urlQuery]);

  useEffect(() => {
    if (!isUserTyping.current) return;

    const trimmed = debouncedQuery.trim();
    if (trimmed) {
      router.replace(`/search?query=${encodeURIComponent(trimmed)}`);
    } else {
      router.replace("/search");
    }
    isUserTyping.current = false;
  }, [debouncedQuery, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isUserTyping.current = true;
    setQ(e.target.value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = q.trim();
    if (v) router.push(`/search?query=${encodeURIComponent(v)}`);
  };

  return (
    <form onSubmit={onSubmit} className={`relative ${className}`}>
      <Input
        type="search"
        value={q}
        placeholder={placeholder}
        onChange={handleChange}
        className="!bg-card border-0 focus-visible:ring-0 flex items-center gap-2 rounded-full px-5 py-[18px] h-full"
      />
      {!q && (
        <SearchIcon className="w-6 h-6 absolute right-5 top-1/2 -translate-y-1/2 text-primary" />
      )}
    </form>
  );
};

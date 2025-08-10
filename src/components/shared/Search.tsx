"use client";

import { Search as SearchIcon } from "lucide-react";
import {Input} from "@/components/ui/input";
import {useRouter, useSearchParams} from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";

interface SearchProps {
    placeholder?: string;
    className?: string;
}

export const Search = ({placeholder, className}: SearchProps) => {
    const router = useRouter()
  const params = useSearchParams()
  const [q, setQ] = useState(params.get('query') ?? '')

  const debouncedRoute = useMemo(
    () => debounce((v: string) => {
      const val = v.trim()
      if (val) router.replace(`/search?query=${encodeURIComponent(val)}`)
    }, 300),
    [router]
  )

  useEffect(() => {
    debouncedRoute(q)
    return () => debouncedRoute.cancel()
  }, [q, debouncedRoute])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = q.trim()
    if (v) router.push(`/search?query=${encodeURIComponent(v)}`)
  }

    return (
        <form onSubmit={onSubmit} className={`relative ${className}`}>
                <Input
                    type="search"
                    value={q}
                    placeholder={placeholder}
                    onChange={(e) => setQ(e.target.value)}
                    className={`${className} bg-card! flex items-center gap-2 rounded-full px-5 py-[18px] h-full`}
                />
                {!q && (
                    <SearchIcon className="w-6 h-6 absolute right-5 top-1/2 -translate-y-1/2 text-primary" />
                )}
        </form>
    )
}
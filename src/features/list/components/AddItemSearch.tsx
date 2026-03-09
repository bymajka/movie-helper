"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Loader2, Check } from "lucide-react";
import { addToList } from "@/services/account";
import {
  Button,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/shared/components";
import { useDebounce } from "@/shared/hooks";
import { TMDB_BASE_IMG_URL_W500 } from "@/services/media";
import { fetchSearchMulti, type SearchResult } from "@/services/search";

const SEARCH_DEBOUNCE_MS = 300;

interface AddItemSearchProps {
  listId: number;
  sessionId: string | null;
  existingItemIds: number[];
  onItemAdded: () => void;
}

export function AddItemSearch({
  listId,
  sessionId,
  existingItemIds,
  onItemAdded,
}: AddItemSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);

  const debouncedQuery = useDebounce(query.trim(), SEARCH_DEBOUNCE_MS);

  const existingItemSet = useMemo(
    () => new Set(existingItemIds),
    [existingItemIds],
  );

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      return;
    }
  }, [open]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    fetchSearchMulti({ query: debouncedQuery })
      .then((response) => {
        if (cancelled) return;
        const movieResults = response.results.filter(
          (r) => r.media_type === "movie",
        );
        setResults(movieResults);
      })
      .catch(() => {
        if (cancelled) return;
        toast.error("Failed to search. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const addItem = async (item: SearchResult) => {
    if (!sessionId) return;

    setAddingId(item.id);
    try {
      await addToList({ listId, sessionId, mediaId: item.id });
      toast.success(`"${item.title}" added to list`);
      onItemAdded();
      setOpen(false);
    } catch {
      toast.error("Failed to add movie to list");
    } finally {
      setAddingId(null);
    }
  };

  const isAlreadyInList = (id: number) => existingItemSet.has(id);

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-fit hover:!bg-primary/20"
      >
        <Plus className="w-4 h-4" />
        Add Movie
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Add Movie"
        description="Search for a movie to add to your list"
        showCloseButton={false}
      >
        <CommandInput
          placeholder="Search movies..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[400px]">
          {isSearching && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {!isSearching && debouncedQuery && results.length === 0 && (
            <CommandEmpty>No movies found.</CommandEmpty>
          )}
          {!isSearching && results.length > 0 && (
            <CommandGroup>
              {results.map((item) => {
                const inList = isAlreadyInList(item.id);
                const isAdding = addingId === item.id;

                return (
                  <CommandItem
                    key={item.id}
                    value={`${item.id}-${item.title}`}
                    className="flex items-center gap-5 py-4 px-6 cursor-pointer"
                    disabled={inList}
                    onSelect={() => {
                      if (!inList && !isAdding) {
                        addItem(item);
                      }
                    }}
                  >
                    <div className="relative w-14 h-21 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      {item.poster_path ? (
                        <Image
                          src={`${TMDB_BASE_IMG_URL_W500}${item.poster_path}`}
                          alt={item.title || ""}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.title}
                      </p>
                      {item.vote_average != null && (
                        <p className="text-xs text-muted-foreground">
                          ★ {item.vote_average.toFixed(1)}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {isAdding ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : inList ? (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Check className="w-4 h-4" />
                          Added
                        </span>
                      ) : (
                        <Plus className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

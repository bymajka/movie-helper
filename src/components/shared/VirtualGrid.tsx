"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { TrendingItem } from "@/lib/tmdb";
import { useVirtualizer } from "@tanstack/react-virtual";
import { SectionCard } from "../ContentSection/SectionCard";
import Link from "next/link";

interface VirtualGridProps {
    initialItems: TrendingItem[];
    fetchData: (page: number) => Promise<TrendingItem[]>;
    dependencies: unknown[]; 
}

export const VirtualGrid = ({
    initialItems,
    fetchData,
    dependencies
}: VirtualGridProps) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const [items, setItems] = useState<TrendingItem[]>(initialItems);
    const [error, setError] = useState<unknown>(null);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setItems([]);
        setPage(1);
        setHasMore(true);
        setError(null);
        
        (async () => {
            try {
                const results = await fetchData(1);
                if (!cancelled) {
                    setItems(results);
                    setError(null);
                }
            } catch (e) {
                if (!cancelled) setError(e);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, dependencies);

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return;
        
        setIsLoading(true);
        try {
            const nextPage = page + 1;
            const newItems = await fetchData(nextPage);
            
            if (newItems.length > 0) {
                setItems(prev => [...prev, ...newItems]);
                setPage(nextPage);
                setHasMore(newItems.length > 0);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to load more items:', error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasMore, page, fetchData]);

    const rows = useMemo(() => {
        const r: TrendingItem[][] = [];
        for (let i = 0; i < items.length; i += 3) {
            r.push(items.slice(i, i + 3));
        }
        return r;
    }, [items]);

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 310,
        overscan: 6,
    });

    useEffect(() => {
        const virtualItems = rowVirtualizer.getVirtualItems();
        if (!virtualItems.length) return;

        const last = virtualItems[virtualItems.length - 1];
        const threshold = Math.max(0, rows.length - 5);

        if (last.index >= threshold && hasMore && !isLoading) {
            loadMore();
        }
    }, [rowVirtualizer.getVirtualItems(), rows.length, loadMore, hasMore, isLoading]);
    
    if (error) {
        return (
            <div className="p-4 text-red-400">
                An error occurred — please try again.
            </div>
        );
    }

    if (items.length === 0) {
        return <>
        </>
    }

    return (
        <div
            ref={parentRef}
            className="h-[75vh] overflow-auto no-scrollbar relative rounded-lg"
            aria-label="Results"
            role="list"
        >
            <div
                style={{
                    height: rowVirtualizer.getTotalSize(),
                    position: 'relative',
                    width: '100%',
                }}
            >
                {rowVirtualizer.getVirtualItems().map(vRow => {
                    const row = rows[vRow.index] || [];
                    return (
                        <div
                            key={vRow.key}
                            role="listitem"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                transform: `translateY(${vRow.start}px)`,
                                width: "100%",
                                padding: "0.5rem 0",
                            }}
                        >
                            <div className="grid grid-cols-3 gap-4">
                                {row.map(item => (
                                    <Link href={`/${item.media_type}/${item.id}`} key={`${item.id} link`}>
                                        <SectionCard key={item.id} item={item} />
                                    </Link>
                                ))}
                                {row.length < 3 &&
                                    Array.from({ length: 3 - row.length }).map((_, i) => (
                                        <div key={`ph-${i}`} aria-hidden className="invisible" />
                                    ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="py-4 text-center text-sm text-zinc-400">
                {isLoading && "Loading more…"}
                {!hasMore && items.length > 0 && "You've reached the end."}
            </div>
        </div>
    );
};

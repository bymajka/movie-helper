"use client";

import {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface UseResponsiveColumnsOptions {
  minColumnWidth: number;
  gap: number;
}

export function useResponsiveColumns(
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseResponsiveColumnsOptions,
) {
  const { minColumnWidth, gap } = options;
  const [columns, setColumns] = useState<number | null>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const width = entry.contentRect.width;
      // Account for gap in column calculation: (width + gap) / (minColumnWidth + gap)
      const cols = Math.max(1, Math.floor((width + gap) / (minColumnWidth + gap)));
      setColumns(cols);
    });

    const container = containerRef.current;
    if (container) {
      resizeObserver.observe(container);
    }

    return () => resizeObserver.disconnect();
  }, [containerRef, minColumnWidth, gap]);

  return columns;
}

interface VirtualGridProps<T> {
  initialItems: T[];
  fetchData: (page: number) => Promise<T[]>;
  dependencies: unknown[];
  renderItem: (item: T) => ReactNode;
  getItemKey: (item: T) => string | number;
  minColumnWidth?: number;
  gap?: number;
}

const DEFAULT_GAP = 16;

export function VirtualGrid<T>({
  initialItems,
  fetchData,
  dependencies,
  renderItem,
  getItemKey,
  minColumnWidth = 300,
  gap = DEFAULT_GAP,
}: VirtualGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const columns = useResponsiveColumns(parentRef, { minColumnWidth, gap });
  const [items, setItems] = useState<T[]>(initialItems);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, fetchData]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const newItems = await fetchData(nextPage);

      if (newItems.length > 0) {
        setItems((prev) => [...prev, ...newItems]);
        setPage(nextPage);
        setHasMore(newItems.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more items:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, fetchData]);

  const rows = useMemo(() => {
    if (columns === null) return [];
    const r: T[][] = [];
    for (let i = 0; i < items.length; i += columns) {
      r.push(items.slice(i, i + columns));
    }
    return r;
  }, [items, columns]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 280,
    overscan: 6,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const lastVirtualItem = virtualItems[virtualItems.length - 1];

  useEffect(() => {
    if (!lastVirtualItem) return;

    const threshold = Math.max(0, rows.length - 5);

    if (lastVirtualItem.index >= threshold && hasMore && !isLoading) {
      loadMore();
    }
  }, [lastVirtualItem, rows.length, loadMore, hasMore, isLoading]);

  if (error) {
    return (
      <div className="p-4 text-red-400">
        An error occurred — please try again.
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="h-[75vh] overflow-auto no-scrollbar relative rounded-lg"
      aria-label="Results"
      role="list"
    >
      {items.length > 0 && columns !== null && (
        <>
          <div
            style={{
              height: rowVirtualizer.getTotalSize(),
              position: "relative",
              width: "100%",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((vRow) => {
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
                  <div
                    className="grid"
                    style={{
                      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                      gap: `${gap}px`,
                    }}
                  >
                    {row.map((item) => (
                      <div key={getItemKey(item)}>{renderItem(item)}</div>
                    ))}
                    {row.length < columns &&
                      Array.from({ length: columns - row.length }).map(
                        (_, i) => (
                          <div
                            key={`ph-${i}`}
                            aria-hidden
                            className="invisible"
                          />
                        ),
                      )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="py-4 text-center text-sm text-zinc-400">
            {isLoading && "Loading more…"}
            {!hasMore && items.length > 0 && "You've reached the end."}
          </div>
        </>
      )}
    </div>
  );
}

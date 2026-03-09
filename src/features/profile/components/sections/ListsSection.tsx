"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAccountLists } from "@/services/account";
import { ContentSection, Skeleton, Button } from "@/shared/components";
import { getGridItemVisibilityClass } from "@/shared/utils";
import type { UserList } from "@/services/account";
import { List, AlertCircle, Plus } from "lucide-react";
import { ROUTES } from "@/shared/router";
import { MEDIA_GRID_CLASS } from "@/shared/constants";
import { CreateListModal } from "../CreateListModal";

const MAX_ITEMS = 12;

interface ListsSectionProps {
  accountId: number | null;
  sessionId: string | null;
  expanded?: boolean;
  onViewAll?: () => void;
}

interface ListCardProps {
  list: UserList;
}

function ListCard({ list }: ListCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-card transition-all duration-300 group-hover:brightness-110 ring-inset group-hover:ring-2 group-hover:ring-primary/50">
        <div className="absolute inset-0 flex items-center justify-center">
          <List className="w-12 h-12 text-muted-foreground" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <span className="text-white/80 text-xs">
            {list.item_count} {list.item_count === 1 ? "item" : "items"}
          </span>
          <h3 className="text-primary text-sm font-medium line-clamp-2">
            {list.name}
          </h3>
        </div>
      </div>
    </div>
  );
}

export function ListsSection({
  accountId,
  sessionId,
  expanded = false,
  onViewAll,
}: ListsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, loading, error, refetch } = useAccountLists(accountId, sessionId);

  const displayedLists = useMemo(() => {
    if (!data?.results) return [];
    return expanded ? data.results : data.results.slice(0, MAX_ITEMS);
  }, [data?.results, expanded]);

  if (loading) {
    return (
      <ContentSection title="My Lists" withButton={!expanded}>
        <div className={MEDIA_GRID_CLASS}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-[2/3] rounded-2xl bg-card" />
            </div>
          ))}
        </div>
      </ContentSection>
    );
  }

  if (error) {
    return (
      <ContentSection title="My Lists" withButton={false}>
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <AlertCircle className="w-16 h-16 text-destructive" />
          <p className="text-lg text-muted-foreground">
            Failed to load lists
          </p>
          <Button variant="ghost" onClick={refetch}>
            Try Again
          </Button>
        </div>
      </ContentSection>
    );
  }

  if (!data?.results?.length) {
    return (
      <>
        <ContentSection title="My Lists" withButton={false}>
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <List className="w-16 h-16 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              No lists created yet
            </p>
            <Button variant="ghost" onClick={() => setIsModalOpen(true)}>
              Create List
            </Button>
          </div>
        </ContentSection>
        <CreateListModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          sessionId={sessionId}
          onSuccess={refetch}
        />
      </>
    );
  }

  return (
    <>
      <ContentSection
        title="My Lists"
        withButton={!expanded}
        onViewAll={onViewAll}
      >
        <div className={MEDIA_GRID_CLASS}>
          {displayedLists.map((list, index) => (
            <Link
              key={list.id}
              href={ROUTES.LIST(list.id)}
              className={expanded ? "" : getGridItemVisibilityClass(index)}
            >
              <ListCard list={list} />
            </Link>
          ))}
          <button
            onClick={() => setIsModalOpen(true)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-card border-2 border-dashed border-muted-foreground/30 transition-all duration-300 group-hover:border-primary/50 group-hover:bg-card/80 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                <Plus className="w-10 h-10" />
                <span className="text-sm font-medium">Create List</span>
              </div>
            </div>
          </button>
        </div>
      </ContentSection>
      <CreateListModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        sessionId={sessionId}
        onSuccess={refetch}
      />
    </>
  );
}

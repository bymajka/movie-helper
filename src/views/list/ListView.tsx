"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useListDetails, removeFromList } from "@/services/account";
import { useUserAuthStore } from "@/stores/userAuthStore";
import { Breadcrumb, Button, Card, Skeleton } from "@/shared/components";
import { MEDIA_GRID_CLASS } from "@/shared/constants";
import { AddItemSearch, DeleteListDialog } from "@/features/list";
import { ListItemCard, ListViewError, ListViewNotFound } from "./components";

interface ListViewProps {
  id: number;
}

export function ListView({ id }: ListViewProps) {
  const { data, loading, error, refetch } = useListDetails(id);
  const { sessionId } = useUserAuthStore();
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleRemoveItem = async (itemId: number) => {
    if (!sessionId || removingItemId !== null) return;

    setRemovingItemId(itemId);
    try {
      await removeFromList({ listId: id, sessionId, mediaId: itemId });
      toast.success("Item removed from list");
      refetch();
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setRemovingItemId(null);
    }
  };

  if (loading) return <ListViewLoading />;
  if (error) return <ListViewError message={error} onRetry={refetch} />;
  if (!data) return <ListViewNotFound />;

  return (
    <>
      <section className="flex flex-col gap-5 min-w-0">
        <Breadcrumb
          className="md:mt-5 font-medium text-base"
          items={[
            { label: "Profile", href: "/profile" },
            { label: "My Lists", href: "/profile?section=lists" },
            { label: data.name, href: "#" },
          ]}
        />

        <Card className="p-6 rounded-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-4xl font-semibold">{data.name}</h1>
              {data.description && (
                <p className="text-muted-foreground mt-1">{data.description}</p>
              )}
              <span className="text-md text-muted-foreground">
                {data.item_count} {data.item_count === 1 ? "item" : "items"}
              </span>
              <span className="text-md text-muted-foreground ml-2">
                {`Created by ${data.created_by}`}
              </span>
            </div>

            {sessionId && (
              <div className="flex items-center gap-4">
                <AddItemSearch
                  listId={id}
                  sessionId={sessionId}
                  existingItemIds={data.items.map((item) => item.id)}
                  onItemAdded={refetch}
                />
                <Button
                  variant="ghost"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="flex items-center gap-2 w-fit hover:!bg-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete List
                </Button>
              </div>
            )}
          </div>
        </Card>

        {data.items.length === 0 ? (
          <Card className="p-6 rounded-3xl">
            <p className="text-muted-foreground text-center py-8">
              This list is empty. Add some movies to get started!
            </p>
          </Card>
        ) : (
          <div className={MEDIA_GRID_CLASS}>
            {data.items.map((item) => (
              <ListItemCard
                key={item.id}
                item={item}
                onRemove={sessionId ? handleRemoveItem : undefined}
                isRemoving={removingItemId === item.id}
              />
            ))}
          </div>
        )}
      </section>

      <DeleteListDialog
        listId={id}
        listName={data.name}
        sessionId={sessionId}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}

function ListViewLoading() {
  return (
    <section className="flex flex-col gap-5 min-w-0">
      <div className="md:mt-5">
        <Skeleton className="bg-card h-4 w-60" />
      </div>

      <Card className="p-6 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="bg-background h-8 w-48" />
            <Skeleton className="bg-background h-4 w-32" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="bg-background h-10 w-28" />
            <Skeleton className="bg-background h-10 w-28" />
          </div>
        </div>
      </Card>

      <div className={MEDIA_GRID_CLASS}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[2/3] rounded-2xl bg-card" />
        ))}
      </div>
    </section>
  );
}

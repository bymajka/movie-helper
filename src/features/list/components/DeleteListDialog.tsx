"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteList } from "@/services/account";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components";
import { ROUTES } from "@/shared/router";

interface DeleteListDialogProps {
  listId: number;
  listName: string;
  sessionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteListDialog({
  listId,
  listName,
  sessionId,
  open,
  onOpenChange,
}: DeleteListDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!sessionId) return;

    setIsDeleting(true);
    try {
      await deleteList({ listId, sessionId });
      toast.success("List deleted successfully");
      router.push(ROUTES.PROFILE_LISTS);
    } catch {
      toast.error("Failed to delete list");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>Delete List</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{listName}&quot;? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

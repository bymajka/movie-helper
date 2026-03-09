import { ListX } from "lucide-react";
import { Card } from "@/shared/components";

export function ListViewNotFound() {
  return (
    <section className="flex flex-col gap-5 min-w-0 md:mt-5">
      <Card className="p-8 rounded-3xl">
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <ListX className="w-16 h-16 text-muted-foreground" />
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">List not found</h2>
            <p className="text-muted-foreground">
              This list may have been deleted or doesn&apos;t exist.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}

"use client";

import { AlertCircle } from "lucide-react";
import { Button, Card } from "@/shared/components";

interface ListViewErrorProps {
  message: string;
  onRetry: () => void;
}

export function ListViewError({ message, onRetry }: ListViewErrorProps) {
  return (
    <section className="flex flex-col gap-5 min-w-0 md:mt-5">
      <Card className="p-8 rounded-3xl">
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <AlertCircle className="w-16 h-16 text-destructive" />
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Failed to load list</h2>
            <p className="text-muted-foreground mb-4">{message}</p>
          </div>
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      </Card>
    </section>
  );
}

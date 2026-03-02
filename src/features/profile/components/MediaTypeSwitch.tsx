"use client";

import { cn } from "@/shared/utils";

export type MediaType = "movies" | "series";

interface MediaTypeSwitchProps {
  value: MediaType;
  onChange: (value: MediaType) => void;
}

export function MediaTypeSwitch({ value, onChange }: MediaTypeSwitchProps) {
  return (
    <div className="inline-flex rounded-full bg-card p-1 gap-1">
      <button
        type="button"
        onClick={() => onChange("movies")}
        className={cn(
          "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
          value === "movies"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-primary",
        )}
      >
        Movies
      </button>
      <button
        type="button"
        onClick={() => onChange("series")}
        className={cn(
          "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
          value === "series"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-primary",
        )}
      >
        Series
      </button>
    </div>
  );
}

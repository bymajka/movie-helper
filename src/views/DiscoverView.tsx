import { FiltersBar } from "@/features/filters";
import { DiscoverGrid } from "@/features/discover-grid";
import { ContentSection } from "@/shared/components/ContentSection";
import type { TrendingItem } from "@/services/media";

interface DiscoverViewProps {
  initialItems: TrendingItem[];
}

export const DiscoverView = ({ initialItems }: DiscoverViewProps) => {
  return (
    <ContentSection className="flex flex-col gap-6 flex-1" withButton={false}>
      <FiltersBar />
      {initialItems.length === 0 ? (
        <div className="flex-1 text-primary text-2xl font-semibold flex items-center justify-center h-full">
          No results found
        </div>
      ) : (
        <DiscoverGrid initialItems={initialItems} />
      )}
    </ContentSection>
  );
};

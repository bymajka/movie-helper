import { SearchGrid } from "@/features/search-grid";
import { ContentSection } from "@/shared/components/ContentSection";
import type { TrendingItem } from "@/services/media";

interface SearchViewProps {
  query: string;
  initialItems: TrendingItem[];
}

export const SearchView = ({ query, initialItems }: SearchViewProps) => {
  if (initialItems.length === 0) {
    return (
      <div className="text-primary text-2xl font-semibold flex items-center justify-center h-full">
        No results found
      </div>
    );
  }

  return (
    <ContentSection title={`Search results for "${query}"`} className="mt-6" withButton={false}>
      <SearchGrid initialItems={initialItems} query={query} />
    </ContentSection>
  );
};

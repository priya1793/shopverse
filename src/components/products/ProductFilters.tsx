import { FilterState } from "@/types";
import { categories, brands } from "@/data/products";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  filters: FilterState;
  updateFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => void;
  resetFilters: () => void;
  resultCount: number;
}

export function ProductFilters({
  filters,
  updateFilter,
  resetFilters,
  resultCount,
}: ProductFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleArrayFilter = <K extends keyof FilterState>(
    key: K,
    value: string,
  ) => {
    const arr = filters[key] as string[];
    const updated = arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];
    updateFilter(key, updated as FilterState[K]);
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000 ||
    filters.search;

  const filterContent = (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sort By
        </Label>
        <Select
          value={filters.sortBy}
          onValueChange={(v) =>
            updateFilter("sortBy", v as FilterState["sortBy"])
          }
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Category
        </Label>
        <div className="mt-2 space-y-2">
          {categories.map((c) => (
            <label
              key={c.slug}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={filters.categories.includes(c.name)}
                onCheckedChange={() => toggleArrayFilter("categories", c.name)}
              />
              <span className="text-sm">{c.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {c.count}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Brand
        </Label>
        <div className="mt-2 space-y-2">
          {brands.map((b) => (
            <label key={b} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.brands.includes(b)}
                onCheckedChange={() => toggleArrayFilter("brands", b)}
              />
              <span className="text-sm">{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Price Range
        </Label>
        <div className="mt-4 px-1">
          <Slider
            value={[filters.priceRange[0], filters.priceRange[1]]}
            min={0}
            max={1000}
            step={10}
            onValueChange={(v) =>
              updateFilter("priceRange", [v[0], v[1]] as [number, number])
            }
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="w-full gap-2"
        >
          <X className="h-3 w-3" /> Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between lg:hidden mb-4">
        <p className="text-sm text-muted-foreground">{resultCount} products</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </Button>
      </div>

      {/* Mobile filters */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all",
          mobileOpen ? "max-h-[2000px] mb-6" : "max-h-0",
        )}
      >
        <div className="rounded-lg border bg-card p-4">{filterContent}</div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans text-sm font-semibold">Filters</h3>
            <span className="text-xs text-muted-foreground">
              {resultCount} results
            </span>
          </div>
          {filterContent}
        </div>
      </aside>
    </>
  );
}

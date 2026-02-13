import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { SkeletonGrid } from "@/components/common/SkeletonCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useProducts } from "@/hooks/useProducts";
import { PackageOpen } from "lucide-react";

export default function Products() {
  const [searchParams] = useSearchParams();
  const { products, filters, updateFilter, resetFilters, loading } =
    useProducts();

  useEffect(() => {
    const cat = searchParams.get("category");
    const search = searchParams.get("search");
    if (cat) updateFilter("categories", [cat]);
    if (search) updateFilter("search", search);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="text-muted-foreground mt-1">
            Discover our curated collection
          </p>
        </div>

        <div className="flex gap-8">
          <ProductFilters
            filters={filters}
            updateFilter={updateFilter}
            resetFilters={resetFilters}
            resultCount={products.length}
          />

          <div className="flex-1">
            <div className="hidden lg:flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {products.length} products found
              </p>
            </div>

            {loading ? (
              <SkeletonGrid />
            ) : products.length === 0 ? (
              <EmptyState
                icon={PackageOpen}
                title="No products found"
                description="Try adjusting your filters or search terms"
                actionLabel="Clear Filters"
                onAction={resetFilters}
              />
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {products.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

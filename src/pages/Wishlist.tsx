import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useWishlist } from "@/context/WishlistContext";
import { Heart } from "lucide-react";

export default function Wishlist() {
  const { items } = useWishlist();

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-muted-foreground mb-8">{items.length} items saved</p>

        {items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Save items you love by tapping the heart icon."
            actionLabel="Browse Products"
            actionTo="/products"
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

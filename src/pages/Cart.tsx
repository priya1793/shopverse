import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, Bookmark, ShoppingBag, Tag } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductCard } from "@/components/products/ProductCard";
import { products } from "@/data/products";

export default function Cart() {
  const navigate = useNavigate();
  const {
    activeItems,
    savedItems,
    removeItem,
    updateQuantity,
    toggleSaveForLater,
    moveToCart,
    subtotal,
    discount,
    tax,
    shipping,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    itemCount,
  } = useCart();
  const [couponCode, setCouponCode] = useState("");

  const recommended = products
    .filter((p) => !activeItems.find((i) => i.product.id === p.id))
    .slice(0, 4);

  if (activeItems.length === 0 && savedItems.length === 0) {
    return (
      <Layout>
        <div className="container py-8">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Looks like you haven't added anything yet."
            actionLabel="Start Shopping"
            actionTo="/products"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({itemCount})</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {activeItems.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 rounded-lg border bg-card p-4"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-24 w-24 rounded-md object-cover bg-muted cursor-pointer"
                  onClick={() => navigate(`/product/${item.product.id}`)}
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.product.brand}
                      {item.selectedSize && ` · Size: ${item.selectedSize}`}
                      {item.selectedColor && ` · ${item.selectedColor}`}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-md border">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="px-2 py-1 hover:bg-muted"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="px-2 py-1 hover:bg-muted"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => toggleSaveForLater(item.product.id)}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <Bookmark className="h-3 w-3" />
                        Save
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-xs text-destructive hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                    </div>
                    <p className="font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Saved for Later */}
            {savedItems.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold mb-4">
                  Saved for Later ({savedItems.length})
                </h3>
                {savedItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 rounded-lg border bg-muted/30 p-4 mb-3"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-sm font-semibold mt-1">
                        ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveToCart(item.product.id)}
                    >
                      Move to Cart
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-card p-6 sticky top-20">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

              {/* Coupon */}
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    applyCoupon(couponCode);
                    setCouponCode("");
                  }}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  Apply
                </Button>
              </div>
              {appliedCoupon && (
                <div className="flex items-center justify-between rounded-md bg-success/10 p-2 mb-4 text-xs">
                  <span className="text-success font-medium">
                    "{appliedCoupon.code}" applied
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                size="lg"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="ghost"
                className="w-full mt-2"
                onClick={() => navigate("/products")}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommended.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {recommended.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}

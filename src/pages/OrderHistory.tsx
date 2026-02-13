import { Layout } from "@/components/layout/Layout";
import { EmptyState } from "@/components/common/EmptyState";
import { useOrders } from "@/context/OrderContext";
import { Package, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function OrderHistory() {
  const { orders } = useOrders();
  const navigate = useNavigate();

  const statusColor = (s: string) => {
    if (s === "delivered") return "bg-success/10 text-success";
    if (s === "shipped") return "bg-primary/10 text-primary";
    return "bg-warning/10 text-warning";
  };

  return (
    <Layout>
      <div className="container py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>

        {orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="Your order history will appear here after your first purchase."
            actionLabel="Start Shopping"
            actionTo="/products"
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={statusColor(order.status)}
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {order.items.map((item) => (
                    <img
                      key={item.product.id}
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-14 w-14 rounded object-cover bg-muted shrink-0"
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <p className="font-semibold">${order.total.toFixed(2)}</p>
                  <span className="text-xs text-muted-foreground">
                    {order.items.length} item(s)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

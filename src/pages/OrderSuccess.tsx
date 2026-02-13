import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/context/OrderContext";
import { CheckCircle2, Package } from "lucide-react";

export default function OrderSuccess() {
  const { id } = useParams<{ id: string }>();
  const { getOrder } = useOrders();
  const navigate = useNavigate();
  const order = id ? getOrder(id) : undefined;

  return (
    <Layout>
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="font-sans text-2xl font-bold">Order Placed!</h1>
          {order && (
            <p className="mt-2 text-muted-foreground">
              Order #{order.id} · ${order.total.toFixed(2)}
            </p>
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            Thank you for your purchase. You'll receive a confirmation email
            shortly.
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <Button onClick={() => navigate("/orders")}>
              <Package className="mr-2 h-4 w-4" />
              View Orders
            </Button>
            <Button variant="outline" onClick={() => navigate("/products")}>
              Continue Shopping
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

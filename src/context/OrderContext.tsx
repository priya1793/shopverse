import React, { createContext, useContext, useState, useCallback } from "react";
import { Order, CartItem, ShippingAddress } from "@/types";

interface OrderContextType {
  orders: Order[];
  placeOrder: (params: {
    items: CartItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
    shippingAddress: ShippingAddress;
    deliveryMethod: string;
    paymentMethod: string;
  }) => Order;
  getOrder: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const placeOrder = useCallback(
    (params: {
      items: CartItem[];
      subtotal: number;
      tax: number;
      shipping: number;
      discount: number;
      total: number;
      shippingAddress: ShippingAddress;
      deliveryMethod: string;
      paymentMethod: string;
    }): Order => {
      const order: Order = {
        id: `ORD-${Date.now().toString(36).toUpperCase()}`,
        ...params,
        status: "processing",
        date: new Date().toISOString(),
      };
      setOrders((prev) => [order, ...prev]);
      return order;
    },
    [],
  );

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders],
  );

  return (
    <OrderContext.Provider value={{ orders, placeOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};

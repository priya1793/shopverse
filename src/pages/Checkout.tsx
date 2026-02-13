import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { ShippingAddress } from "@/types";
import { Check, CreditCard, Truck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const steps = ["Shipping", "Delivery", "Payment", "Review"];

export default function Checkout() {
  const navigate = useNavigate();
  const { activeItems, subtotal, discount, tax, shipping, total, clearCart } =
    useCart();
  const { placeOrder } = useOrders();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold">Sign in to checkout</h1>
          <p className="text-muted-foreground mt-2">
            You need an account to complete your purchase.
          </p>
          <Button
            className="mt-6"
            onClick={() => navigate("/login?redirect=/checkout")}
          >
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }

  if (activeItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const handlePlaceOrder = () => {
    const order = placeOrder({
      items: activeItems,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      shippingAddress: address,
      deliveryMethod,
      paymentMethod,
    });
    clearCart();
    toast.success("Order placed successfully!");
    navigate(`/order-success/${order.id}`);
  };

  const isAddressValid =
    address.fullName &&
    address.address &&
    address.city &&
    address.state &&
    address.zipCode;

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  i <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-sm hidden sm:inline",
                  i <= step ? "font-medium" : "text-muted-foreground",
                )}
              >
                {s}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-px w-8 sm:w-12",
                    i < step ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            {/* Step 0: Shipping */}
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="h-5 w-5" /> Shipping Address
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label>Full Name</Label>
                    <Input
                      value={address.fullName}
                      onChange={(e) =>
                        setAddress((a) => ({ ...a, fullName: e.target.value }))
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Address</Label>
                    <Input
                      value={address.address}
                      onChange={(e) =>
                        setAddress((a) => ({ ...a, address: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input
                      value={address.city}
                      onChange={(e) =>
                        setAddress((a) => ({ ...a, city: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input
                      value={address.state}
                      onChange={(e) =>
                        setAddress((a) => ({ ...a, state: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Zip Code</Label>
                    <Input
                      value={address.zipCode}
                      onChange={(e) =>
                        setAddress((a) => ({ ...a, zipCode: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={address.phone}
                      onChange={(e) =>
                        setAddress((a) => ({ ...a, phone: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <Button
                  className="mt-4"
                  onClick={() => setStep(1)}
                  disabled={!isAddressValid}
                >
                  Continue to Delivery
                </Button>
              </div>
            )}

            {/* Step 1: Delivery */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Truck className="h-5 w-5" /> Delivery Method
                </h2>
                {[
                  {
                    id: "standard",
                    label: "Standard Shipping",
                    desc: "5-7 business days",
                    price: shipping === 0 ? "Free" : "$9.99",
                  },
                  {
                    id: "express",
                    label: "Express Shipping",
                    desc: "2-3 business days",
                    price: "$19.99",
                  },
                  {
                    id: "overnight",
                    label: "Overnight",
                    desc: "Next business day",
                    price: "$29.99",
                  },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDeliveryMethod(d.id)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-lg border p-4 text-left transition-colors",
                      deliveryMethod === d.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/30",
                    )}
                  >
                    <div>
                      <p className="font-medium text-sm">{d.label}</p>
                      <p className="text-xs text-muted-foreground">{d.desc}</p>
                    </div>
                    <span className="font-semibold text-sm">{d.price}</span>
                  </button>
                ))}
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep(0)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(2)}>
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CreditCard className="h-5 w-5" /> Payment Method
                </h2>
                {[
                  {
                    id: "card",
                    label: "Credit/Debit Card",
                    desc: "Visa, Mastercard, Amex",
                  },
                  {
                    id: "paypal",
                    label: "PayPal",
                    desc: "Pay with your PayPal account",
                  },
                  {
                    id: "cod",
                    label: "Cash on Delivery",
                    desc: "Pay when you receive",
                  },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPaymentMethod(p.id)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-lg border p-4 text-left transition-colors",
                      paymentMethod === p.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/30",
                    )}
                  >
                    <div>
                      <p className="font-medium text-sm">{p.label}</p>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                  </button>
                ))}
                <p className="text-xs text-muted-foreground mt-2">
                  This is a mock checkout. No real payment will be processed.
                </p>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)}>Review Order</Button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Review Your Order</h2>
                <div className="rounded-lg border p-4 space-y-2 text-sm">
                  <p>
                    <strong>Ship to:</strong> {address.fullName},{" "}
                    {address.address}, {address.city}, {address.state}{" "}
                    {address.zipCode}
                  </p>
                  <p>
                    <strong>Delivery:</strong> {deliveryMethod}
                  </p>
                  <p>
                    <strong>Payment:</strong> {paymentMethod}
                  </p>
                </div>
                <div className="space-y-2">
                  {activeItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3 text-sm"
                    >
                      <img
                        src={item.product.image}
                        alt=""
                        className="h-12 w-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button size="lg" onClick={handlePlaceOrder}>
                    Place Order · ${total.toFixed(2)}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border bg-card p-5 sticky top-20">
              <h3 className="font-semibold mb-4">Order Summary</h3>
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
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

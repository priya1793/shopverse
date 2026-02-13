import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import { CartItem, Product, Coupon } from "@/types";
import { availableCoupons } from "@/data/products";
import { toast } from "sonner";

interface CartState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; size?: string; color?: string }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "TOGGLE_SAVE_FOR_LATER"; productId: string }
  | { type: "MOVE_TO_CART"; productId: string }
  | { type: "APPLY_COUPON"; coupon: Coupon }
  | { type: "REMOVE_COUPON" }
  | { type: "CLEAR_CART" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.product.id === action.product.id && !i.savedForLater,
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.product.id && !i.savedForLater
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            product: action.product,
            quantity: 1,
            selectedSize: action.size,
            selectedColor: action.color,
          },
        ],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.product.id !== action.productId),
      };
    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.product.id !== action.productId),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, quantity: action.quantity }
            : i,
        ),
      };
    case "TOGGLE_SAVE_FOR_LATER":
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, savedForLater: !i.savedForLater, quantity: 1 }
            : i,
        ),
      };
    case "MOVE_TO_CART":
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, savedForLater: false }
            : i,
        ),
      };
    case "APPLY_COUPON":
      return { ...state, appliedCoupon: action.coupon };
    case "REMOVE_COUPON":
      return { ...state, appliedCoupon: null };
    case "CLEAR_CART":
      return { items: [], appliedCoupon: null };
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  activeItems: CartItem[];
  savedItems: CartItem[];
  addItem: (product: Product, size?: string, color?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleSaveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    appliedCoupon: null,
  });

  const activeItems = useMemo(
    () => state.items.filter((i) => !i.savedForLater),
    [state.items],
  );
  const savedItems = useMemo(
    () => state.items.filter((i) => i.savedForLater),
    [state.items],
  );

  const subtotal = useMemo(
    () => activeItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [activeItems],
  );
  const discount = useMemo(() => {
    if (!state.appliedCoupon) return 0;
    if (state.appliedCoupon.type === "percentage")
      return subtotal * (state.appliedCoupon.value / 100);
    return state.appliedCoupon.value;
  }, [state.appliedCoupon, subtotal]);
  const shipping = useMemo(() => (subtotal > 100 ? 0 : 9.99), [subtotal]);
  const tax = useMemo(() => (subtotal - discount) * 0.08, [subtotal, discount]);
  const total = useMemo(
    () => Math.max(0, subtotal - discount + tax + shipping),
    [subtotal, discount, tax, shipping],
  );
  const itemCount = useMemo(
    () => activeItems.reduce((sum, i) => sum + i.quantity, 0),
    [activeItems],
  );

  const addItem = useCallback(
    (product: Product, size?: string, color?: string) => {
      dispatch({ type: "ADD_ITEM", product, size, color });
      toast.success(`${product.name} added to cart`);
    },
    [],
  );

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_ITEM", productId });
    toast.info("Item removed from cart");
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
  }, []);

  const toggleSaveForLater = useCallback((productId: string) => {
    dispatch({ type: "TOGGLE_SAVE_FOR_LATER", productId });
    toast.info("Item moved");
  }, []);

  const moveToCart = useCallback((productId: string) => {
    dispatch({ type: "MOVE_TO_CART", productId });
    toast.success("Item moved to cart");
  }, []);

  const applyCoupon = useCallback(
    (code: string): boolean => {
      const coupon = availableCoupons.find(
        (c) => c.code.toLowerCase() === code.toLowerCase(),
      );
      if (!coupon) {
        toast.error("Invalid coupon code");
        return false;
      }
      if (coupon.minOrder && subtotal < coupon.minOrder) {
        toast.error(`Minimum order of $${coupon.minOrder} required`);
        return false;
      }
      dispatch({ type: "APPLY_COUPON", coupon });
      toast.success(`Coupon "${coupon.code}" applied!`);
      return true;
    },
    [subtotal],
  );

  const removeCoupon = useCallback(() => {
    dispatch({ type: "REMOVE_COUPON" });
    toast.info("Coupon removed");
  }, []);

  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        activeItems,
        savedItems,
        addItem,
        removeItem,
        updateQuantity,
        toggleSaveForLater,
        moveToCart,
        applyCoupon,
        removeCoupon,
        clearCart,
        appliedCoupon: state.appliedCoupon,
        subtotal,
        discount,
        tax,
        shipping,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

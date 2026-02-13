export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  inStock: boolean;
  tags: string[];
  featured?: boolean;
  trending?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  savedForLater?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: "processing" | "shipped" | "delivered";
  date: string;
  shippingAddress: ShippingAddress;
  deliveryMethod: string;
  paymentMethod: string;
}

export interface FilterState {
  search: string;
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  sizes: string[];
  ratings: number[];
  sortBy: "relevance" | "price-low" | "price-high" | "rating" | "newest";
}

export interface Coupon {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder?: number;
}

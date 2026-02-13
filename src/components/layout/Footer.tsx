import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              to="/"
              className="flex items-center gap-2 font-display text-lg font-bold text-primary"
            >
              <ShoppingBag className="h-5 w-5" />
              ShopVerse
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Premium products curated for modern living. Quality meets style.
            </p>
          </div>
          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider">
              Shop
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/products"
                  className="hover:text-foreground transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Footwear"
                  className="hover:text-foreground transition-colors"
                >
                  Footwear
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Clothing"
                  className="hover:text-foreground transition-colors"
                >
                  Clothing
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Electronics"
                  className="hover:text-foreground transition-colors"
                >
                  Electronics
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider">
              Support
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="hover:text-foreground cursor-default">
                  Help Center
                </span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-default">
                  Shipping Info
                </span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-default">
                  Returns
                </span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-default">
                  Contact Us
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider">
              Company
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="hover:text-foreground cursor-default">
                  About Us
                </span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-default">
                  Careers
                </span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-default">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-default">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} ShopVerse. All rights reserved. Built
          with React + TypeScript.
        </div>
      </div>
    </footer>
  );
}

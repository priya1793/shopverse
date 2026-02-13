import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { categories, products } from "@/data/products";

const Categories = () => {
  const getCategoryProducts = (categoryName: string) =>
    products.filter((p) => p.category === categoryName).slice(0, 4);

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-3xl font-extrabold md:text-4xl">
          Shop by Category
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse our curated collections
        </p>

        <div className="mt-10 space-y-14">
          {categories.map((cat, ci) => (
            <motion.section
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.1 }}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-bold">{cat.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {cat.count} products
                  </p>
                </div>
                <Link
                  to={`/products?category=${cat.name}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View all →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {getCategoryProducts(cat.name).map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
                  >
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground">{p.brand}</p>
                      <h3 className="mt-1 text-sm font-semibold leading-tight line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="mt-1 text-sm font-bold text-primary">
                        ${p.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;

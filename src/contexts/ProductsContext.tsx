import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "../types/product";
import { fetchAllProducts } from "../api/products";

interface ProductsContextValue {
  products: Product[] | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

// ⭐ Module-level cache (persists across route changes)
let cachedProducts: Product[] | null = null;

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[] | null>(cachedProducts);
  const [loading, setLoading] = useState(!cachedProducts);
  const [error, setError] = useState<string | null>(null);

  // ⭐ Fetch once
  useEffect(() => {
    if (cachedProducts) return;

    setLoading(true);
    fetchAllProducts()
      .then((data) => {
        cachedProducts = data;
        setProducts(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "API error");
      })
      .finally(() => setLoading(false));
  }, []);

  // ⭐ Optional: allow manual refetch
  async function refresh() {
    setLoading(true);
    try {
      const data = await fetchAllProducts();
      cachedProducts = data;
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "API error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProductsContext.Provider value={{ products, loading, error, refresh }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductsContext() {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error("useProductsContext must be used inside <ProductsProvider>");
  }
  return ctx;
}

// Only used in tests
export function __resetProductsCache() {
  cachedProducts = null;
}

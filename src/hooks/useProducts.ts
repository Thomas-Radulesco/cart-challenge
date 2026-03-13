import { useEffect, useState } from 'react';
import type { Product } from '../types/product';
import { fetchAllProducts } from '../api/products';

let cachedProducts: Product[] | null = null;

export function useProducts() {
  const [products, setProducts] = useState<Product[] | null>(cachedProducts);
  const [loading, setLoading] = useState(!cachedProducts);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedProducts) return;
    setLoading(true);
    setError(null);
    fetchAllProducts()
      .then((data) => {
        cachedProducts = data;
        setProducts(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'API error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
}

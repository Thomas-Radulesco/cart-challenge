import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { fetchCategories } from "../api/products";

interface CategoriesContextValue {
  categories: string[] | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextValue | undefined>(
  undefined
);

// ⭐ Module-level cache (persists across route changes)
let cachedCategories: string[] | null = null;

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<string[] | null>(
    cachedCategories
  );
  const [loading, setLoading] = useState(!cachedCategories);
  const [error, setError] = useState<string | null>(null);

  // ⭐ Fetch once
  useEffect(() => {
    if (cachedCategories) return;

    setLoading(true);
    fetchCategories()
      .then((data) => {
        cachedCategories = data;
        setCategories(data);
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
      const data = await fetchCategories();
      cachedCategories = data;
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "API error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CategoriesContext.Provider
      value={{ categories, loading, error, refresh }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategoriesContext() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error(
      "useCategoriesContext must be used inside <CategoriesProvider>"
    );
  }
  return ctx;
}

import { useLocation, useParams } from "react-router-dom";
import { useProductsContext } from "@/contexts/ProductsContext";
import {
  AllProductsCategory,
  capitalizeCategory,
} from "@/utils/categories";
import { ProductCard } from "@/components/product/ProductCard";
import { SkeletonCard } from "@/components/product/SkeletonCard";

function PageHeader({ title }: { title: string }) {
  return (
    <>
      <h1>Welcome to the shop</h1>
      <h2>{title}</h2>
    </>
  );
}

function NoProducts({ title }: { title: string }) {
  return (
    <div>
      <PageHeader title={title} />
      <div>
        <h3>No products found.</h3>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { products, loading, error } = useProductsContext();
  const { name: category } = useParams();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const q = params.get("q");
  const cat = params.get("cat");

  const normalizedCategory = category?.toLowerCase();
  const appliedCategory = category ?? (cat && cat !== AllProductsCategory ? cat : undefined);
  const heading = capitalizeCategory(appliedCategory);
  

  // -----------------------------
  // Loading
  // -----------------------------
  if (loading) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // -----------------------------
  // Error
  // -----------------------------
  if (error) return <p>Error: {error}</p>;

  // -----------------------------
  // No products at all
  // -----------------------------
  if (!products || products.length === 0) {
    return <NoProducts title={heading} />;
  }

  // -----------------------------
  // Filtering
  // -----------------------------
  let filtered = products;

  if (
    normalizedCategory &&
    normalizedCategory !== AllProductsCategory.toLowerCase()
  ) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === normalizedCategory
    );
  }

  if (cat && cat !== AllProductsCategory) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === cat.toLowerCase()
    );
  }

  if (q) {
    const qLower = q.toLowerCase();
    filtered = filtered.filter((p) =>
      p.title.toLowerCase().includes(qLower)
    );
  }

  // -----------------------------
  // No filtered results
  // -----------------------------
  if (filtered.length === 0) {
    return <NoProducts title={heading} />;
  }

  // -----------------------------
  // Main layout
  // -----------------------------
  
  return (
    <div>
      <PageHeader title={heading} />

      <div>
        <h1>Products</h1>

        <div
          data-testid="products-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

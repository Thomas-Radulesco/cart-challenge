import { useLocation } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useParams } from 'react-router-dom';
import {
  AllProductsCategory,
  capitalizeCategory,
} from '../hooks/useCategories';
import { ProductCard } from '../components/product/ProductCard';
import { SkeletonCard } from '../components/product/SkeletonCard';

export default function HomePage() {
  const { products, loading, error } = useProducts();
  const { name: category } = useParams();

  const normalizedCategory = category?.toLowerCase();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const q = params.get('q');
  const cat = params.get('cat');

  if (loading) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;
  if (!products || products.length === 0) return <p>No products found.</p>;

  let filtered = products;

  if (
    normalizedCategory &&
    normalizedCategory !== AllProductsCategory.toLowerCase()
  ) {
    filtered = filtered.filter(
      (product) => product.category.toLowerCase() === normalizedCategory,
    );
  }

  if (cat && cat !== AllProductsCategory) {
    filtered = filtered.filter((product) => product.category === cat);
  }

  if (q) {
    filtered = filtered.filter((product) =>
      product.title.toLowerCase().includes(q.toLowerCase()),
    );
  }

  return (
    <div>
      <h1>Welcome to the shop</h1>
      <h2>
        {category && category !== AllProductsCategory
          ? `${capitalizeCategory(category)}`
          : AllProductsCategory}
      </h2>

      <div>
        <h1>Products</h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem',
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

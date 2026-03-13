import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import * as useProductsHook from '../hooks/useProducts';
import { CartProvider } from '../contexts/CartContext'; // Add this import
import { type Product } from '../types/Product';
import { useParams } from 'react-router-dom';

// Mock the hooks
vi.mock('../hooks/useProducts');
vi.mock('../components/product/ProductCard', () => ({
  ProductCard: ({ product }: { product: Product }) => (
    <div data-testid={`product-${product.id}`}>{product.title}</div>
  ),
}));
vi.mock('../components/product/SkeletonCard', () => ({
  SkeletonCard: () => <div data-testid="skeleton-card">Loading...</div>,
}));

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Product 1',
    price: 10,
    category: 'electronics',
    description: 'Test product 1',
    image: 'test1.jpg',
    rating: { rate: 4.5, count: 100 },
  },
  {
    id: 2,
    title: 'Product 2',
    price: 20,
    category: "men's clothing",
    description: 'Test product 2',
    image: 'test2.jpg',
    rating: { rate: 4.0, count: 50 },
  },
  {
    id: 3,
    title: 'Laptop Computer',
    price: 999,
    category: 'electronics',
    description: 'Test laptop',
    image: 'test3.jpg',
    rating: { rate: 4.8, count: 200 },
  },
];

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (initialPath = '/') => {
    return render(
      <CartProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:name" element={<HomePage />} />
          </Routes>
        </MemoryRouter>
      </CartProvider>,
    );
  };

  // ... rest of your tests stay the same
  describe('Loading state', () => {
    it('should display skeleton cards while loading', () => {
      vi.spyOn(useProductsHook, 'useProducts').mockReturnValue({
        products: null,
        loading: true,
        error: null,
      });

      renderWithRouter();

      const skeletons = screen.getAllByTestId('skeleton-card');
      expect(skeletons).toHaveLength(8);
    });
  });

  describe('Error state', () => {
    it('should display error message when fetch fails', () => {
      vi.spyOn(useProductsHook, 'useProducts').mockReturnValue({
        products: null,
        loading: false,
        error: 'Failed to fetch products',
      });

      renderWithRouter();

      expect(
        screen.getByText(/Error: Failed to fetch products/i),
      ).toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('should display "No products found" when products array is empty', () => {
      vi.spyOn(useProductsHook, 'useProducts').mockReturnValue({
        products: [],
        loading: false,
        error: null,
      });

      renderWithRouter();

      expect(screen.getByText(/No products found/i)).toBeInTheDocument();
    });

    it('should display "No products found" when products is null', () => {
      vi.spyOn(useProductsHook, 'useProducts').mockReturnValue({
        products: null,
        loading: false,
        error: null,
      });

      renderWithRouter();

      expect(screen.getByText(/No products found/i)).toBeInTheDocument();
    });
  });

  describe('Products display', () => {
    beforeEach(() => {
      vi.spyOn(useProductsHook, 'useProducts').mockReturnValue({
        products: mockProducts,
        loading: false,
        error: null,
      });
    });

    it('should display all products when no filters applied', () => {
      renderWithRouter('/');

      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-3')).toBeInTheDocument();
      expect(screen.getByText('Welcome to the shop')).toBeInTheDocument();
    });

    it('should display correct heading text', () => {
      renderWithRouter('/');

      expect(screen.getByText('Welcome to the shop')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
    });
  });

  describe('Category filtering', () => {
    beforeEach(() => {
      vi.spyOn(useProductsHook, 'useProducts').mockReturnValue({
        products: mockProducts,
        loading: false,
        error: null,
      });
    });

    it('should filter products by category from URL param', () => {
      vi.spyOn(useProductsHook, 'useProducts').mockReturnValue({
        products: mockProducts,
        loading: false,
        error: null,
      });

      const { container } = renderWithRouter('/category/electronics');

      const heading = screen.getByRole('heading', { level: 2 });

      const cards = container.querySelectorAll('[data-testid^="product-"]');

      expect(cards.length).toBe(2);
    });

    it('should filter products by category from query param', () => {
      renderWithRouter("/?cat=men's clothing");

      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Laptop Computer')).not.toBeInTheDocument();
    });

    it('should handle case-insensitive category filtering', () => {
      renderWithRouter('/category/ELECTRONICS');

      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Laptop Computer')).toBeInTheDocument();
    });
  });

  describe('Search filtering', () => {
    beforeEach(() => {
      vi.spyOn(useProductsHook, 'useProducts').mockReturnValue({
        products: mockProducts,
        loading: false,
        error: null,
      });
    });

    it('should filter products by search query', () => {
      renderWithRouter('/?q=laptop');

      expect(screen.getByTestId('product-3')).toBeInTheDocument();
      expect(screen.queryByTestId('product-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('product-2')).not.toBeInTheDocument();
    });

    it('should handle case-insensitive search', () => {
      renderWithRouter('/?q=LAPTOP');

      expect(screen.getByTestId('product-3')).toBeInTheDocument();
    });

    it('should return no results for non-matching search', () => {
      renderWithRouter('/?q=nonexistent');

      expect(screen.queryByTestId('product-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('product-2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('product-3')).not.toBeInTheDocument();
    });
  });

  describe('Combined filters', () => {
    beforeEach(() => {
      vi.spyOn(useProductsHook, 'useProducts').mockReturnValue({
        products: mockProducts,
        loading: false,
        error: null,
      });
    });

    it('should apply both category and search filters', () => {
      renderWithRouter('/category/electronics?q=laptop');

      expect(screen.getByTestId('product-3')).toBeInTheDocument();
      expect(screen.queryByTestId('product-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('product-2')).not.toBeInTheDocument();
    });

    it('should apply both cat query param and search filters', () => {
      renderWithRouter('/?cat=electronics&q=product');

      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.queryByTestId('product-2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('product-3')).not.toBeInTheDocument();
    });
  });

  describe('Grid layout', () => {
    it('should render products in a grid layout', () => {
      vi.spyOn(useProductsHook, 'useProducts').mockReturnValue({
        products: mockProducts,
        loading: false,
        error: null,
      });

      const { container } = renderWithRouter('/');

      const gridContainer = container.querySelector('div[style*="grid"]');
      expect(gridContainer).toBeInTheDocument();
    });
  });
});

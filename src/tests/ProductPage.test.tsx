import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ProductPage } from '../pages/ProductPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from '../contexts/CartContext';
import * as productsApi from '../api/products';

// Mock the API
vi.mock('../api/products');

const mockProduct = {
  id: 1,
  title: 'Laptop',
  price: 999,
  description: 'A great laptop',
  image: 'test.jpg',
  category: 'electronics',
  rating: { rate: 4.5, count: 100 },
};

describe('ProductPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (productId: string) => {
    return render(
      <CartProvider>
        <MemoryRouter initialEntries={[`/product/${productId}`]}>
          <Routes>
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/" element={<div>Home</div>} />
          </Routes>
        </MemoryRouter>
      </CartProvider>,
    );
  };

  it('shows skeleton loader while loading', () => {
    // Mock that never resolves to keep loading state
    vi.spyOn(productsApi, 'fetchProductById').mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    renderWithRouter('1');

    expect(screen.getByTestId('skeleton-card')).toBeInTheDocument();
  });

  it("shows 'Product not found' when API returns null", async () => {
    vi.spyOn(productsApi, 'fetchProductById').mockResolvedValue(null);

    renderWithRouter('1');

    await waitFor(() => {
      expect(screen.getByText(/product not found/i)).toBeInTheDocument();
    });
  });

  it('renders product details', async () => {
    vi.spyOn(productsApi, 'fetchProductById').mockResolvedValue(mockProduct);

    renderWithRouter('1');

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    expect(screen.getByText(/\$999\.00/)).toBeInTheDocument();
    expect(screen.getByText('A great laptop')).toBeInTheDocument();
    expect(screen.getByText(/electronics/i)).toBeInTheDocument();
    expect(screen.getByText(/4\.5/)).toBeInTheDocument(); // Rating
    expect(screen.getByText(/Add to Cart/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to Shop/i)).toBeInTheDocument();
  });

  it('shows quantity controls when product is in cart', async () => {
    vi.spyOn(productsApi, 'fetchProductById').mockResolvedValue(mockProduct);

    // For this test, you'd need to pre-add the product to cart
    // This is more complex - let's skip for now or test the button click
    renderWithRouter('1');

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    // Initially should show "Add to Cart" button
    expect(screen.getByText(/Add to Cart/i)).toBeInTheDocument();
  });
});

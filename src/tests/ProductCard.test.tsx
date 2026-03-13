import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { CartContext } from '../contexts/CartContext';

vi.mock('../components/common/QuantityControls', () => ({
  QuantityControls: vi.fn(() => <div data-testid="quantity-controls" />),
}));

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 10,
  description: 'A very nice product for testing purposes',
  image: 'test.jpg',
  category: 'test',
  rating: { rate: 4.5, count: 100 },
};

describe('ProductCard', () => {
  const mockAdd = vi.fn();

  function renderWithContextAndRouter(items = []) {
    return render(
      <CartContext.Provider
        value={{
          items,
          add: mockAdd,
          increment: vi.fn(),
          decrement: vi.fn(),
          remove: vi.fn(),
          clear: vi.fn(),
          cartCount: 0,
        }}
      >
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<ProductCard product={mockProduct} />} />
            <Route path="/product/:id" element={<div>Product Page</div>} />
          </Routes>
        </MemoryRouter>
      </CartContext.Provider>,
    );
  }

  it('navigates to product page when clicking the card', async () => {
    const user = userEvent.setup();
    renderWithContextAndRouter();

    await user.click(screen.getByText('Test Product'));

    expect(screen.getByText('Product Page')).toBeInTheDocument();
  });

  it('does NOT navigate when clicking Add to Cart button', async () => {
    const user = userEvent.setup();
    renderWithContextAndRouter();

    const button = screen.getByRole('button', { name: /add to cart/i });

    await user.click(button);

    // Should still be on the homepage
    expect(screen.queryByText('Product Page')).not.toBeInTheDocument();
  });

  it('calls add() with product + quantity=1 when clicking Add to Cart', async () => {
    const user = userEvent.setup();
    renderWithContextAndRouter();

    const button = screen.getByRole('button', { name: /add to cart/i });

    await user.click(button);

    expect(mockAdd).toHaveBeenCalledWith({
      ...mockProduct,
      quantity: 1,
    });
  });

  it('shows QuantityControls when product is already in cart', () => {
    renderWithContextAndRouter([{ id: 1, quantity: 3 }]);

    expect(screen.getByTestId('quantity-controls')).toBeInTheDocument();
  });
});

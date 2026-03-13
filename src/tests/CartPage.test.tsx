import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CartPage from '../pages/CartPage';
import { CartContext } from '../contexts/CartContext';

// Mock QuantityControls so we don't test it again
vi.mock('../components/common/QuantityControls', () => ({
  QuantityControls: vi.fn(({ id, quantity }) => (
    <div data-testid="quantity-controls">
      QuantityControls id={id} quantity={quantity}
    </div>
  )),
}));

const mockItems = [
  {
    id: 1,
    title: 'Red Shirt',
    price: 10,
    quantity: 2,
    image: 'shirt.jpg',
  },
  {
    id: 2,
    title: 'Laptop',
    price: 999,
    quantity: 1,
    image: 'laptop.jpg',
  },
];

describe('CartPage', () => {
  const mockClear = vi.fn();

  function renderWithContext(items = []) {
    return render(
      <CartContext.Provider
        value={{
          items,
          clear: mockClear,
          add: vi.fn(),
          increment: vi.fn(),
          decrement: vi.fn(),
          remove: vi.fn(),
          cartCount: items.reduce((s, i) => s + i.quantity, 0),
        }}
      >
        <MemoryRouter initialEntries={['/cart']}>
          <Routes>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="/product/:id" element={<div>Product Page</div>} />
          </Routes>
        </MemoryRouter>
      </CartContext.Provider>,
    );
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows empty cart message when no items', () => {
    renderWithContext([]);

    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /back to shop/i }),
    ).toBeInTheDocument();
  });

  it('renders cart items', () => {
    renderWithContext(mockItems);

    expect(screen.getByText('Red Shirt')).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();

    // Price formatting
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByText('$999.00')).toBeInTheDocument();

    // QuantityControls rendered for each item
    expect(screen.getAllByTestId('quantity-controls')).toHaveLength(2);
  });

  it('shows total price', () => {
    renderWithContext(mockItems);

    // Total = (10 * 2) + (999 * 1) = 1019
    expect(screen.getByText('Total: $1019.00')).toBeInTheDocument();
  });

  it('calls clear() when clicking Clear Cart', async () => {
    const user = userEvent.setup();
    renderWithContext(mockItems);

    const clearButton = screen.getByRole('button', { name: /clear cart/i });
    await user.click(clearButton);

    expect(mockClear).toHaveBeenCalled();
  });

  it('navigates back to home when clicking Back to Shop', async () => {
    const user = userEvent.setup();
    renderWithContext(mockItems);

    const backLink = screen.getByRole('link', { name: /back to shop/i });
    await user.click(backLink);

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('navigates to product page when clicking a cart item', async () => {
    const user = userEvent.setup();
    renderWithContext(mockItems);

    const itemLink = screen.getByRole('link', { name: /red shirt/i });
    await user.click(itemLink);

    expect(screen.getByText('Product Page')).toBeInTheDocument();
  });
});

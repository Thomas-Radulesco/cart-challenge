import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuantityControls } from '../components/common/QuantityControls';
import { CartContext } from '../contexts/CartContext';

describe('QuantityControls', () => {
  const mockIncrement = vi.fn();
  const mockDecrement = vi.fn();
  const mockRemove = vi.fn();

  function renderWithContext(ui: React.ReactNode) {
    return render(
      <CartContext.Provider
        value={{
          items: [],
          add: vi.fn(),
          increment: mockIncrement,
          decrement: mockDecrement,
          remove: mockRemove,
          clear: vi.fn(),
          cartCount: 0,
        }}
      >
        {ui}
      </CartContext.Provider>,
    );
  }

  it('renders the quantity', () => {
    renderWithContext(<QuantityControls id={1} quantity={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls decrement when decrement button is clicked', async () => {
    const user = userEvent.setup();
    renderWithContext(<QuantityControls id={1} quantity={3} />);

    await user.click(screen.getByRole('button', { name: 'decrement' }));

    expect(mockDecrement).toHaveBeenCalledWith(1);
  });

  it('calls increment when increment button is clicked', async () => {
    const user = userEvent.setup();
    renderWithContext(<QuantityControls id={1} quantity={3} />);

    await user.click(screen.getByRole('button', { name: 'increment' }));

    expect(mockIncrement).toHaveBeenCalledWith(1);
  });

  it('calls remove when remove button is clicked', async () => {
    const user = userEvent.setup();
    renderWithContext(<QuantityControls id={1} quantity={3} />);

    await user.click(screen.getByRole('button', { name: 'remove' }));

    expect(mockRemove).toHaveBeenCalledWith(1);
  });
});

import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../contexts/CartContext';

// Mock localStorage to avoid writing to real storage during tests
beforeEach(() => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
});

const mockItem = {
  id: 1,
  title: 'Test Product',
  price: 10,
  quantity: 1,
  image: '',
  category: '',
  description: '',
  rating: {
    rate: 2,
    count: 200,
  }
};

describe('CartContext', () => {
  it('adds an item', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.add(mockItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.cartCount).toBe(1);
  });

  it('increments quantity', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.add(mockItem);
      result.current.increment(1);
    });

    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.cartCount).toBe(2);
  });

  it('decrements quantity and removes item at zero', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.add(mockItem);
      result.current.decrement(1); // quantity goes from 1 → 0 → removed
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.cartCount).toBe(0);
  });

  it('clears the cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.add(mockItem);
      result.current.add({ ...mockItem, id: 2 });
      result.current.clear();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.cartCount).toBe(0);
  });
});

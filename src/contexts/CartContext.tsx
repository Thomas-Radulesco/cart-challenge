import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  addItem,
  removeItem,
  incrementItem,
  decrementItem,
  clearCart,
} from './cart/cartActions';
import {
  cartReducer,
  initialCartState,
  type CartState,
} from './cart/cartReducer';
import type { CartItem } from '../types/cart';

interface CartContextValue extends CartState {
  add: (item: CartItem) => void;
  remove: (id: number) => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  clear: () => void;
  cartCount: number;
}

export const CartContext = createContext<CartContextValue | undefined>(
  undefined,
);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState, () => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : initialCartState;
  });
  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  // Store API //
  const add = (item: CartItem) => dispatch(addItem(item));
  const remove = (id: number) => dispatch(removeItem(id));
  const increment = (id: number) => dispatch(incrementItem(id));
  const decrement = (id: number) => dispatch(decrementItem(id));
  const clear = () => dispatch(clearCart());

  // Persist cart
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider
      value={{ ...state, add, remove, increment, decrement, clear, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside a <CartProvider>');
  return ctx;
}

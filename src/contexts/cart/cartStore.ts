import type { CartState } from './cartReducer';

export const getCartCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const getCartTotal = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

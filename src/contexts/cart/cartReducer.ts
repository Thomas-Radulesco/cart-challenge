import type { CartItem } from '../../types/cart';
import type { CartAction } from './cartActions';
import {
  ADD_ITEM,
  REMOVE_ITEM,
  INCREMENT,
  DECREMENT,
  CLEAR_CART,
} from './cartActions';

export interface CartState {
  items: CartItem[];
}

export const initialCartState: CartState = {
  items: [],
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case ADD_ITEM: {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };

    case INCREMENT:
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      };

    case DECREMENT:
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity - 1 } : i,
          )
          .filter((i) => i.quantity > 0),
      };

    case CLEAR_CART:
      return { ...state, items: [] };

    default:
      return state;
  }
}

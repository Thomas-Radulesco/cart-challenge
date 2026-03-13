import { cartReducer, initialCartState } from '../contexts/cart/cartReducer';
import {
  ADD_ITEM,
  REMOVE_ITEM,
  INCREMENT,
  DECREMENT,
  CLEAR_CART,
} from '../contexts/cart/cartActions';

const mockItem = {
  id: 1,
  title: 'Test Product',
  price: 10,
  quantity: 1,
  image: '',
  description: 'A very nice product for testing purposes',
  category: 'test',
  rating: { rate: 4.5, count: 100 },
};

describe('cartReducer', () => {
  it('adds a new item to the cart', () => {
    const action = { type: ADD_ITEM, payload: mockItem };
    const result = cartReducer(initialCartState, action);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].quantity).toBe(1);
  });

  it('increments quantity if item already exists', () => {
    const state = { items: [{ ...mockItem, quantity: 1 }] };
    const action = { type: ADD_ITEM, payload: { ...mockItem, quantity: 1 } };

    const result = cartReducer(state, action);

    expect(result.items[0].quantity).toBe(2);
  });

  it('increments quantity using INCREMENT', () => {
    const state = { items: [{ ...mockItem, quantity: 1 }] };
    const action = { type: INCREMENT, payload: { id: 1 } };

    const result = cartReducer(state, action);

    expect(result.items[0].quantity).toBe(2);
  });

  it('decrements quantity using DECREMENT', () => {
    const state = { items: [{ ...mockItem, quantity: 2 }] };
    const action = { type: DECREMENT, payload: { id: 1 } };

    const result = cartReducer(state, action);

    expect(result.items[0].quantity).toBe(1);
  });

  it('removes item when quantity reaches 0', () => {
    const state = { items: [{ ...mockItem, quantity: 1 }] };
    const action = { type: DECREMENT, payload: { id: 1 } };

    const result = cartReducer(state, action);

    expect(result.items).toHaveLength(0);
  });

  it('removes item explicitly', () => {
    const state = { items: [{ ...mockItem, quantity: 3 }] };
    const action = { type: REMOVE_ITEM, payload: { id: 1 } };

    const result = cartReducer(state, action);

    expect(result.items).toHaveLength(0);
  });

  it('clears the cart', () => {
    const state = { items: [{ ...mockItem, quantity: 3 }] };
    const action = { type: CLEAR_CART };

    const result = cartReducer(state, action);

    expect(result.items).toHaveLength(0);
  });
});

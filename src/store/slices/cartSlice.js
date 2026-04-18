import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../../utils/localStorage';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: storage.getCart() },
  reducers: {
    addToCart(state, { payload }) {
      const ex = state.items.find(i => i.id === payload.id);
      if (ex) ex.qty += 1;
      else state.items.push({ ...payload, qty: 1 });
      storage.saveCart(state.items);
    },
    removeFromCart(state, { payload: id }) {
      state.items = state.items.filter(i => i.id !== id);
      storage.saveCart(state.items);
    },
    changeQty(state, { payload: { id, delta } }) {
      const item = state.items.find(i => i.id === id);
      if (!item) return;
      item.qty += delta;
      if (item.qty <= 0) state.items = state.items.filter(i => i.id !== id);
      storage.saveCart(state.items);
    },
    clearCart(state) { state.items = []; storage.saveCart([]); },
  },
});

export const { addToCart, removeFromCart, changeQty, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = s => s.cart.items;
export const selectCartCount = s => s.cart.items.reduce((t,i) => t+i.qty, 0);
export const selectCartTotal = s => s.cart.items.reduce((t,i) => t+i.price*i.qty, 0);

export default cartSlice.reducer;

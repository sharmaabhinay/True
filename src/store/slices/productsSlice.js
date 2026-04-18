import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../../utils/localStorage';

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items:       storage.getProducts(),
    filter:      'all',
    search:      '',
    sortBy:      'featured',
    loading:     false,
    wishlist:    storage.getWishlist(),
  },
  reducers: {
    setProducts(state, { payload }) {
      state.items = payload;
      storage.saveProducts(payload);
    },
    addProduct(state, { payload }) {
      state.items.push({ ...payload, id: Date.now() });
      storage.saveProducts(state.items);
    },
    updateProduct(state, { payload }) {
      const idx = state.items.findIndex(p => p.id === payload.id);
      if (idx > -1) state.items[idx] = { ...state.items[idx], ...payload };
      storage.saveProducts(state.items);
    },
    deleteProduct(state, { payload: id }) {
      state.items = state.items.filter(p => p.id !== id);
      storage.saveProducts(state.items);
    },
    toggleProductActive(state, { payload: id }) {
      const p = state.items.find(p => p.id === id);
      if (p) p.active = !p.active;
      storage.saveProducts(state.items);
    },
    setFilter(state, { payload }) { state.filter = payload; },
    setSearch(state, { payload }) { state.search  = payload; },
    setSortBy(state, { payload }) { state.sortBy  = payload; },
    toggleWishlist(state, { payload: id }) {
      const idx = state.wishlist.indexOf(id);
      if (idx > -1) state.wishlist.splice(idx, 1);
      else state.wishlist.push(id);
      storage.saveWishlist(state.wishlist);
    },
  },
});

export const {
  setProducts, addProduct, updateProduct, deleteProduct, toggleProductActive,
  setFilter, setSearch, setSortBy, toggleWishlist,
} = productsSlice.actions;

// Selectors
export const selectAllProducts     = s => s.products.items;
export const selectFilter          = s => s.products.filter;
export const selectSearch          = s => s.products.search;
export const selectSortBy          = s => s.products.sortBy;
export const selectWishlist        = s => s.products.wishlist;

export const selectFilteredProducts = s => {
  let list = s.products.items.filter(p => {
    if (!p.active) return false;
    const mf = s.products.filter === 'all' || (p.tags||[]).includes(s.products.filter);
    const ms = !s.products.search || p.name.toLowerCase().includes(s.products.search.toLowerCase()) || p.cat.toLowerCase().includes(s.products.search.toLowerCase());
    return mf && ms;
  });
  if (s.products.sortBy === 'price-asc')  list = [...list].sort((a,b) => a.price - b.price);
  if (s.products.sortBy === 'price-desc') list = [...list].sort((a,b) => b.price - a.price);
  if (s.products.sortBy === 'rating')     list = [...list].sort((a,b) => b.rating - a.rating);
  return list;
};

export default productsSlice.reducer;

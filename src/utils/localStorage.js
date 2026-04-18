import { DEFAULT_PRODUCTS } from '../data/products';

const KEYS = {
  PRODUCTS: 'tf_products',
  VISITORS: 'tf_visitors',
  CART:     'tf_cart',
  WISHLIST: 'tf_wishlist',
  USERS: 'tf_users',
  CURRENT_USER: 'tf_current_user',
  ORDERS: 'tf_orders',
};

export const storage = {
  getProducts: () => {
    try { const s = localStorage.getItem(KEYS.PRODUCTS); return s ? JSON.parse(s) : DEFAULT_PRODUCTS; }
    catch { return DEFAULT_PRODUCTS; }
  },
  saveProducts: (arr) => { try { localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(arr)); } catch {} },

  getVisitors: () => { try { return JSON.parse(localStorage.getItem(KEYS.VISITORS)||'[]'); } catch { return []; } },
  pushVisitor: (entry) => {
    const v = storage.getVisitors();
    v.push({ ...entry, time: new Date().toISOString() });
    try { localStorage.setItem(KEYS.VISITORS, JSON.stringify(v)); } catch {}
  },
  clearVisitors: () => { try { localStorage.removeItem(KEYS.VISITORS); } catch {} },

  getCart: () => { try { return JSON.parse(localStorage.getItem(KEYS.CART)||'[]'); } catch { return []; } },
  saveCart: (arr) => { try { localStorage.setItem(KEYS.CART, JSON.stringify(arr)); } catch {} },

  getWishlist: () => { try { return JSON.parse(localStorage.getItem(KEYS.WISHLIST)||'[]'); } catch { return []; } },
  saveWishlist: (arr) => { try { localStorage.setItem(KEYS.WISHLIST, JSON.stringify(arr)); } catch {} },

  getUsers: () => { try { return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]'); } catch { return []; } },
  saveUsers: (arr) => { try { localStorage.setItem(KEYS.USERS, JSON.stringify(arr)); } catch {} },

  getCurrentUserId: () => {
    try { return localStorage.getItem(KEYS.CURRENT_USER) || ''; }
    catch { return ''; }
  },
  saveCurrentUserId: (id) => {
    try {
      if (id) localStorage.setItem(KEYS.CURRENT_USER, id);
      else localStorage.removeItem(KEYS.CURRENT_USER);
    } catch {}
  },

  getOrders: () => { try { return JSON.parse(localStorage.getItem(KEYS.ORDERS) || '[]'); } catch { return []; } },
  saveOrders: (arr) => { try { localStorage.setItem(KEYS.ORDERS, JSON.stringify(arr)); } catch {} },
};

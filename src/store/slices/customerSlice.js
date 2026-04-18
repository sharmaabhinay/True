import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../../utils/localStorage';

const initialState = {
  users: storage.getUsers(),
  currentUserId: storage.getCurrentUserId(),
  orders: storage.getOrders(),
  authModalOpen: false,
  authMode: 'login',
  redirectAfterAuth: '',
};

const persist = (state) => {
  storage.saveUsers(state.users);
  storage.saveCurrentUserId(state.currentUserId);
  storage.saveOrders(state.orders);
};

const getCurrentUser = (state) => state.users.find((user) => user.id === state.currentUserId);

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    openAuthModal(state, { payload }) {
      state.authModalOpen = true;
      state.authMode = payload?.mode || 'login';
      state.redirectAfterAuth = payload?.redirectTo || state.redirectAfterAuth || '';
    },
    closeAuthModal(state) {
      state.authModalOpen = false;
      state.redirectAfterAuth = '';
    },
    setAuthMode(state, { payload }) {
      state.authMode = payload;
    },
    signupCustomer(state, { payload }) {
      const user = {
        id: `customer-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        password: payload.password,
        address: payload.address || null,
        wishlist: [],
        createdAt: new Date().toISOString(),
      };

      state.users.unshift(user);
      state.currentUserId = user.id;
      state.authModalOpen = false;
      persist(state);
    },
    loginCustomer(state, { payload }) {
      state.currentUserId = payload.userId;
      state.authModalOpen = false;
      persist(state);
    },
    logoutCustomer(state) {
      state.currentUserId = '';
      state.authModalOpen = false;
      state.redirectAfterAuth = '';
      persist(state);
    },
    updateProfile(state, { payload }) {
      const user = getCurrentUser(state);
      if (!user) return;
      Object.assign(user, payload);
      persist(state);
    },
    toggleWishlist(state, { payload: productId }) {
      const user = getCurrentUser(state);
      if (!user) return;
      user.wishlist = user.wishlist || [];
      const index = user.wishlist.indexOf(productId);
      if (index > -1) user.wishlist.splice(index, 1);
      else user.wishlist.unshift(productId);
      persist(state);
    },
    placeOrder(state, { payload }) {
      const user = getCurrentUser(state);
      if (!user) return;

      const order = {
        ...payload,
        customerId: user.id,
        customerName: user.name,
        email: user.email,
        phone: user.phone,
      };

      state.orders.unshift(order);
      user.orders = user.orders || [];
      user.orders.unshift(order);
      user.address = payload.address;
      persist(state);
    },
  },
});

export const {
  openAuthModal,
  closeAuthModal,
  setAuthMode,
  signupCustomer,
  loginCustomer,
  logoutCustomer,
  updateProfile,
  toggleWishlist,
  placeOrder,
} = customerSlice.actions;

export const selectCustomers = (state) => state.customer.users;
export const selectAllOrders = (state) => state.customer.orders;
export const selectCurrentUser = (state) =>
  state.customer.users.find((user) => user.id === state.customer.currentUserId) || null;
export const selectIsCustomerAuthenticated = (state) => Boolean(state.customer.currentUserId);
export const selectCustomerWishlist = (state) => selectCurrentUser(state)?.wishlist || [];
export const selectCustomerOrders = (state) =>
  state.customer.orders.filter((order) => order.customerId === state.customer.currentUserId);
export const selectAuthModalState = (state) => ({
  open: state.customer.authModalOpen,
  mode: state.customer.authMode,
  redirectTo: state.customer.redirectAfterAuth,
});

export default customerSlice.reducer;

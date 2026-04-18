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

const nowIso = () => new Date().toISOString();

const persist = (state) => {
  storage.saveUsers(state.users);
  storage.saveCurrentUserId(state.currentUserId);
  storage.saveOrders(state.orders);
};

const getCurrentUser = (state) => state.users.find((user) => user.id === state.currentUserId);
const getOrder = (state, orderId) => state.orders.find((order) => order.id === orderId);
const splitName = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    surname: parts.slice(1).join(' '),
  };
};

const timelineEvent = (label, detail) => ({
  id: `timeline-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  label,
  detail,
  time: nowIso(),
});

const STATUS_META = {
  processing: [
    { label: 'Order accepted by admin', detail: 'The order has been reviewed and accepted by the admin team.' },
  ],
  making: [
    { label: 'Item started making', detail: 'Production has started in the workshop.' },
    { label: 'Item making completed', detail: 'Primary production work has been completed.' },
  ],
  shipped: [
    { label: 'Item ready to ship', detail: 'The finished item has been packed and is ready for dispatch.' },
    { label: 'Item shipped', detail: 'The order has left our workshop and is in transit.' },
  ],
  delivered: [
    { label: 'Item arrived at delivery location', detail: 'The order reached the local delivery hub.' },
    { label: 'Item delivered', detail: 'The order has been delivered successfully.' },
  ],
  cancelled: [
    { label: 'Order cancelled', detail: 'The order has been cancelled.' },
  ],
};

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
      const session = timelineEvent('Account created', 'Customer signed up on the storefront.');
      const nameParts = splitName(payload.name);
      const user = {
        id: `customer-${Date.now()}`,
        name: payload.name,
        firstName: payload.firstName || nameParts.firstName,
        surname: payload.surname || nameParts.surname,
        email: payload.email,
        phone: payload.phone,
        password: payload.password,
        address: payload.address || null,
        wishlist: [],
        cart: [],
        createdAt: nowIso(),
        sessions: [session],
        lastLoginAt: session.time,
        loginHistory: [session.time],
      };

      state.users.unshift(user);
      state.currentUserId = user.id;
      state.authModalOpen = false;
      persist(state);
    },
    loginCustomer(state, { payload }) {
      const user = state.users.find((item) => item.id === payload.userId);
      if (user) {
        const loginAt = nowIso();
        user.lastLoginAt = loginAt;
        user.loginHistory = [loginAt, ...(user.loginHistory || [])].slice(0, 20);
        user.sessions = [timelineEvent('Signed in', 'Customer logged into the storefront.'), ...(user.sessions || [])].slice(0, 30);
      }
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
      if (payload.name) {
        const nameParts = splitName(payload.name);
        user.firstName = payload.firstName || nameParts.firstName;
        user.surname = payload.surname || nameParts.surname;
      }
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
        orderType: payload.orderType || 'semi prepaid',
        timeline: payload.timeline || [
          timelineEvent('Order placed', 'Customer submitted the order from checkout.'),
          timelineEvent('Order confirmed', 'Advance requirement was shown and the order was marked as confirmed.'),
        ],
      };

      state.orders.unshift(order);
      user.orders = user.orders || [];
      user.orders.unshift(order);
      user.address = payload.address;
      user.cart = [];
      persist(state);
    },
    addCartItemForCurrentUser(state, { payload }) {
      const user = getCurrentUser(state);
      if (!user) return;
      user.cart = user.cart || [];
      const existing = user.cart.find((item) => item.cartKey === payload.cartKey);
      if (existing) existing.qty += payload.qty || 1;
      else user.cart.push(payload);
      persist(state);
    },
    removeCartItemForCurrentUser(state, { payload: cartKey }) {
      const user = getCurrentUser(state);
      if (!user) return;
      user.cart = (user.cart || []).filter((item) => item.cartKey !== cartKey);
      persist(state);
    },
    changeCartItemQtyForCurrentUser(state, { payload: { cartKey, delta } }) {
      const user = getCurrentUser(state);
      if (!user) return;
      const item = (user.cart || []).find((entry) => entry.cartKey === cartKey);
      if (!item) return;
      item.qty += delta;
      if (item.qty <= 0) user.cart = user.cart.filter((entry) => entry.cartKey !== cartKey);
      persist(state);
    },
    clearCurrentCustomerCart(state) {
      const user = getCurrentUser(state);
      if (!user) return;
      user.cart = [];
      persist(state);
    },
    updateOrderStatus(state, { payload: { orderId, status } }) {
      const order = getOrder(state, orderId);
      if (!order || order.status === status) return;
      order.status = status;
      const meta = STATUS_META[status];
      if (meta) {
        order.timeline = order.timeline || [];
        meta.forEach((entry) => {
          order.timeline.push(timelineEvent(entry.label, entry.detail));
        });
      }
      state.users.forEach((user) => {
        user.orders = (user.orders || []).map((entry) => entry.id === orderId ? { ...entry, status: order.status, timeline: order.timeline } : entry);
      });
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
  addCartItemForCurrentUser,
  removeCartItemForCurrentUser,
  changeCartItemQtyForCurrentUser,
  clearCurrentCustomerCart,
  updateOrderStatus,
} = customerSlice.actions;

export const selectCustomers = (state) => state.customer.users;
export const selectAllOrders = (state) => state.customer.orders;
export const selectCurrentUser = (state) =>
  state.customer.users.find((user) => user.id === state.customer.currentUserId) || null;
export const selectIsCustomerAuthenticated = (state) => Boolean(state.customer.currentUserId);
export const selectCustomerWishlist = (state) => selectCurrentUser(state)?.wishlist || [];
export const selectCustomerOrders = (state) =>
  state.customer.orders.filter((order) => order.customerId === state.customer.currentUserId);
export const selectCustomerById = (customerId) => (state) =>
  state.customer.users.find((user) => user.id === customerId) || null;
export const selectOrderById = (orderId) => (state) =>
  state.customer.orders.find((order) => order.id === orderId) || null;
export const selectAuthModalState = (state) => ({
  open: state.customer.authModalOpen,
  mode: state.customer.authMode,
  redirectTo: state.customer.redirectAfterAuth,
});

export default customerSlice.reducer;

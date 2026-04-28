import { createSlice } from '@reduxjs/toolkit';
import { getUsers } from './authSlice';

const ORDERS_KEY = 'tf_orders';

function loadOrders() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); } catch { return []; }
}
function saveOrders(orders) { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); }

const ORDER_TIMELINE = [
  { status: 'placed',    label: 'Order Placed',               icon: 'FiShoppingBag' },
  { status: 'accepted',  label: 'Order Accepted by Team',      icon: 'FiCheckCircle' },
  { status: 'making',    label: 'Crafting Started',            icon: 'FiTool' },
  { status: 'completed', label: 'Crafting Completed',          icon: 'FiPackage' },
  { status: 'ready',     label: 'Ready to Ship',               icon: 'FiBox' },
  { status: 'shipped',   label: 'Shipped',                     icon: 'FiTruck' },
  { status: 'arrived',   label: 'Arrived at Delivery Location', icon: 'FiMapPin' },
  { status: 'delivered', label: 'Delivered',                   icon: 'FiHome' },
];

export { ORDER_TIMELINE };

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    list: loadOrders(),
  },
  reducers: {
    placeOrder(state, { payload }) {
      const order = {
        ...payload,
        id:         `TF-${Date.now()}`,
        createdAt:  new Date().toISOString(),
        updatedAt:  new Date().toISOString(),
        status:     'placed',
        orderType:  payload.orderType || 'prepaid',
        timeline: [
          { status:'placed', label:'Order Placed', time: new Date().toISOString() }
        ],
      };
      state.list.push(order);
      saveOrders(state.list);

      // sync to user record
      const users = getUsers();
      const idx = users.findIndex(u => u.id === payload.userId);
      if (idx > -1) {
        if (!users[idx].orders) users[idx].orders = [];
        users[idx].orders.push(order.id);
        localStorage.setItem('tf_users', JSON.stringify(users));
      }
    },

    updateOrderStatus(state, { payload: { orderId, status, note } }) {
      const order = state.list.find(o => o.id === orderId);
      if (!order) return;
      order.status    = status;
      order.updatedAt = new Date().toISOString();
      const step = ORDER_TIMELINE.find(t => t.status === status);
      if (step && !order.timeline.find(t => t.status === status)) {
        order.timeline.push({ status, label: step.label, time: new Date().toISOString(), note });
      }
      saveOrders(state.list);
    },

    reloadOrders(state) {
      state.list = loadOrders();
    },
  },
});

export const { placeOrder, updateOrderStatus, reloadOrders } = orderSlice.actions;

export const selectAllOrders     = s => s.orders.list;
export const selectOrderById     = id => s => s.orders.list.find(o => o.id === id);
export const selectUserOrders    = userId => s => s.orders.list.filter(o => o.userId === userId);

export default orderSlice.reducer;

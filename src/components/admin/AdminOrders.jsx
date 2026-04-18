import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DEMO_ORDERS } from '../../data/constants';
import { selectAllOrders, updateOrderStatus } from '../../store/slices/customerSlice';
import { showAdminToast } from '../../store/slices/adminSlice';

const STATUS_CLS = {
  delivered: 'bg-admin-green/15 text-admin-green',
  processing: 'bg-gold/15 text-gold',
  making: 'bg-purple-500/15 text-purple-300',
  shipped: 'bg-admin-blue/15 text-admin-blue',
  cancelled: 'bg-admin-red/15 text-admin-red',
  confirmed: 'bg-gold/15 text-gold',
};

const ORDER_TYPES = ['cod', 'prepaid', 'semi prepaid'];
const STATUS_OPTIONS = ['processing', 'making', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const liveOrders = useSelector(selectAllOrders);
  const orders = liveOrders.length
    ? liveOrders.map((order) => ({
        id: order.id,
        customer: order.customerName,
        items: order.items.map((item) => `${item.name} ×${item.qty}`).join(', '),
        amount: order.amount,
        city: order.address?.city || 'Indore',
        date: new Date(order.date).toLocaleDateString('en-IN', { dateStyle: 'medium' }),
        status: order.status,
        quantity: order.items.reduce((sum, item) => sum + item.qty, 0),
        orderType: order.orderType || 'semi prepaid',
      }))
    : DEMO_ORDERS.map((order) => ({ ...order, quantity: 1, orderType: 'prepaid' }));

  const handleStatusChange = (event, orderId) => {
    event.stopPropagation();
    dispatch(updateOrderStatus({ orderId, status: event.target.value }));
    dispatch(showAdminToast({ msg: `Order ${orderId} moved to ${event.target.value}.` }));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-admin-text text-base font-semibold">Orders</h2>
        <button className="bg-gold text-deep text-sm font-semibold px-5 py-2 rounded-lg cursor-pointer border-none hover:opacity-85 font-dm">
          Export
        </button>
      </div>

      <div className="bg-admin-card border border-admin-border rounded-xl p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px]">
            <thead>
              <tr>{['#Order','Customer','Items','Qty','Amount','City','Date','Order Type','Status'].map((heading) => (
                <th key={heading} className="text-left text-admin-muted text-[0.65rem] uppercase tracking-wider pb-4 pr-4 font-medium">{heading}</th>
              ))}</tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="border-t border-admin-border/40 hover:bg-white/[0.018] cursor-pointer">
                  <td className="py-3 pr-4 text-sm font-medium text-admin-text">{order.id}</td>
                  <td className="py-3 pr-4 text-sm text-admin-text">{order.customer}</td>
                  <td className="py-3 pr-4 text-[0.72rem] text-admin-muted max-w-[200px] truncate">{order.items}</td>
                  <td className="py-3 pr-4 text-sm text-admin-text">{order.quantity}</td>
                  <td className="py-3 pr-4 text-gold font-medium text-sm">₹{order.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3 pr-4 text-sm text-admin-text">{order.city}</td>
                  <td className="py-3 pr-4 text-[0.7rem] text-admin-muted">{order.date}</td>
                  <td className="py-3 pr-4">
                    <span className="text-[0.68rem] text-admin-text bg-white/[0.04] border border-admin-border rounded-full px-2.5 py-1">
                      {ORDER_TYPES.includes(order.orderType) ? order.orderType : 'semi prepaid'}
                    </span>
                  </td>
                  <td className="py-3" onClick={(event) => event.stopPropagation()}>
                    <select value={order.status} onChange={(event) => handleStatusChange(event, order.id)}
                            className={`text-[0.68rem] font-medium px-2.5 py-1 rounded-full border border-transparent bg-transparent ${STATUS_CLS[order.status] || 'bg-admin-muted/20 text-admin-muted'}`}>
                      {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

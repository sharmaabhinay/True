import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { FiCheckCircle, FiCreditCard, FiMapPin, FiPackage, FiPhone, FiTruck, FiUser } from 'react-icons/fi';
import AdminLayout from '../components/admin/AdminLayout';
import { selectOrderById, updateOrderStatus } from '../store/slices/customerSlice';
import { setPanel, showAdminToast } from '../store/slices/adminSlice';
import { fmtTime, inr } from '../utils/formatters';

const STATUS_OPTIONS = ['processing', 'making', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrderDetailPage() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const order = useSelector(selectOrderById(orderId));

  useEffect(() => {
    dispatch(setPanel('orders'));
  }, [dispatch]);

  const handleStatus = (status) => {
    dispatch(updateOrderStatus({ orderId, status }));
    dispatch(showAdminToast({ msg: `Order ${orderId} updated to ${status}.` }));
  };

  return (
    <AdminLayout title="Order Details" fallback={<div className="min-h-screen bg-admin-bg" />}>
      {!order ? (
        <div className="bg-admin-card border border-admin-border rounded-xl p-6 text-admin-muted">Order not found.</div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-5">
            <section className="bg-admin-card border border-admin-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-admin-muted text-[0.68rem] uppercase tracking-wider mb-2">Order</p>
                  <h1 className="text-admin-text text-xl font-semibold">{order.id}</h1>
                  <p className="text-admin-muted text-sm mt-1">{fmtTime(order.date)}</p>
                </div>
                <select value={order.status} onChange={(e) => handleStatus(e.target.value)}
                        className="bg-admin-surface border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text outline-none">
                  {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Tile icon={<FiPackage />} label="Quantity" value={String(order.items.reduce((sum, item) => sum + item.qty, 0))} />
                <Tile icon={<FiCreditCard />} label="Order type" value={order.orderType} />
                <Tile icon={<FiTruck />} label="Status" value={order.status} />
              </div>

              <div className="mt-5 space-y-3">
                {order.items.map((item) => (
                  <div key={item.cartKey} className="rounded-xl border border-admin-border px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <Link to={`/product/${item.id}`} target="_blank" className="text-gold text-sm font-medium hover:underline">
                          {item.name}
                        </Link>
                        <p className="text-admin-muted text-[0.72rem] mt-1">
                          Qty {item.qty} · Size {item.size || 'Standard'} · Colour {item.color || 'Default'}
                        </p>
                      </div>
                      <p className="text-admin-text text-sm font-medium">{inr(item.price * item.qty)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-admin-card border border-admin-border rounded-xl p-5">
              <h2 className="text-admin-text text-base font-semibold mb-4">Customer</h2>
              <div className="space-y-3">
                <Tile icon={<FiUser />} label="Customer name" value={order.customerName} />
                <Tile icon={<FiPhone />} label="Phone" value={order.phone} />
                <Tile icon={<FiUser />} label="Email" value={order.email} />
                <Tile icon={<FiMapPin />} label="Full address" value={[order.address?.line1, order.address?.line2, order.address?.landmark, order.address?.city, order.address?.state, order.address?.postalCode].filter(Boolean).join(', ')} />
                <Tile icon={<FiCheckCircle />} label="Amount summary" value={`${inr(order.amount)} total · ${inr(order.depositAmount)} advance`} />
              </div>
            </section>
          </div>

          <section className="bg-admin-card border border-admin-border rounded-xl p-5">
            <h2 className="text-admin-text text-base font-semibold mb-4">Timeline</h2>
            <div className="space-y-4">
              {(order.timeline || []).map((entry, index) => (
                <div key={entry.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="w-3 h-3 rounded-full bg-gold mt-1" />
                    {index !== (order.timeline || []).length - 1 && <span className="w-px flex-1 bg-admin-border mt-2" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-admin-text text-sm font-medium">{entry.label}</p>
                    <p className="text-admin-muted text-[0.74rem] mt-1">{entry.detail}</p>
                    <p className="text-admin-muted text-[0.68rem] mt-2">{fmtTime(entry.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </AdminLayout>
  );
}

function Tile({ icon, label, value }) {
  return (
    <div className="rounded-lg bg-white/[0.02] border border-admin-border px-4 py-3">
      <p className="text-admin-muted text-[0.68rem] uppercase tracking-wider mb-2 flex items-center gap-2">{icon}{label}</p>
      <p className="text-admin-text text-sm leading-relaxed">{value || '—'}</p>
    </div>
  );
}

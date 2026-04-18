import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { FiClock, FiMail, FiMapPin, FiPhone, FiShoppingCart, FiUser } from 'react-icons/fi';
import AdminLayout from '../components/admin/AdminLayout';
import { selectCustomerById } from '../store/slices/customerSlice';
import { setPanel } from '../store/slices/adminSlice';
import { fmtTime, inr } from '../utils/formatters';

export default function AdminCustomerDetailPage() {
  const { customerId } = useParams();
  const dispatch = useDispatch();
  const customer = useSelector(selectCustomerById(customerId));

  useEffect(() => {
    dispatch(setPanel('customers'));
  }, [dispatch]);

  return (
    <AdminLayout title="Customer Details" fallback={<div className="min-h-screen bg-admin-bg" />}>
      {!customer ? (
        <div className="bg-admin-card border border-admin-border rounded-xl p-6 text-admin-muted">Customer not found.</div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-5">
            <section className="bg-admin-card border border-admin-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-admin-muted text-[0.68rem] uppercase tracking-wider mb-2">Customer</p>
                  <h1 className="text-admin-text text-xl font-semibold">{customer.name}</h1>
                  <p className="text-admin-muted text-sm mt-1">Customer ID: {customer.id}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xl">
                  <FiUser />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <Detail icon={<FiUser />} label="First name" value={customer.firstName || '—'} />
                <Detail icon={<FiUser />} label="Surname" value={customer.surname || '—'} />
                <Detail icon={<FiPhone />} label="Phone" value={customer.phone || '—'} />
                <Detail icon={<FiMail />} label="Email" value={customer.email || '—'} />
                <Detail icon={<FiClock />} label="Last login" value={fmtTime(customer.lastLoginAt)} />
                <Detail icon={<FiClock />} label="Sessions" value={String(customer.sessions?.length || 0)} />
              </div>

              <div className="mt-5 rounded-xl bg-white/[0.02] border border-admin-border p-4">
                <p className="text-admin-muted text-[0.68rem] uppercase tracking-wider mb-2">Full address</p>
                <p className="text-admin-text text-sm leading-relaxed">
                  {customer.address?.line1
                    ? [customer.address.line1, customer.address.line2, customer.address.landmark, customer.address.city, customer.address.state, customer.address.postalCode].filter(Boolean).join(', ')
                    : 'Address not added yet.'}
                </p>
              </div>
            </section>

            <section className="bg-admin-card border border-admin-border rounded-xl p-5">
              <h2 className="text-admin-text text-base font-semibold mb-4">Activity Snapshot</h2>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <Metric label="Orders" value={customer.orders?.length || 0} />
                <Metric label="Wishlist" value={customer.wishlist?.length || 0} />
                <Metric label="Cart Items" value={customer.cart?.length || 0} />
              </div>

              <div className="space-y-3">
                <h3 className="text-admin-text text-sm font-medium">Current cart</h3>
                {(customer.cart || []).length === 0 ? (
                  <p className="text-admin-muted text-sm">No items currently in cart.</p>
                ) : (
                  customer.cart.map((item) => (
                    <div key={item.cartKey} className="rounded-lg border border-admin-border px-3 py-3">
                      <p className="text-admin-text text-sm">{item.name}</p>
                      <p className="text-admin-muted text-[0.72rem] mt-1">
                        Qty {item.qty} · {item.size || 'Standard'} · {item.color || 'Default'} · {inr(item.price)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <section className="bg-admin-card border border-admin-border rounded-xl p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-admin-text text-base font-semibold">Customer Orders</h2>
              <span className="text-admin-muted text-[0.72rem]">{customer.orders?.length || 0} total</span>
            </div>
            {(customer.orders || []).length === 0 ? (
              <p className="text-admin-muted text-sm">No orders placed yet.</p>
            ) : (
              <div className="space-y-3">
                {customer.orders.map((order) => (
                  <Link key={order.id} to={`/admin/orders/${order.id}`} className="block rounded-lg border border-admin-border px-4 py-3 hover:border-gold transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-admin-text text-sm font-medium">{order.id}</p>
                        <p className="text-admin-muted text-[0.72rem] mt-1">{order.items.length} items · {order.orderType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gold text-sm font-medium">{inr(order.amount)}</p>
                        <p className="text-admin-muted text-[0.72rem]">{order.status}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="bg-admin-card border border-admin-border rounded-xl p-5">
            <h2 className="text-admin-text text-base font-semibold mb-4">Session History</h2>
            <div className="space-y-3">
              {(customer.sessions || []).map((session) => (
                <div key={session.id} className="rounded-lg border border-admin-border px-4 py-3">
                  <p className="text-admin-text text-sm">{session.label}</p>
                  <p className="text-admin-muted text-[0.72rem] mt-1">{session.detail}</p>
                  <p className="text-admin-muted text-[0.68rem] mt-2">{fmtTime(session.time)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </AdminLayout>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="rounded-lg bg-white/[0.02] border border-admin-border px-4 py-3">
      <p className="text-admin-muted text-[0.68rem] uppercase tracking-wider mb-2 flex items-center gap-2">{icon}{label}</p>
      <p className="text-admin-text">{value}</p>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg bg-white/[0.02] border border-admin-border px-3 py-3 text-center">
      <p className="text-admin-text text-lg font-semibold">{value}</p>
      <p className="text-admin-muted text-[0.68rem] uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

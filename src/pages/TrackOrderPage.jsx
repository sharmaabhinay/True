import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AuthModal from '../components/common/AuthModal';
import { selectAllOrders, selectCurrentUser, selectCustomerOrders } from '../store/slices/customerSlice';
import { inr } from '../utils/formatters';

export default function TrackOrderPage() {
  const allOrders = useSelector(selectAllOrders);
  const userOrders = useSelector(selectCustomerOrders);
  const user = useSelector(selectCurrentUser);
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return user ? userOrders : [];
    const term = query.trim().toLowerCase();
    return allOrders.filter((order) =>
      order.id.toLowerCase().includes(term) ||
      (order.phone || '').toLowerCase().includes(term) ||
      (order.customerName || '').toLowerCase().includes(term)
    );
  }, [allOrders, query, user, userOrders]);

  return (
    <>
      <Navbar />
      <AuthModal />
      <main className="pt-[84px] min-h-screen bg-ivory px-6 md:px-12 lg:px-16 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-bark text-[0.72rem] tracking-[0.22em] uppercase mb-3">Track Order</p>
            <h1 className="font-cormorant text-4xl md:text-5xl text-deep font-light">Track your furniture order</h1>
            <p className="text-muted text-sm mt-4 max-w-2xl leading-relaxed">
              Search by order ID, customer name, or phone number. If you are logged in, your recent orders appear automatically.
            </p>
          </div>

          <div className="rounded-[2rem] border border-warm bg-white p-6 md:p-8">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search order ID, phone number, or customer name"
              className="w-full rounded-2xl border border-warm bg-ivory px-4 py-3 text-sm text-deep outline-none font-dm"
            />

            <div className="space-y-4 mt-6">
              {results.length === 0 ? (
                <div className="rounded-[1.6rem] bg-cream px-5 py-6 text-center text-muted text-sm">
                  No matching orders yet. Try a different order ID or sign in to view your own orders.
                </div>
              ) : (
                results.map((order) => (
                  <article key={order.id} className="rounded-[1.6rem] border border-warm p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-deep font-medium">{order.id}</p>
                        <p className="text-muted text-xs mt-1">{order.customerName} · {order.phone}</p>
                      </div>
                      <span className="text-[0.72rem] uppercase tracking-[0.12em] bg-bark/10 text-bark px-3 py-1 rounded-full">
                        {order.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                      <TrackInfo label="Order amount" value={inr(order.amount)} />
                      <TrackInfo label="Advance required" value={inr(order.depositAmount)} />
                      <TrackInfo label="Delivery city" value={order.address?.city || 'Indore'} />
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function TrackInfo({ label, value }) {
  return (
    <div className="rounded-2xl bg-cream px-4 py-4">
      <p className="text-muted text-[0.68rem] uppercase tracking-[0.14em] mb-2">{label}</p>
      <p className="text-deep text-sm font-medium">{value}</p>
    </div>
  );
}

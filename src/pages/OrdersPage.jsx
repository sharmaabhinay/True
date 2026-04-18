import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AuthModal from '../components/common/AuthModal';
import { openAuthModal, selectCustomerOrders, selectIsCustomerAuthenticated } from '../store/slices/customerSlice';
import { inr } from '../utils/formatters';

export default function OrdersPage() {
  const dispatch = useDispatch();
  const orders = useSelector(selectCustomerOrders);
  const isAuthenticated = useSelector(selectIsCustomerAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) dispatch(openAuthModal({ mode: 'login', redirectTo: '/my-orders' }));
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <Navbar />
      <AuthModal />
      <main className="pt-[84px] min-h-screen bg-ivory px-6 md:px-12 lg:px-16 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-bark text-[0.72rem] tracking-[0.22em] uppercase mb-3">My Orders</p>
            <h1 className="font-cormorant text-4xl md:text-5xl text-deep font-light">Your confirmed orders</h1>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="rounded-[2rem] border border-warm bg-white px-8 py-12 text-center text-muted text-sm">
                You do not have any confirmed orders yet.
              </div>
            ) : (
              orders.map((order) => (
                <article key={order.id} className="rounded-[2rem] border border-warm bg-white p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-deep font-medium">{order.id}</p>
                      <p className="text-muted text-xs mt-1">{new Date(order.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-bark font-medium">{inr(order.amount)}</p>
                      <p className="text-muted text-xs">Advance required {inr(order.depositAmount)}</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    {order.items.map((item) => (
                      <div key={item.cartKey} className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-deep">{item.name} × {item.qty}</span>
                        <span className="text-muted">{inr(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

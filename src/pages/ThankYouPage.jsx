import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiCheck } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AuthModal from '../components/common/AuthModal';
import { selectAllOrders } from '../store/slices/customerSlice';
import { inr } from '../utils/formatters';

export default function ThankYouPage() {
  const location = useLocation();
  const orders = useSelector(selectAllOrders);
  const orderId = new URLSearchParams(location.search).get('order');
  const order = useMemo(() => orders.find((item) => item.id === orderId), [orders, orderId]);

  return (
    <>
      <Navbar />
      <AuthModal />
      <main className="pt-[84px] min-h-screen bg-ivory px-6 md:px-12 lg:px-16 pb-16 flex items-center">
        <div className="max-w-4xl mx-auto w-full rounded-[2.4rem] border border-warm bg-white p-8 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <span className="absolute top-14 left-[16%] w-3 h-3 rounded-full bg-gold/40 animate-float-dot" />
            <span className="absolute top-24 right-[20%] w-2 h-2 rounded-full bg-bark/30 animate-float-dot-delayed" />
            <span className="absolute bottom-16 left-[22%] w-2.5 h-2.5 rounded-full bg-sage/35 animate-float-dot" />
            <span className="absolute bottom-14 right-[18%] w-3 h-3 rounded-full bg-gold/30 animate-float-dot-delayed" />
          </div>

          <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-bark/10 border border-bark/15 flex items-center justify-center thank-you-ring">
            <div className="w-16 h-16 rounded-full bg-bark text-white flex items-center justify-center text-3xl">
              <FiCheck />
            </div>
          </div>

          <p className="text-bark text-[0.72rem] tracking-[0.22em] uppercase mb-3">Order Confirmed</p>
          <h1 className="font-cormorant text-4xl md:text-6xl text-deep font-light">Thank you for your order</h1>
          <p className="text-muted text-sm md:text-base leading-relaxed max-w-2xl mx-auto mt-4">
            Your furniture request is confirmed. Our team will verify the advance payment, begin crafting, and contact you with production and delivery updates.
          </p>

          {order && (
            <div className="max-w-2xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <InfoBlock label="Order ID" value={order.id} />
              <InfoBlock label="Confirmed amount" value={inr(order.amount)} />
              <InfoBlock label="Advance required" value={inr(order.depositAmount)} />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            <Link to="/track-order" className="bg-deep text-cream px-6 py-3 rounded-xl text-sm hover:bg-wood transition-colors">
              Track Order
            </Link>
            <Link to="/" className="border-2 border-bark text-bark px-6 py-3 rounded-xl text-sm hover:bg-bark hover:text-white transition-colors">
              Continue Browsing
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div className="rounded-[1.6rem] bg-cream border border-warm px-5 py-4">
      <p className="text-muted text-[0.7rem] uppercase tracking-[0.14em] mb-2">{label}</p>
      <p className="text-deep text-sm font-medium">{value}</p>
    </div>
  );
}

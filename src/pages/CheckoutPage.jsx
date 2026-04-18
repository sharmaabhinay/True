import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiCreditCard, FiMapPin, FiPackage, FiShield } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Toast from '../components/layout/Toast';
import AuthModal from '../components/common/AuthModal';
import {
  placeOrder,
  selectCurrentUser,
  selectIsCustomerAuthenticated,
  openAuthModal,
  updateProfile,
} from '../store/slices/customerSlice';
import { clearCart, selectCartItems, selectCartTotal } from '../store/slices/cartSlice';
import { showToast } from '../store/slices/uiSlice';
import { pushEvent } from '../store/slices/visitorSlice';
import { inr } from '../utils/formatters';

const EMPTY_ADDRESS = {
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  landmark: '',
};

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsCustomerAuthenticated);
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isAuthenticated) dispatch(openAuthModal({ mode: 'login', redirectTo: '/checkout' }));
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    setAddress({
      fullName: user?.name || '',
      phone: user?.phone || '',
      line1: user?.address?.line1 || '',
      line2: user?.address?.line2 || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      postalCode: user?.address?.postalCode || '',
      landmark: user?.address?.landmark || '',
    });
  }, [user]);

  const depositAmount = useMemo(() => Math.ceil(total * 0.1), [total]);
  const hasSavedAddress = Boolean(user?.address?.line1 && user?.address?.city && user?.address?.postalCode);

  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal({ mode: 'login', redirectTo: '/checkout' }));
      dispatch(showToast('Please login before placing your order.'));
      return;
    }

    const required = ['fullName', 'phone', 'line1', 'city', 'state', 'postalCode'];
    const missing = required.some((key) => !address[key]?.trim());

    if (missing) {
      dispatch(showToast('Please complete your full delivery address before placing the order.'));
      return;
    }

    const orderId = `TF-${Date.now().toString().slice(-6)}`;
    dispatch(updateProfile({
      name: address.fullName,
      phone: address.phone,
      address: { ...address },
    }));
    dispatch(placeOrder({
      id: orderId,
      status: 'confirmed',
      date: new Date().toISOString(),
      amount: total,
      depositAmount,
      balanceAmount: total - depositAmount,
      address: { ...address },
      items: items.map((item) => ({
        cartKey: item.cartKey || String(item.id),
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        img: item.img,
      })),
      note: notes.trim(),
    }));
    dispatch(clearCart());
    dispatch(pushEvent({ type: 'order', item: orderId, city: address.city, page: '/checkout' }));
    dispatch(showToast(`Order ${orderId} confirmed.`));
    navigate(`/thank-you?order=${orderId}`);
  };

  return (
    <>
      <Toast />
      <AuthModal />
      <Navbar />

      <main className="pt-[84px] min-h-screen bg-ivory px-6 md:px-12 lg:px-16 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-bark text-[0.72rem] tracking-[0.2em] uppercase mb-3">Checkout</p>
            <h1 className="font-cormorant text-4xl md:text-5xl text-deep font-light">Complete your order</h1>
            <p className="text-muted text-sm mt-3 max-w-2xl leading-relaxed">
              We start crafting and building your furniture only after a successful order confirmation. An advance of 10% of the total amount is required to place the order.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="rounded-[2rem] border border-warm bg-white p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-warm mx-auto mb-5 flex items-center justify-center text-bark text-2xl">
                <FiPackage />
              </div>
              <h2 className="font-cormorant text-3xl text-deep mb-3">Your cart is empty</h2>
              <p className="text-muted text-sm mb-6">Add a few handcrafted pieces first, then come back to place your order.</p>
              <Link to="/" className="inline-flex items-center justify-center bg-deep text-cream px-6 py-3 rounded-xl text-sm hover:bg-wood transition-colors">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8">
              <section className="space-y-6">
                <div className="rounded-[2rem] border border-warm bg-white p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-warm text-bark flex items-center justify-center text-lg">
                      <FiMapPin />
                    </div>
                    <div>
                      <h2 className="font-cormorant text-2xl text-deep">Delivery address</h2>
                      <p className="text-muted text-xs">
                        {hasSavedAddress ? 'Review and update your saved profile address if needed.' : 'Add your full address to confirm delivery and installation.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Full name" value={address.fullName} onChange={(value) => setAddress((prev) => ({ ...prev, fullName: value }))} />
                    <Input label="Phone number" value={address.phone} onChange={(value) => setAddress((prev) => ({ ...prev, phone: value }))} />
                    <Input className="md:col-span-2" label="Address line 1" value={address.line1} onChange={(value) => setAddress((prev) => ({ ...prev, line1: value }))} />
                    <Input className="md:col-span-2" label="Address line 2" value={address.line2} onChange={(value) => setAddress((prev) => ({ ...prev, line2: value }))} />
                    <Input label="City" value={address.city} onChange={(value) => setAddress((prev) => ({ ...prev, city: value }))} />
                    <Input label="State" value={address.state} onChange={(value) => setAddress((prev) => ({ ...prev, state: value }))} />
                    <Input label="Postal code" value={address.postalCode} onChange={(value) => setAddress((prev) => ({ ...prev, postalCode: value }))} />
                    <Input label="Landmark" value={address.landmark} onChange={(value) => setAddress((prev) => ({ ...prev, landmark: value }))} />
                  </div>

                  <label className="block mt-5">
                    <span className="text-muted text-[0.72rem] uppercase tracking-[0.12em] mb-2 block">Order notes</span>
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Share access instructions, preferred call timing, or customization notes."
                      className="w-full min-h-[120px] rounded-2xl border border-warm bg-ivory px-4 py-3 text-sm text-deep outline-none font-dm"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard icon={<FiCreditCard />} title="Advance required" text={`A 10% advance payment of ${inr(depositAmount)} is required to place this order successfully.`} />
                  <InfoCard icon={<FiShield />} title="Crafting begins after confirmation" text="Our workshop schedules your piece only after the order is successfully confirmed and the advance is recorded." />
                </div>
              </section>

              <aside className="rounded-[2rem] border border-warm bg-white p-6 md:p-8 h-fit xl:sticky xl:top-24">
                <h2 className="font-cormorant text-3xl text-deep mb-5">Order summary</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.cartKey || item.id} className="flex gap-4 border-b border-warm/80 pb-4 last:border-0">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-warm">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-deep text-sm font-medium leading-snug">{item.name}</p>
                        <p className="text-muted text-xs mt-1">Quantity: {item.qty}</p>
                        <p className="text-bark text-sm font-medium mt-2">{inr(item.price * item.qty)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-6 border-t border-warm mt-6 text-sm">
                  <SummaryRow label="Subtotal" value={inr(total)} />
                  <SummaryRow label="Required advance (10%)" value={inr(depositAmount)} highlight />
                  <SummaryRow label="Pay after confirmation" value={inr(total - depositAmount)} />
                </div>

                <div className="mt-6 rounded-2xl bg-cream px-4 py-4">
                  <div className="flex items-start gap-3">
                    <FiCheckCircle className="text-bark text-lg mt-0.5 flex-shrink-0" />
                    <p className="text-muted text-xs leading-relaxed">
                      Your order is confirmed after the advance is placed successfully. We then begin production, quality checks, and delivery scheduling for your furniture.
                    </p>
                  </div>
                </div>

                <button onClick={handlePlaceOrder} className="w-full mt-6 bg-deep text-cream py-4 rounded-xl text-sm font-medium cursor-pointer border-none hover:bg-wood transition-colors">
                  Confirm Order
                </button>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

function Input({ className = '', label, onChange, value }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-muted text-[0.72rem] uppercase tracking-[0.12em] mb-2 block">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-warm bg-ivory px-4 py-3 text-sm text-deep outline-none font-dm" />
    </label>
  );
}

function SummaryRow({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted">{label}</span>
      <span className={highlight ? 'text-bark font-semibold' : 'text-deep font-medium'}>{value}</span>
    </div>
  );
}

function InfoCard({ icon, text, title }) {
  return (
    <div className="rounded-[1.6rem] border border-warm bg-white p-5">
      <div className="w-10 h-10 rounded-2xl bg-warm text-bark flex items-center justify-center text-lg mb-4">{icon}</div>
      <h3 className="text-deep font-medium text-sm mb-1">{title}</h3>
      <p className="text-muted text-xs leading-relaxed">{text}</p>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiUser, FiMail, FiAlertCircle, FiInfo, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { selectIsLoggedIn, selectUser, saveAddress, openLoginModal } from '../store/slices/authSlice';
import { selectCartItems, selectCartTotal, clearCart } from '../store/slices/cartSlice';
import { placeOrder } from '../store/slices/orderSlice';
import { inr } from '../utils/formatters';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const inputCls = "w-full border border-warm rounded-xl px-4 py-3 text-sm text-deep bg-white outline-none focus:border-bark transition-colors font-dm placeholder:text-muted";

export default function CheckoutPage() {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const isLoggedIn  = useSelector(selectIsLoggedIn);
  const user        = useSelector(selectUser);
  const cartItems   = useSelector(selectCartItems);
  const cartTotal   = useSelector(selectCartTotal);

  const [step, setStep]         = useState('address'); // 'address' | 'payment' | 'confirm'
  const [orderType, setOrderType] = useState('semi_prepaid'); // 'cod' | 'prepaid' | 'semi_prepaid'
  const [address, setAddress]   = useState({
    fullName: user?.name || '',
    phone:    user?.phone || '',
    email:    user?.email || '',
    line1:    '',
    line2:    '',
    city:     'Indore',
    state:    'Madhya Pradesh',
    pincode:  '',
    landmark: '',
  });

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(openLoginModal('/checkout'));
      navigate('/');
    }
  }, [isLoggedIn, dispatch, navigate]);

  // Pre-fill from saved address
  useEffect(() => {
    if (user?.address) {
      setAddress(a => ({ ...a, ...user.address, fullName: user.name, phone: user.phone, email: user.email }));
    }
  }, [user]);

  // Empty cart guard
  if (cartItems.length === 0 && isLoggedIn) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-ivory pt-[68px] flex flex-col items-center justify-center gap-4">
          <span className="text-6xl">🛒</span>
          <h2 className="font-cormorant text-2xl text-deep">Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="text-bark underline text-sm cursor-pointer bg-transparent border-none">
            Continue Shopping
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const deposit     = Math.round(cartTotal * 0.1);
  const remaining   = cartTotal - deposit;
  const isAddressOk = address.fullName && address.phone && address.line1 && address.pincode;

  const handleSaveAddress = () => {
    if (!isAddressOk) { toast.error('Please fill all required address fields'); return; }
    dispatch(saveAddress(address));
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    const order = {
      userId:    user.id,
      userName:  user.name,
      userEmail: user.email,
      userPhone: user.phone,
      items:     cartItems,
      total:     cartTotal,
      deposit,
      remaining,
      address,
      orderType,
    };
    dispatch(placeOrder(order));
    dispatch(clearCart());
    navigate('/thank-you');
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ivory pt-[68px] font-dm">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">

          {/* Header */}
          <div className="mb-8">
            <p className="text-bark text-[0.7rem] tracking-[0.15em] uppercase mb-1">Checkout</p>
            <h1 className="font-cormorant font-light text-deep text-3xl md:text-4xl">Complete Your Order</h1>
          </div>

          {/* Crafting Note */}
          <motion.div
            initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
            className="bg-gold/10 border border-gold/30 rounded-2xl p-4 mb-6 flex items-start gap-3"
          >
            <FiInfo size={18} className="text-gold mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-deep text-sm font-medium">Your furniture is custom-crafted</p>
              <p className="text-muted text-xs mt-0.5 leading-relaxed">
                Every piece at True Furnitures is built to order — our master craftsmen start crafting your furniture
                only after you place a successful order. This ensures every joint, finish, and dimension is perfect for you.
              </p>
            </div>
          </motion.div>

          {/* 10% Deposit Note */}
          <motion.div
            initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            className="bg-deep text-cream rounded-2xl p-4 mb-8 flex items-start gap-3"
          >
            <FiAlertCircle size={18} className="text-gold mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-cream text-sm font-medium">10% advance required to confirm your order</p>
              <p className="text-cream/60 text-xs mt-0.5">
                A deposit of <strong className="text-gold">{inr(deposit)}</strong> (10% of {inr(cartTotal)}) is required before we begin crafting.
                The remaining <strong className="text-gold">{inr(remaining)}</strong> is payable on delivery.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

            {/* LEFT: Steps */}
            <div>
              {/* Step indicators */}
              <div className="flex items-center gap-2 mb-6">
                {['address','payment','confirm'].map((s, i) => (
                  <React.Fragment key={s}>
                    <div className={`flex items-center gap-2 text-xs font-dm
                                    ${step===s ? 'text-bark' : i < ['address','payment','confirm'].indexOf(step) ? 'text-sage' : 'text-muted'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                                       ${step===s ? 'bg-bark text-white' : i < ['address','payment','confirm'].indexOf(step) ? 'bg-sage text-white' : 'bg-warm text-muted'}`}>
                        {i < ['address','payment','confirm'].indexOf(step) ? <FiCheck size={12}/> : i+1}
                      </div>
                      <span className="hidden sm:block capitalize">{s}</span>
                    </div>
                    {i < 2 && <div className={`flex-1 h-px ${i < ['address','payment','confirm'].indexOf(step) ? 'bg-sage' : 'bg-warm'}`} />}
                  </React.Fragment>
                ))}
              </div>

              {/* STEP 1: Address */}
              {step === 'address' && (
                <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                            className="bg-white rounded-2xl border border-warm p-6 space-y-4">
                  <h2 className="font-cormorant text-xl text-deep mb-2">Delivery Address</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Full Name *</label>
                      <div className="relative">
                        <FiUser size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                        <input type="text" value={address.fullName} onChange={e=>setAddress(a=>({...a,fullName:e.target.value}))}
                               className={`${inputCls} pl-9`} placeholder="Your full name" />
                      </div>
                    </div>
                    <div>
                      <label className="text-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Phone *</label>
                      <div className="relative">
                        <FiPhone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                        <input type="tel" value={address.phone} onChange={e=>setAddress(a=>({...a,phone:e.target.value}))}
                               className={`${inputCls} pl-9`} placeholder="10-digit mobile" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Email</label>
                    <div className="relative">
                      <FiMail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                      <input type="email" value={address.email} onChange={e=>setAddress(a=>({...a,email:e.target.value}))}
                             className={`${inputCls} pl-9`} placeholder="email@example.com" />
                    </div>
                  </div>

                  <div>
                    <label className="text-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Address Line 1 *</label>
                    <div className="relative">
                      <FiMapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                      <input type="text" value={address.line1} onChange={e=>setAddress(a=>({...a,line1:e.target.value}))}
                             className={`${inputCls} pl-9`} placeholder="House no., Street, Colony" />
                    </div>
                  </div>
                  <div>
                    <label className="text-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Address Line 2</label>
                    <input type="text" value={address.line2} onChange={e=>setAddress(a=>({...a,line2:e.target.value}))}
                           className={inputCls} placeholder="Area, Landmark (optional)" />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">City *</label>
                      <input type="text" value={address.city} onChange={e=>setAddress(a=>({...a,city:e.target.value}))}
                             className={inputCls} placeholder="City" />
                    </div>
                    <div>
                      <label className="text-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">State</label>
                      <input type="text" value={address.state} onChange={e=>setAddress(a=>({...a,state:e.target.value}))}
                             className={inputCls} placeholder="State" />
                    </div>
                    <div>
                      <label className="text-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Pincode *</label>
                      <input type="text" value={address.pincode} onChange={e=>setAddress(a=>({...a,pincode:e.target.value}))}
                             className={inputCls} placeholder="452010" maxLength={6} />
                    </div>
                  </div>

                  <button onClick={handleSaveAddress}
                          className="w-full bg-deep text-cream py-4 rounded-xl text-sm font-medium hover:bg-wood transition-colors border-none cursor-pointer mt-2">
                    Continue to Payment →
                  </button>
                </motion.div>
              )}

              {/* STEP 2: Payment */}
              {step === 'payment' && (
                <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                            className="bg-white rounded-2xl border border-warm p-6">
                  <h2 className="font-cormorant text-xl text-deep mb-4">Payment Method</h2>

                  <div className="space-y-3 mb-6">
                    {[
                      { id:'semi_prepaid', label:'Pay 10% Now + Rest on Delivery',     sub:`Pay ${inr(deposit)} now, ${inr(remaining)} on delivery`, tag:'RECOMMENDED' },
                      { id:'prepaid',      label:'Pay Full Amount Online',             sub:`Pay complete ${inr(cartTotal)} now`,                     tag:'INSTANT CONFIRM' },
                      { id:'cod',          label:'Cash on Delivery (COD)',             sub:'Pay full amount when your furniture arrives',             tag:'' },
                    ].map(opt => (
                      <label key={opt.id}
                             className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                                         ${orderType===opt.id ? 'border-bark bg-bark/5' : 'border-warm hover:border-bark/40'}`}>
                        <input type="radio" name="payment" value={opt.id} checked={orderType===opt.id}
                               onChange={() => setOrderType(opt.id)} className="mt-0.5 accent-bark" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-deep">{opt.label}</span>
                            {opt.tag && <span className="text-[0.6rem] bg-bark text-white px-2 py-0.5 rounded-full">{opt.tag}</span>}
                          </div>
                          <p className="text-muted text-xs mt-0.5">{opt.sub}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Deposit reminder */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-800 flex items-start gap-2">
                    <FiAlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                    <span>A minimum 10% advance of <strong>{inr(deposit)}</strong> is required to start your order. Our team will contact you on <strong>{address.phone}</strong> to collect payment.</span>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep('address')}
                            className="flex-1 border-2 border-warm text-muted py-3 rounded-xl text-sm hover:border-bark hover:text-bark transition-all cursor-pointer bg-transparent">
                      ← Back
                    </button>
                    <button onClick={() => setStep('confirm')}
                            className="flex-1 bg-deep text-cream py-3 rounded-xl text-sm font-medium hover:bg-wood transition-colors border-none cursor-pointer">
                      Review Order →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Confirm */}
              {step === 'confirm' && (
                <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                            className="bg-white rounded-2xl border border-warm p-6">
                  <h2 className="font-cormorant text-xl text-deep mb-4">Review &amp; Confirm</h2>

                  {/* Delivery address summary */}
                  <div className="bg-cream rounded-xl p-4 mb-4">
                    <p className="text-xs text-muted uppercase tracking-wider mb-2">Delivering To</p>
                    <p className="text-sm font-medium text-deep">{address.fullName}</p>
                    <p className="text-sm text-muted">{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                    <p className="text-sm text-muted">{address.city}, {address.state} – {address.pincode}</p>
                    <p className="text-sm text-muted">📞 {address.phone}</p>
                  </div>

                  {/* Payment summary */}
                  <div className="bg-cream rounded-xl p-4 mb-6">
                    <p className="text-xs text-muted uppercase tracking-wider mb-2">Payment</p>
                    <p className="text-sm text-deep font-medium capitalize">{orderType.replace('_',' ')}</p>
                    {orderType === 'semi_prepaid' && (
                      <p className="text-xs text-muted mt-1">Pay {inr(deposit)} now · {inr(remaining)} on delivery</p>
                    )}
                  </div>

                  {/* Crafting note */}
                  <div className="bg-gold/10 border border-gold/30 rounded-xl p-3 mb-4 text-xs text-deep flex items-start gap-2">
                    <FiInfo size={14} className="text-gold mt-0.5 flex-shrink-0" />
                    We will begin crafting your furniture as soon as this order is confirmed. Estimated delivery: 7–18 working days.
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep('payment')}
                            className="flex-1 border-2 border-warm text-muted py-3 rounded-xl text-sm hover:border-bark hover:text-bark transition-all cursor-pointer bg-transparent">
                      ← Back
                    </button>
                    <button onClick={handlePlaceOrder}
                            className="flex-1 bg-bark text-white py-3 rounded-xl text-sm font-medium hover:bg-wood transition-colors border-none cursor-pointer">
                      Place Order ✓
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* RIGHT: Order Summary */}
            <div className="sticky top-24 self-start">
              <div className="bg-white rounded-2xl border border-warm p-5">
                <h3 className="font-cormorant text-lg text-deep mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-warm overflow-hidden flex-shrink-0">
                        {item.img && <img src={item.img} alt={item.name} className="w-full h-full object-cover" onError={e=>e.target.style.display='none'} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-deep truncate">{item.name}</p>
                        <p className="text-xs text-muted">Qty: {item.qty}</p>
                      </div>
                      <p className="text-bark text-sm font-medium">{inr(item.price * item.qty)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-warm pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-muted">
                    <span>Subtotal</span><span>{inr(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted">
                    <span>Delivery</span><span className="text-sage">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted">
                    <span>Assembly</span><span className="text-sage">FREE</span>
                  </div>
                  <div className="flex justify-between font-cormorant text-xl font-semibold text-deep pt-2 border-t border-warm">
                    <span>Total</span><span className="text-bark">{inr(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted bg-gold/10 rounded-lg px-3 py-2">
                    <span>Advance (10%)</span>
                    <span className="text-bark font-medium">{inr(deposit)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

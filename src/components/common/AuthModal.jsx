import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiLock, FiMail, FiPhone, FiUser, FiX } from 'react-icons/fi';
import Modal from '../ui/Modal';
import {
  closeAuthModal,
  loginCustomer,
  openAuthModal,
  selectAuthModalState,
  selectCustomers,
  selectCurrentUser,
  selectIsCustomerAuthenticated,
  setAuthMode,
  signupCustomer,
} from '../../store/slices/customerSlice';
import { showToast } from '../../store/slices/uiSlice';

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  password: '',
};

export default function AuthModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { open, mode, redirectTo } = useSelector(selectAuthModalState);
  const users = useSelector(selectCustomers);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsCustomerAuthenticated);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');

  const heading = useMemo(() => (
    mode === 'signup'
      ? 'Create your customer profile'
      : 'Welcome back to True Furnitures'
  ), [mode]);

  const resetState = () => {
    setForm(INITIAL_FORM);
    setError('');
  };

  const close = () => {
    resetState();
    dispatch(closeAuthModal());
  };

  const switchMode = (nextMode) => {
    resetState();
    dispatch(setAuthMode(nextMode));
  };

  const finishAuth = () => {
    const destination = redirectTo || '';
    resetState();
    dispatch(closeAuthModal());
    if (destination) navigate(destination);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const identity = form.email.trim().toLowerCase();
    const user = users.find((item) =>
      (item.email || '').toLowerCase() === identity || (item.phone || '').trim() === form.phone.trim() || (item.phone || '').trim() === identity
    );

    if (!user || user.password !== form.password) {
      setError('We could not match those credentials. Please try again.');
      return;
    }

    dispatch(loginCustomer({ userId: user.id }));
    dispatch(showToast(`Welcome back, ${user.name.split(' ')[0]}.`));
    finishAuth();
  };

  const handleSignup = (event) => {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();

    if (!form.name.trim() || !email || !phone || !form.password.trim()) {
      setError('Please complete all fields before creating your account.');
      return;
    }

    const exists = users.some((item) =>
      (item.email || '').toLowerCase() === email || (item.phone || '').trim() === phone
    );

    if (exists) {
      setError('An account with this email or phone number already exists.');
      return;
    }

    dispatch(signupCustomer({
      name: form.name.trim(),
      email,
      phone,
      password: form.password,
    }));
    dispatch(showToast('Your account is ready. Let’s continue.'));
    finishAuth();
  };

  if (!open || (isAuthenticated && currentUser && !redirectTo)) return null;

  return (
    <Modal open={open} onClose={close} maxWidth="max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-0 overflow-hidden rounded-[1.4rem]">
        <div className="bg-deep text-cream p-8 md:p-10 relative">
          <button
            onClick={close}
            className="absolute top-5 right-5 w-9 h-9 rounded-full border border-white/15 text-cream/80 hover:text-cream hover:border-white/30 transition-colors bg-transparent flex items-center justify-center cursor-pointer"
            aria-label="Close sign in dialog"
          >
            <FiX />
          </button>

          <p className="text-gold text-[0.72rem] uppercase tracking-[0.24em] mb-4">Customer Access</p>
          <h2 className="font-cormorant text-4xl md:text-5xl font-light leading-tight mb-4">
            {heading}
          </h2>
          <p className="text-cream/65 text-sm leading-relaxed max-w-sm">
            Save your wishlist, manage delivery details, and track every handcrafted order from one place.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-10">
            {[
              ['Secure checkout', 'Keep your address, orders, and deposits organized.'],
              ['Made for custom pieces', 'We begin crafting only after your order is successfully confirmed.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-cream text-sm font-medium mb-1">{title}</p>
                <p className="text-cream/55 text-[0.76rem] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ivory p-8 md:p-10">
          <div className="inline-flex rounded-full bg-warm p-1 mb-6">
            <button
              onClick={() => switchMode('login')}
              className={`px-4 py-2 rounded-full text-sm transition-colors cursor-pointer border-none ${
                mode === 'login' ? 'bg-deep text-cream' : 'bg-transparent text-muted'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`px-4 py-2 rounded-full text-sm transition-colors cursor-pointer border-none ${
                mode === 'signup' ? 'bg-deep text-cream' : 'bg-transparent text-muted'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form className="space-y-4" onSubmit={mode === 'signup' ? handleSignup : handleLogin}>
            {mode === 'signup' && (
              <Field
                icon={<FiUser />}
                placeholder="Full name"
                value={form.name}
                onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
              />
            )}

            <Field
              icon={<FiMail />}
              type="email"
              placeholder={mode === 'login' ? 'Email address' : 'Email address'}
              value={form.email}
              onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
            />

            <Field
              icon={<FiPhone />}
              type="tel"
              placeholder={mode === 'login' ? 'Phone number (optional)' : 'Phone number'}
              value={form.phone}
              onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
            />

            <Field
              icon={<FiLock />}
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
            />

            {error && <p className="text-admin-red text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-deep text-cream py-3.5 rounded-xl text-sm font-medium cursor-pointer border-none hover:bg-wood transition-colors flex items-center justify-center gap-2"
            >
              {mode === 'signup' ? 'Create Account' : 'Login'}
              <FiArrowRight />
            </button>
          </form>

          <p className="text-muted text-xs leading-relaxed mt-5">
            By continuing, you can save your wishlist, see your orders, and complete checkout faster.
          </p>

          <button
            onClick={() => dispatch(openAuthModal({ mode: mode === 'login' ? 'signup' : 'login', redirectTo }))}
            className="text-bark text-sm mt-4 bg-transparent border-none cursor-pointer hover:text-wood transition-colors"
          >
            {mode === 'login' ? 'Need a new account? Sign up' : 'Already registered? Login'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Field({ icon, onChange, ...props }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-warm bg-white px-4 py-3.5">
      <span className="text-muted text-base">{icon}</span>
      <input
        {...props}
        onChange={(event) => onChange(event.target.value)}
        className="flex-1 bg-transparent outline-none border-none text-sm text-deep placeholder:text-muted font-dm"
      />
    </label>
  );
}

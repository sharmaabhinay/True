import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  selectLoginModalOpen, selectSignupModalOpen, selectAuthError,
  closeAuthModals, switchToSignup, switchToLogin,
  login, signup, clearError, selectRedirectAfterLogin,
} from '../../store/slices/authSlice';

export default function AuthModal() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const loginOpen  = useSelector(selectLoginModalOpen);
  const signupOpen = useSelector(selectSignupModalOpen);
  const error      = useSelector(selectAuthError);
  const redirect   = useSelector(selectRedirectAfterLogin);

  const [loginForm,  setLoginForm]  = useState({ email:'', password:'' });
  const [signupForm, setSignupForm] = useState({ name:'', email:'', phone:'', password:'', confirm:'' });
  const [showPass, setShowPass] = useState(false);
  const open = loginOpen || signupOpen;

  // Auto-show login/signup on first homepage visit
  useEffect(() => {
    if (location.pathname === '/') {
      const seen = sessionStorage.getItem('tf_auth_shown');
      if (!seen) {
        const t = setTimeout(() => {
          dispatch({ type: 'auth/openLoginModal', payload: null });
          sessionStorage.setItem('tf_auth_shown', '1');
        }, 4000);
        return () => clearTimeout(t);
      }
    }
  }, [location.pathname, dispatch]);

  useEffect(() => { if (!open) { setLoginForm({ email:'', password:'' }); setSignupForm({ name:'', email:'', phone:'', password:'', confirm:'' }); dispatch(clearError()); } }, [open, dispatch]);

  const inputCls = "w-full border border-warm rounded-xl pl-9 pr-4 py-3 text-sm text-deep bg-white outline-none focus:border-bark transition-colors font-dm placeholder:text-muted";

  const handleLogin = () => {
    if (!loginForm.email || !loginForm.password) { dispatch({ type:'auth/login', payload:{ email:'x',password:'y' } }); return; }
    dispatch(login(loginForm));
  };

  const handleSignup = () => {
    if (!signupForm.name || !signupForm.email || !signupForm.password) { toast.error('Please fill all required fields'); return; }
    if (signupForm.password !== signupForm.confirm) { toast.error('Passwords do not match'); return; }
    if (signupForm.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    dispatch(signup(signupForm));
  };

  // After successful auth
  const prevOpen = React.useRef(open);
  useEffect(() => {
    if (prevOpen.current && !open && !error) {
      // Modal just closed without error = success
      if (redirect) { navigate(redirect); }
      else { toast.success(signupOpen ? '🎉 Welcome to True Furnitures!' : '✅ Logged in successfully!'); }
    }
    prevOpen.current = open;
  }, [open, error, redirect, navigate]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="auth-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[900] flex items-center justify-center p-4 bg-deep/50 backdrop-blur-sm"
        onClick={() => dispatch(closeAuthModals())}
      >
        <motion.div
          key={loginOpen ? 'login' : 'signup'}
          initial={{ opacity:0, scale:0.92, y:20 }}
          animate={{ opacity:1, scale:1,    y:0 }}
          exit={{    opacity:0, scale:0.92, y:20 }}
          transition={{ type:'spring', damping:25, stiffness:300 }}
          className="relative bg-ivory rounded-2xl p-7 w-full max-w-md shadow-warm-lg"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={() => dispatch(closeAuthModals())}
                  className="absolute top-4 right-4 text-muted hover:text-deep transition-colors bg-transparent border-none cursor-pointer">
            <FiX size={20} />
          </button>

          {/* Brand */}
          <div className="text-center mb-6">
            <div className="font-cormorant text-2xl font-semibold text-deep mb-1">
              True<span className="text-bark">Furnitures</span>
            </div>
            <h2 className="font-cormorant font-light text-xl text-deep">
              {loginOpen ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-muted text-xs mt-1">
              {loginOpen ? 'Login to track orders & access your wishlist' : 'Join 12,000+ happy Indore homes'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* LOGIN FORM */}
          {loginOpen && (
            <div className="space-y-3">
              <div className="relative">
                <FiMail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input type="email" placeholder="Email address" value={loginForm.email}
                       onChange={e => setLoginForm(f=>({...f,email:e.target.value}))}
                       className={inputCls} onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
              </div>
              <div className="relative">
                <FiLock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input type={showPass?'text':'password'} placeholder="Password" value={loginForm.password}
                       onChange={e => setLoginForm(f=>({...f,password:e.target.value}))}
                       className={`${inputCls} pr-10`} onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
                <button onClick={()=>setShowPass(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-deep bg-transparent border-none cursor-pointer">
                  {showPass ? <FiEyeOff size={15}/> : <FiEye size={15}/>}
                </button>
              </div>
              <button onClick={handleLogin}
                      className="w-full bg-deep text-cream py-3.5 rounded-xl text-sm font-dm font-medium hover:bg-wood transition-colors border-none cursor-pointer mt-2">
                Login
              </button>
              <p className="text-center text-xs text-muted">
                Don't have an account?{' '}
                <button onClick={() => dispatch(switchToSignup())} className="text-bark font-medium bg-transparent border-none cursor-pointer hover:underline">
                  Sign Up
                </button>
              </p>
            </div>
          )}

          {/* SIGNUP FORM */}
          {signupOpen && (
            <div className="space-y-3">
              <div className="relative">
                <FiUser size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input type="text" placeholder="Full Name *" value={signupForm.name}
                       onChange={e => setSignupForm(f=>({...f,name:e.target.value}))} className={inputCls} />
              </div>
              <div className="relative">
                <FiMail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input type="email" placeholder="Email address *" value={signupForm.email}
                       onChange={e => setSignupForm(f=>({...f,email:e.target.value}))} className={inputCls} />
              </div>
              <div className="relative">
                <FiPhone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input type="tel" placeholder="Phone number (optional)" value={signupForm.phone}
                       onChange={e => setSignupForm(f=>({...f,phone:e.target.value}))} className={inputCls} />
              </div>
              <div className="relative">
                <FiLock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input type={showPass?'text':'password'} placeholder="Password * (min 6 chars)" value={signupForm.password}
                       onChange={e => setSignupForm(f=>({...f,password:e.target.value}))} className={`${inputCls} pr-10`} />
                <button onClick={()=>setShowPass(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-deep bg-transparent border-none cursor-pointer">
                  {showPass ? <FiEyeOff size={15}/> : <FiEye size={15}/>}
                </button>
              </div>
              <div className="relative">
                <FiLock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input type="password" placeholder="Confirm password *" value={signupForm.confirm}
                       onChange={e => setSignupForm(f=>({...f,confirm:e.target.value}))}
                       className={inputCls} onKeyDown={e=>e.key==='Enter'&&handleSignup()} />
              </div>
              <button onClick={handleSignup}
                      className="w-full bg-deep text-cream py-3.5 rounded-xl text-sm font-dm font-medium hover:bg-wood transition-colors border-none cursor-pointer mt-2">
                Create Account
              </button>
              <p className="text-center text-xs text-muted">
                Already have an account?{' '}
                <button onClick={() => dispatch(switchToLogin())} className="text-bark font-medium bg-transparent border-none cursor-pointer hover:underline">
                  Login
                </button>
              </p>
            </div>
          )}

          <p className="text-center text-[0.65rem] text-muted/60 mt-4">
            By continuing you agree to our{' '}
            <a href="/terms" className="hover:text-bark">Terms</a> &amp;{' '}
            <a href="/privacy" className="hover:text-bark">Privacy Policy</a>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

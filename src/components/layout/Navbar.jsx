import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiChevronDown, FiHeart, FiLogIn, FiLogOut, FiMenu, FiPackage, FiSearch, FiShoppingBag, FiUser, FiUserPlus, FiX } from 'react-icons/fi';
import {
  selectNavScrolled, selectMobileNavOpen,
  openCart, openQuoteModal, setNavScrolled, toggleMobileNav, closeMobileNav,
} from '../../store';
import { selectCartCount } from '../../store/slices/cartSlice';
import { setSearch } from '../../store/slices/productsSlice';
import {
  logoutCustomer,
  openAuthModal,
  selectCurrentUser,
  selectCustomerWishlist,
  selectIsCustomerAuthenticated,
} from '../../store/slices/customerSlice';

const homeSections = [
  { href: '#categories', label: 'Shop' },
  { href: '#model-viewer', label: '3D View' },
  { href: '#room-viz', label: 'Room Planner' },
  { href: '#emi-calc', label: 'EMI' },
  { href: '#testimonials', label: 'Reviews' },
  { href: '#contact-bar', label: 'Contact' },
];

const pageLinks = [
  { to: '/about-us', label: 'About Us' },
  { to: '/track-order', label: 'Track Order' },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const scrolled = useSelector(selectNavScrolled);
  const mobileOpen = useSelector(selectMobileNavOpen);
  const cartCount = useSelector(selectCartCount);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsCustomerAuthenticated);
  const wishlistIds = useSelector(selectCustomerWishlist);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => dispatch(setNavScrolled(window.scrollY > 50));
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [dispatch]);

  useEffect(() => {
    const close = (event) => {
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const accountLinks = useMemo(() => {
    if (!isAuthenticated) {
      return [
        { label: 'Login', icon: <FiLogIn />, action: () => dispatch(openAuthModal({ mode: 'login' })) },
        { label: 'Sign Up', icon: <FiUserPlus />, action: () => dispatch(openAuthModal({ mode: 'signup' })) },
      ];
    }

    return [
      { label: currentUser?.name || 'My Account', icon: <FiUser />, action: () => navigate('/profile'), subtle: true },
      { label: 'My Orders', icon: <FiPackage />, action: () => navigate('/my-orders') },
      { label: 'My Wishlist', icon: <FiHeart />, action: () => navigate('/wishlist') },
      { label: 'Edit Profile', icon: <FiUser />, action: () => navigate('/profile') },
      { label: 'Logout', icon: <FiLogOut />, action: () => dispatch(logoutCustomer()) },
    ];
  }, [currentUser?.name, dispatch, isAuthenticated, navigate]);

  const goToSection = (href) => {
    dispatch(closeMobileNav());
    if (location.pathname === '/') {
      const target = document.querySelector(href);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      return;
    }
    navigate(`/${href}`);
  };

  const triggerAuth = (mode) => {
    dispatch(closeMobileNav());
    dispatch(openAuthModal({ mode }));
    setProfileOpen(false);
  };

  const menuButtonCls = 'text-[0.83rem] text-muted hover:text-deep transition-colors duration-200 relative group bg-transparent border-none cursor-pointer';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[500] flex items-center justify-between gap-4 bg-ivory/95 backdrop-blur-md border-b border-deep/[0.07] font-dm transition-all duration-300 ${scrolled ? 'h-14 shadow-warm-sm px-4 md:px-8 lg:px-12' : 'h-[68px] px-4 md:px-8 lg:px-12'}`} role="navigation" aria-label="Main navigation">
        <Link to="/" className="font-cormorant text-2xl font-semibold text-deep tracking-wide shrink-0">
          True<span className="text-bark">Furnitures</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-7 list-none" role="menubar">
            {homeSections.map((link) => (
              <li key={link.href} role="none">
                <button role="menuitem" onClick={() => goToSection(link.href)} className={menuButtonCls}>
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-bark transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
            ))}
            {pageLinks.map((link) => (
              <li key={link.to} role="none">
                <Link to={link.to} className="text-[0.83rem] text-muted hover:text-deep transition-colors duration-200">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 bg-warm rounded-full px-3 py-1.5">
            <FiSearch className="text-sm text-muted" />
            <input
              type="search"
              placeholder="Search furniture…"
              aria-label="Search"
              className="bg-transparent border-none outline-none text-[0.8rem] text-deep w-32 lg:w-36 focus:w-40 transition-all placeholder:text-muted font-dm"
              onChange={(event) => dispatch(setSearch(event.target.value))}
            />
          </div>

          <button
            aria-label="Wishlist"
            title="Wishlist"
            onClick={() => navigate('/wishlist')}
            className="relative p-1.5 text-muted hover:text-deep text-base transition-colors bg-transparent border-none cursor-pointer"
          >
            <FiHeart />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-bark text-white rounded-full w-4 h-4 text-[0.6rem] flex items-center justify-center font-medium">
                {wishlistIds.length}
              </span>
            )}
          </button>

          <button
            aria-label="Open cart"
            onClick={() => dispatch(openCart())}
            className="relative p-1.5 text-muted hover:text-deep text-base transition-colors bg-transparent border-none cursor-pointer"
          >
            <FiShoppingBag />
            <span className="absolute -top-1.5 -right-1.5 bg-bark text-white rounded-full w-4 h-4 text-[0.6rem] flex items-center justify-center font-medium">
              {cartCount}
            </span>
          </button>

          <div className="relative" ref={profileRef} onMouseEnter={() => setProfileOpen(true)} onMouseLeave={() => setProfileOpen(false)}>
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-1.5 p-1.5 text-muted hover:text-deep text-base transition-colors bg-transparent border-none cursor-pointer"
              aria-label="Customer account"
            >
              <FiUser />
              <FiChevronDown className={`text-xs transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className={`absolute right-0 top-full mt-3 w-60 rounded-2xl border border-warm bg-white shadow-warm-lg p-2 transition-all ${profileOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
              {!isAuthenticated && (
                <div className="px-3 py-2 border-b border-warm/70 mb-1">
                  <p className="text-deep text-sm font-medium">Join the customer portal</p>
                  <p className="text-muted text-xs mt-1">Login or sign up to save orders, wishlist, and delivery details.</p>
                </div>
              )}

              {accountLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.action();
                    setProfileOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-colors border-none cursor-pointer ${item.subtle ? 'text-bark bg-bark/5' : 'text-deep hover:bg-cream'} ${item.label === 'Logout' ? 'hover:text-admin-red' : ''}`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => dispatch(openQuoteModal())} className="hidden sm:block bg-deep text-cream text-[0.8rem] px-4 py-2 rounded-lg hover:bg-wood transition-colors active:scale-95 border-none cursor-pointer font-dm">
            Get Quote
          </button>

          <button
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="lg:hidden flex items-center justify-center p-1 bg-transparent border-none cursor-pointer text-xl text-deep"
            onClick={() => dispatch(toggleMobileNav())}
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      <div aria-hidden={!mobileOpen} className={`fixed top-[68px] left-0 right-0 bg-ivory z-[490] border-b border-warm shadow-warm-md transition-all duration-350 ${mobileOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 bg-warm rounded-full px-4 py-2 mb-4">
            <FiSearch className="text-sm text-muted" />
            <input
              type="search"
              placeholder="Search furniture…"
              aria-label="Search"
              onChange={(event) => dispatch(setSearch(event.target.value))}
              className="flex-1 bg-transparent border-none outline-none text-sm text-deep placeholder:text-muted font-dm"
            />
          </div>

          <ul className="list-none space-y-0.5">
            {homeSections.map((link) => (
              <li key={link.href}>
                <button onClick={() => goToSection(link.href)} className="mobile-nav-link w-full text-left py-3 px-2 text-base text-deep border-b border-warm hover:text-bark transition-colors bg-transparent border-none cursor-pointer font-dm last:border-0">
                  {link.label}
                </button>
              </li>
            ))}
            {pageLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} onClick={() => dispatch(closeMobileNav())} className="block py-3 px-2 text-base text-deep border-b border-warm hover:text-bark transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-warm bg-white px-4 py-4 mt-4">
            {isAuthenticated ? (
              <>
                <p className="text-deep text-sm font-medium">{currentUser?.name}</p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <MobileAction label="My Orders" onClick={() => { navigate('/my-orders'); dispatch(closeMobileNav()); }} />
                  <MobileAction label="Wishlist" onClick={() => { navigate('/wishlist'); dispatch(closeMobileNav()); }} />
                  <MobileAction label="Edit Profile" onClick={() => { navigate('/profile'); dispatch(closeMobileNav()); }} />
                  <MobileAction label="Logout" onClick={() => { dispatch(logoutCustomer()); dispatch(closeMobileNav()); }} />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <MobileAction label="Login" onClick={() => triggerAuth('login')} />
                <MobileAction label="Sign Up" onClick={() => triggerAuth('signup')} />
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-4 flex-wrap">
            <button onClick={() => { dispatch(openCart()); dispatch(closeMobileNav()); }} className="flex-1 min-w-0 bg-deep text-cream text-sm px-4 py-2.5 rounded-xl text-center font-dm border-none cursor-pointer">
              View Cart
            </button>
            <button onClick={() => { dispatch(openQuoteModal()); dispatch(closeMobileNav()); }} className="flex-1 min-w-0 border-2 border-bark text-bark text-sm px-4 py-2.5 rounded-xl bg-transparent cursor-pointer font-dm">
              Get Quote
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function MobileAction({ label, onClick }) {
  return (
    <button onClick={onClick} className="rounded-xl border border-warm bg-ivory px-3 py-2.5 text-sm text-deep cursor-pointer">
      {label}
    </button>
  );
}

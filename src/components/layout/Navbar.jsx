import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiSearch, FiShoppingCart, FiUser, FiHeart, FiMenu, FiX,
  FiLogOut, FiPackage, FiEdit2, FiChevronDown
} from 'react-icons/fi';
import {
  selectNavScrolled, selectMobileNavOpen,
  openCart, openQuoteModal, setNavScrolled, toggleMobileNav, closeMobileNav,
} from '../../store/slices/uiSlice';
import { setSearch } from '../../store/slices/productsSlice';
import { selectCartCount } from '../../store/slices/cartSlice';
import { selectIsLoggedIn, selectUser, logout, openLoginModal, openSignupModal } from '../../store/slices/authSlice';
import { selectWishlist } from '../../store/slices/productsSlice';

const NAV_LINKS = [
  { label: 'Shop',         href: '/#categories'   },
  { label: '3D View',      href: '/#model-viewer'  },
  { label: 'Room Planner', href: '/#room-viz'      },
  { label: 'EMI',          href: '/#emi-calc'      },
  { label: 'Reviews',      href: '/#testimonials'  },
  { label: 'Contact',      href: '/#contact-bar'   },
];

function ProfileDropdown({ user, onClose }) {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    onClose();
    navigate('/');
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-52 bg-ivory border border-warm rounded-2xl shadow-warm-lg z-50 overflow-hidden py-1">
      {/* User info */}
      <div className="px-4 py-3 border-b border-warm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-bark text-cream text-sm flex items-center justify-center font-medium flex-shrink-0">
            {user.avatar || user.name?.slice(0,2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-deep text-sm font-medium truncate">{user.name}</p>
            <p className="text-muted text-[0.68rem] truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {[
        { icon: <FiPackage size={15}/>, label: 'My Orders',   action: () => { navigate('/track-order'); onClose(); } },
        { icon: <FiHeart   size={15}/>, label: 'My Wishlist', action: () => { navigate('/wishlist');    onClose(); } },
        { icon: <FiEdit2   size={15}/>, label: 'Edit Profile',action: () => { navigate('/?profile=1'); onClose(); } },
      ].map(item => (
        <button
          key={item.label}
          onClick={item.action}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-deep hover:bg-warm transition-colors cursor-pointer bg-transparent border-none text-left font-dm"
        >
          <span className="text-muted">{item.icon}</span>
          {item.label}
        </button>
      ))}

      <div className="border-t border-warm mt-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-none text-left font-dm"
        >
          <FiLogOut size={15}/> Logout
        </button>
      </div>
    </div>
  );
}

export default function Navbar() {
  const dispatch      = useDispatch();
  const navigate      = useNavigate();
  const scrolled      = useSelector(selectNavScrolled);
  const mobileOpen    = useSelector(selectMobileNavOpen);
  const cartCount     = useSelector(selectCartCount);
  const isLoggedIn    = useSelector(selectIsLoggedIn);
  const user          = useSelector(selectUser);
  const wishlist      = useSelector(selectWishlist);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef    = useRef(null);

  useEffect(() => {
    const onScroll = () => dispatch(setNavScrolled(window.scrollY > 50));
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [dispatch]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNavClick = (href) => {
    dispatch(closeMobileNav());
    if (href.startsWith('/#')) {
      const sectionId = href.replace('/#', '');
      // If on homepage, scroll; otherwise navigate home then scroll
      if (window.location.pathname === '/') {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }), 300);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[500] flex items-center justify-between gap-4
                     bg-ivory/95 backdrop-blur-md border-b border-deep/[0.07] font-dm
                     transition-all duration-300 px-4 md:px-8 lg:px-12
                     ${scrolled ? 'h-14 shadow-warm-sm' : 'h-[68px]'}`}
      >
        {/* Logo */}
        <Link to="/" className="font-cormorant text-2xl font-semibold text-deep tracking-wide shrink-0">
          True<span className="text-bark">Furnitures</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-7 list-none">
          {NAV_LINKS.map(l => (
            <li key={l.href}>
              <button
                onClick={() => handleNavClick(l.href)}
                className="text-[0.83rem] text-muted hover:text-deep transition-colors duration-200 relative group bg-transparent border-none cursor-pointer font-dm"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-bark transition-all duration-300 group-hover:w-full" />
              </button>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Search */}
          <div className="hidden md:flex items-center gap-1.5 bg-warm rounded-full px-3 py-1.5">
            <FiSearch size={14} className="text-muted" />
            <input
              type="search"
              placeholder="Search furniture…"
              aria-label="Search"
              onChange={e => dispatch(setSearch(e.target.value))}
              className="bg-transparent border-none outline-none text-[0.8rem] text-deep w-32 lg:w-36 focus:w-40 transition-all placeholder:text-muted font-dm"
            />
          </div>

          {/* Wishlist */}
          <button
            onClick={() => navigate('/wishlist')}
            aria-label="Wishlist"
            className="relative p-2 text-muted hover:text-deep transition-colors bg-transparent border-none cursor-pointer"
          >
            <FiHeart size={18} className={wishlist.length > 0 ? 'fill-red-500 stroke-red-500' : ''} />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full w-4 h-4 text-[0.58rem] flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => dispatch(openCart())}
            aria-label="Cart"
            className="relative p-2 text-muted hover:text-deep transition-colors bg-transparent border-none cursor-pointer"
          >
            <FiShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-bark text-white rounded-full w-4 h-4 text-[0.58rem] flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile icon */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => isLoggedIn ? setProfileOpen(v => !v) : dispatch(openLoginModal())}
              aria-label="Profile"
              className="flex items-center gap-1 p-2 text-muted hover:text-deep transition-colors bg-transparent border-none cursor-pointer"
            >
              {isLoggedIn ? (
                <div className="w-7 h-7 rounded-full bg-bark text-cream text-xs flex items-center justify-center font-medium">
                  {user?.avatar || user?.name?.slice(0,2).toUpperCase() || 'U'}
                </div>
              ) : (
                <FiUser size={18} />
              )}
              {isLoggedIn && <FiChevronDown size={12} className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />}
            </button>

            {/* Dropdown — logged out */}
            {!isLoggedIn && profileOpen && (
              <div className="absolute top-full right-0 mt-2 w-44 bg-ivory border border-warm rounded-2xl shadow-warm-lg z-50 overflow-hidden py-1">
                <button
                  onClick={() => { dispatch(openLoginModal()); setProfileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-deep hover:bg-warm transition-colors cursor-pointer bg-transparent border-none font-dm text-left"
                >
                  <FiUser size={15} className="text-muted" /> Login
                </button>
                <button
                  onClick={() => { dispatch(openSignupModal()); setProfileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-deep hover:bg-warm transition-colors cursor-pointer bg-transparent border-none font-dm text-left"
                >
                  <FiEdit2 size={15} className="text-muted" /> Sign Up
                </button>
              </div>
            )}

            {/* Dropdown — logged in */}
            {isLoggedIn && profileOpen && (
              <ProfileDropdown user={user} onClose={() => setProfileOpen(false)} />
            )}
          </div>

          {/* Get Quote CTA */}
          <button
            onClick={() => dispatch(openQuoteModal())}
            className="hidden sm:block bg-deep text-cream text-[0.8rem] px-4 py-2 rounded-lg hover:bg-wood transition-colors active:scale-95 border-none cursor-pointer font-dm ml-1"
          >
            Get Quote
          </button>

          {/* Hamburger */}
          <button
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="lg:hidden p-2 bg-transparent border-none cursor-pointer text-deep"
            onClick={() => dispatch(toggleMobileNav())}
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      <div
        aria-hidden={!mobileOpen}
        className={`fixed top-[68px] left-0 right-0 bg-ivory z-[490] border-b border-warm shadow-warm-md
                     transition-all duration-300 lg:hidden
                     ${mobileOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-2 opacity-0 pointer-events-none'}`}
      >
        <div className="px-5 py-4">
          {/* Mobile search */}
          <div className="flex items-center gap-2 bg-warm rounded-full px-4 py-2 mb-4">
            <FiSearch size={14} className="text-muted" />
            <input
              type="search"
              placeholder="Search furniture…"
              onChange={e => dispatch(setSearch(e.target.value))}
              className="flex-1 bg-transparent border-none outline-none text-sm text-deep placeholder:text-muted font-dm"
            />
          </div>
          <ul className="list-none space-y-0">
            {NAV_LINKS.map(l => (
              <li key={l.href}>
                <button
                  onClick={() => handleNavClick(l.href)}
                  className="w-full text-left py-3 px-2 text-base text-deep border-b border-warm hover:text-bark transition-colors bg-transparent border-none cursor-pointer font-dm last:border-0"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={() => { dispatch(openQuoteModal()); dispatch(closeMobileNav()); }}
              className="flex-1 bg-deep text-cream text-sm px-4 py-2.5 rounded-xl font-dm border-none cursor-pointer"
            >
              Get Quote
            </button>
            {!isLoggedIn && (
              <button
                onClick={() => { dispatch(openLoginModal()); dispatch(closeMobileNav()); }}
                className="flex-1 border-2 border-bark text-bark text-sm px-4 py-2.5 rounded-xl bg-transparent font-dm cursor-pointer"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

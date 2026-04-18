import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectNavScrolled, selectMobileNavOpen,
  openCart, openQuoteModal, setNavScrolled, toggleMobileNav, closeMobileNav,
} from '../../store';
import { selectCartCount } from '../../store/slices/cartSlice';
import { setSearch } from '../../store/slices/productsSlice';

export default function Navbar() {
  const dispatch     = useDispatch();
  const scrolled     = useSelector(selectNavScrolled);
  const mobileOpen   = useSelector(selectMobileNavOpen);
  const cartCount    = useSelector(selectCartCount);

  useEffect(() => {
    const onScroll = () => dispatch(setNavScrolled(window.scrollY > 50));
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [dispatch]);

  const navLinks = [
    { href:'#categories',   label:'Shop'         },
    { href:'#model-viewer', label:'3D View'       },
    { href:'#room-viz',     label:'Room Planner'  },
    { href:'#emi-calc',     label:'EMI'           },
    { href:'#testimonials', label:'Reviews'       },
    { href:'#contact-bar',  label:'Contact'       },
  ];

  const handleNavClick = (href) => {
    dispatch(closeMobileNav());
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior:'smooth' });
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[500] flex items-center justify-between gap-4
                       bg-ivory/95 backdrop-blur-md border-b border-deep/[0.07] font-dm
                       transition-all duration-300
                       ${scrolled ? 'h-14 shadow-warm-sm px-4 md:px-8 lg:px-12' : 'h-[68px] px-4 md:px-8 lg:px-12'}`}
           role="navigation" aria-label="Main navigation">

        {/* Logo */}
        <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); }}
           className="font-cormorant text-2xl font-semibold text-deep tracking-wide shrink-0">
          True<span className="text-bark">Furnitures</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-7 list-none" role="menubar">
          {navLinks.map(l => (
            <li key={l.href} role="none">
              <button role="menuitem" onClick={() => handleNavClick(l.href)}
                      className="text-[0.83rem] text-muted hover:text-deep transition-colors duration-200 relative group bg-transparent border-none cursor-pointer">
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-bark transition-all duration-300 group-hover:w-full" />
              </button>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search */}
          <div className="hidden md:flex items-center gap-1.5 bg-warm rounded-full px-3 py-1.5">
            <span className="text-sm text-muted">🔍</span>
            <input type="search" placeholder="Search furniture…" aria-label="Search"
                   className="bg-transparent border-none outline-none text-[0.8rem] text-deep w-32 lg:w-36 focus:w-40 transition-all placeholder:text-muted font-dm"
                   onChange={e => dispatch(setSearch(e.target.value))} />
          </div>

          {/* Phone */}
          <a href="tel:7773896496"
             className="hidden md:flex items-center gap-1 text-bark text-[0.78rem] font-medium whitespace-nowrap hover:text-wood transition-colors">
            📞 7773896496
          </a>

          {/* Wishlist */}
          <button aria-label="Wishlist" title="Wishlist"
                  className="p-1.5 text-muted hover:text-deep text-base transition-colors bg-transparent border-none cursor-pointer">
            ♡
          </button>

          {/* Cart */}
          <button aria-label="Open cart" onClick={() => dispatch(openCart())}
                  className="relative p-1.5 text-muted hover:text-deep text-base transition-colors bg-transparent border-none cursor-pointer">
            🛒
            <span className="absolute -top-1.5 -right-1.5 bg-bark text-white rounded-full w-4 h-4 text-[0.6rem] flex items-center justify-center font-medium">
              {cartCount}
            </span>
          </button>

          {/* Get Quote CTA */}
          <button onClick={() => dispatch(openQuoteModal())}
                  className="hidden sm:block bg-deep text-cream text-[0.8rem] px-4 py-2 rounded-lg hover:bg-wood transition-colors active:scale-95 border-none cursor-pointer font-dm">
            Get Quote
          </button>

          {/* Hamburger */}
          <button aria-label="Toggle menu" aria-expanded={mobileOpen}
                  className="lg:hidden flex flex-col gap-1.5 p-1 bg-transparent border-none cursor-pointer"
                  onClick={() => dispatch(toggleMobileNav())}>
            <span className={`block w-5 h-0.5 bg-deep rounded transition-all duration-300 ${mobileOpen ? 'translate-y-2 rotate-45':''}`} />
            <span className={`block w-5 h-0.5 bg-deep rounded transition-all duration-300 ${mobileOpen ? 'opacity-0':''}`} />
            <span className={`block w-5 h-0.5 bg-deep rounded transition-all duration-300 ${mobileOpen ? '-translate-y-2 -rotate-45':''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Nav Drawer */}
      <div aria-hidden={!mobileOpen}
           className={`fixed top-[68px] left-0 right-0 bg-ivory z-[490] border-b border-warm
                       shadow-warm-md transition-all duration-350
                       ${mobileOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className="px-5 py-4">
          {/* Mobile search */}
          <div className="flex items-center gap-2 bg-warm rounded-full px-4 py-2 mb-4">
            <span className="text-sm">🔍</span>
            <input type="search" placeholder="Search furniture…" aria-label="Search"
                   onChange={e => dispatch(setSearch(e.target.value))}
                   className="flex-1 bg-transparent border-none outline-none text-sm text-deep placeholder:text-muted font-dm" />
          </div>

          <ul className="list-none space-y-0.5">
            {navLinks.map(l => (
              <li key={l.href}>
                <button onClick={() => handleNavClick(l.href)}
                        className="mobile-nav-link w-full text-left py-3 px-2 text-base text-deep border-b border-warm
                                   hover:text-bark transition-colors bg-transparent border-none cursor-pointer font-dm last:border-0">
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex gap-3 mt-4 flex-wrap">
            <a href="tel:7773896496" className="flex-1 min-w-0 bg-deep text-cream text-sm px-4 py-2.5 rounded-xl text-center font-dm">
              📞 7773896496
            </a>
            <button onClick={() => { dispatch(openQuoteModal()); dispatch(closeMobileNav()); }}
                    className="flex-1 min-w-0 border-2 border-bark text-bark text-sm px-4 py-2.5 rounded-xl bg-transparent cursor-pointer font-dm">
              Get Quote
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

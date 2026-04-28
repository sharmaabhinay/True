import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { openQuoteModal } from '../../store/slices/uiSlice';

export default function Footer() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const scroll = (id) => {
    if (window.location.pathname === '/') document.getElementById(id)?.scrollIntoView({ behavior:'smooth' });
    else { navigate('/'); setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'}),300); }
  };

  return (
    <footer className="bg-deep text-cream font-dm">
      <div className="px-6 md:px-12 lg:px-16 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-cormorant text-3xl font-semibold block mb-3">
              True<span className="text-gold">Furnitures</span>
            </Link>
            <p className="text-cream/40 text-[0.8rem] leading-relaxed max-w-[240px]">
              Custom-crafted furniture for Indore homes since 2007. Built to order, built to last.
            </p>
            <a href="tel:7773896496" className="flex items-center gap-2 text-gold text-[0.85rem] font-medium mt-4 hover:text-gold/80 transition-colors">
              📞 7773896496
            </a>
            <p className="text-cream/30 text-[0.72rem] mt-1.5">📍 Vijay Nagar Square, Indore – 452010</p>
          </div>

          {/* Shop */}
          <div>
            <h5 className="text-cream/40 text-[0.68rem] tracking-widest uppercase mb-4">Shop</h5>
            <ul className="space-y-2">
              {['Living Room','Bedroom','Dining','Office','Outdoor'].map(c=>(
                <li key={c}><button onClick={()=>scroll('products')} className="text-cream/65 text-[0.82rem] hover:text-cream transition-colors bg-transparent border-none cursor-pointer">{c}</button></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="text-cream/40 text-[0.68rem] tracking-widest uppercase mb-4">Company</h5>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-cream/65 text-[0.82rem] hover:text-cream transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-cream/65 text-[0.82rem] hover:text-cream transition-colors">Careers</Link></li>
              <li><Link to="/privacy" className="text-cream/65 text-[0.82rem] hover:text-cream transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-cream/65 text-[0.82rem] hover:text-cream transition-colors">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="text-cream/40 text-[0.68rem] tracking-widest uppercase mb-4">Support</h5>
            <ul className="space-y-2">
              <li><Link to="/track-order" className="text-cream/65 text-[0.82rem] hover:text-cream transition-colors">Track Order</Link></li>
              <li><button onClick={()=>dispatch(openQuoteModal())} className="text-cream/65 text-[0.82rem] hover:text-cream transition-colors bg-transparent border-none cursor-pointer">Get Quote</button></li>
              <li><button onClick={()=>scroll('emi-calc')} className="text-cream/65 text-[0.82rem] hover:text-cream transition-colors bg-transparent border-none cursor-pointer">EMI Plans</button></li>
              <li><a href="tel:7773896496" className="text-cream/65 text-[0.82rem] hover:text-cream transition-colors">Contact Us</a></li>
              <li><Link to="/admin" className="text-cream/30 text-[0.68rem] hover:text-cream/50 transition-colors mt-2 inline-block">Admin ↗</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.07] pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-cream/30 text-[0.72rem]">
          <span>© 2025 True Furnitures Indore. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-cream/60">Privacy</Link>
            <Link to="/terms"   className="hover:text-cream/60">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

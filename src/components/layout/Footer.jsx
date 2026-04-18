import React from 'react';
import { useDispatch } from 'react-redux';
import { openQuoteModal } from '../../store/slices/uiSlice';

const footerLinks = {
  Shop:    [['Living Room','#categories'],['Bedroom','#categories'],['Dining','#categories'],['Office','#categories'],['Outdoor','#categories']],
  Company: [['About Us','#'],['Craftsmanship','#'],['Sustainability','#'],['Careers','#']],
  Support: [['Track Order','#'],['Returns','#'],['Warranty','#'],['EMI Plans','#emi-calc']],
};

export default function Footer() {
  const dispatch = useDispatch();

  const scroll = (href) => {
    if (href === '#') return;
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-deep text-cream font-dm">
      <div className="px-6 md:px-12 lg:px-16 pt-14 pb-8">
        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-cormorant text-3xl font-semibold mb-3">
              True<span className="text-gold">Furnitures</span>
            </div>
            <p className="text-cream/40 text-[0.8rem] leading-relaxed max-w-[240px]">
              Crafting Indore homes with heart since 2007. Premium handcrafted furniture delivered with care.
            </p>
            <a href="tel:7773896496"
               className="flex items-center gap-2 text-gold text-[0.85rem] font-medium mt-4 hover:text-gold/80 transition-colors">
              📞 7773896496
            </a>
            <p className="text-cream/30 text-[0.72rem] mt-2">
              📍 Vijay Nagar Square, Indore – 452010
            </p>
            {/* Social */}
            <div className="flex gap-2 mt-4">
              {['Instagram','Pinterest','YouTube'].map(s => (
                <button key={s}
                        className="bg-white/[0.06] border border-white/10 text-cream/60 text-[0.72rem] px-3 py-1.5 rounded-lg hover:border-white/20 hover:text-cream transition-all cursor-pointer">
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h5 className="text-cream/40 text-[0.68rem] tracking-widest uppercase mb-4">{title}</h5>
              <ul className="space-y-2">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <button onClick={() => scroll(href)}
                            className="text-cream/65 text-[0.82rem] hover:text-cream transition-colors bg-transparent border-none cursor-pointer text-left">
                      {label}
                    </button>
                  </li>
                ))}
                {title === 'Support' && (
                  <li>
                    <button onClick={() => dispatch(openQuoteModal())}
                            className="text-cream/65 text-[0.82rem] hover:text-cream transition-colors bg-transparent border-none cursor-pointer">
                      Get Quote
                    </button>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.07] pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-cream/30 text-[0.72rem]">
          <span>© 2025 True Furnitures Indore. All rights reserved.</span>
          <div className="flex gap-4">
            <span>Privacy</span><span>Terms</span><span>Sitemap</span>
            <a href="/admin" className="opacity-30 hover:opacity-50 transition-opacity">Admin ↗</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

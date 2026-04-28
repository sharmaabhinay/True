import React from 'react';
import { useReveal } from '../../hooks/useReveal';

const cards = [
  { icon:'🌳', title:'Sustainably Sourced',    desc:'FSC-certified wood from responsibly managed forests across India.' },
  { icon:'🔧', title:'Master Craftsmen',        desc:'Handcrafted by 3rd-generation artisans with decades of heritage expertise.' },
  { icon:'🏠', title:'White-Glove Delivery',   desc:'Free delivery, full assembly & old furniture removal across Indore.' },
  { icon:'🛡️', title:'10-Year Warranty',        desc:'Every structural component covered. We stand behind every piece.' },
];

export default function WhyUs() {
  const revealRef = useReveal();
  return (
    <section id="why-us" ref={revealRef} className="reveal py-20 px-6 md:px-12 lg:px-16 bg-deep text-cream">
      <div className="text-center mb-12">
        <p className="text-gold text-[0.7rem] tracking-[0.15em] uppercase mb-2">Why True Furnitures Indore</p>
        <h2 className="font-cormorant font-light text-cream text-3xl md:text-4xl lg:text-5xl">
          Built on <em className="text-gold">trust</em>
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(c => (
          <div key={c.title}
               className="text-center p-7 border border-white/[0.07] rounded-2xl
                          hover:border-gold/30 hover:bg-gold/[0.04] transition-all duration-300">
            <span className="text-4xl block mb-4">{c.icon}</span>
            <h3 className="font-cormorant font-semibold text-xl mb-3">{c.title}</h3>
            <p className="text-cream/55 text-sm leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

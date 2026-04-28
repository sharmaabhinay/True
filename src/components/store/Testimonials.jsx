import React from 'react';
import { useReveal } from '../../hooks/useReveal';
import { TESTIMONIALS } from '../../data/constants';

export default function Testimonials() {
  const revealRef = useReveal();
  return (
    <section id="testimonials" ref={revealRef} className="reveal py-20 px-6 md:px-12 lg:px-16 bg-ivory">
      <div className="text-center mb-12">
        <p className="text-bark text-[0.7rem] tracking-[0.15em] uppercase mb-2">Real Customers · Indore &amp; MP</p>
        <h2 className="font-cormorant font-light text-deep text-3xl md:text-4xl lg:text-5xl">
          Real homes, <em className="text-bark">real stories</em>
        </h2>
      </div>
      <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-2 -mx-6 px-6 md:-mx-12 md:px-12">
        {TESTIMONIALS.map(t => (
          <div key={t.name}
               className="bg-cream rounded-2xl p-7 min-w-[280px] sm:min-w-[320px] flex-shrink-0
                          hover:-translate-y-1 transition-transform duration-300">
            <div className="text-gold text-base mb-3">{'★'.repeat(t.stars)}</div>
            <p className="font-cormorant italic text-deep leading-relaxed text-lg mb-4">{t.text}</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-bark flex items-center justify-center
                              text-white text-sm font-medium flex-shrink-0">
                {t.initials}
              </div>
              <div>
                <div className="text-deep text-sm font-medium">{t.name}</div>
                <div className="text-muted text-[0.7rem]">📍 {t.loc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

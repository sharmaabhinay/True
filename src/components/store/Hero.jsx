import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openQuoteModal } from '../../store/slices/uiSlice';
import { use3DCanvas } from '../../hooks/use3DCanvas';
import { drawSofa } from '../../utils/engine3d';

const WORDS = ['sofa', 'bedroom', 'almirah', 'dining', 'workspace'];

export default function Hero() {
  const dispatch = useDispatch();
  const [activeWord, setActiveWord] = useState(WORDS[0]);

  const { canvasRef } = use3DCanvas(
    (ctx, cx, cy, rx, ry) => drawSofa(ctx, cx, cy, rx, ry, '#8B6B4A'),
    []
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveWord((current) => WORDS[(WORDS.indexOf(current) + 1) % WORDS.length]);
    }, 1800);
    return () => window.clearInterval(id);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" aria-label="True Furnitures Indore — Premium Handcrafted Furniture"
             className="min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center
                        px-6 md:px-12 lg:px-16 pt-[68px] gap-8
                        bg-gradient-to-br from-ivory via-ivory to-warm relative overflow-hidden">

      {/* Background text watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <span className="font-cormorant text-[22vw] font-semibold text-bark/[0.04] leading-none whitespace-nowrap">
          LIVE
        </span>
      </div>

      {/* Blob */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-radial from-gold/[0.07] to-transparent
                      right-[-100px] top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />

      {/* Left — content */}
      <div className="relative z-10 pb-12 lg:pb-0">
        <div className="inline-flex items-center gap-2 bg-bark/10 border border-bark/25 rounded-full
                        px-4 py-1.5 text-bark text-xs mb-5
                        animate-fade-up" style={{ animationDelay:'2.5s', animationFillMode:'both' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-bark inline-block" />
          Indore's Most Trusted Furniture Brand
        </div>

        <h1 className="font-cormorant font-light text-deep leading-[1.05] mb-5
                       text-[2.6rem] sm:text-[3.2rem] lg:text-[4rem] xl:text-[4.8rem]
                       animate-fade-up" style={{ animationDelay:'2.6s', animationFillMode:'both' }}>
          Get your fully customized<br />
          <span className="inline-flex min-h-[1.2em] items-center">
            <em key={activeWord} className="text-bark not-italic hero-word-swap">{activeWord}</em>
          </span>
        </h1>

        <p className="text-muted leading-relaxed max-w-md mb-8 text-sm md:text-base
                      animate-fade-up" style={{ animationDelay:'2.7s', animationFillMode:'both' }}>
          From tailored wardrobes to sculptural seating, every piece at True Furnitures is built around your room, your routine, and your finish preferences.
        </p>

        <div className="flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay:'2.8s', animationFillMode:'both' }}>
          <button onClick={() => scrollTo('products')}
                  className="bg-deep text-cream px-7 py-3.5 rounded-xl text-sm font-dm font-medium
                             hover:bg-wood hover:-translate-y-0.5 hover:shadow-warm-md
                             transition-all active:scale-95 cursor-pointer border-none">
            Explore Collection
          </button>
          <button onClick={() => dispatch(openQuoteModal('I want a fully customized furniture design consultation.'))}
                  className="bg-transparent text-bark border-2 border-bark px-7 py-3.5 rounded-xl text-sm font-dm font-medium
                             hover:bg-bark hover:text-white hover:-translate-y-0.5
                             transition-all active:scale-95 cursor-pointer">
            Start Custom Design
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-8 mt-10 animate-fade-up" style={{ animationDelay:'2.9s', animationFillMode:'both' }}>
          {[['12K+','Happy Homes'],['500+','Designs'],['18','Years in Indore']].map(([n,l]) => (
            <div key={l}>
              <div className="font-cormorant text-3xl font-semibold text-deep">{n}</div>
              <div className="text-muted text-xs mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — 3D Canvas */}
      <div className="relative hidden lg:flex items-center justify-center animate-fade-up"
           style={{ animationDelay:'2.6s', animationFillMode:'both' }} aria-hidden="true">
        <canvas ref={canvasRef} className="w-full max-w-[560px] h-[440px] cursor-grab active:cursor-grabbing" />
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-muted text-[0.68rem] whitespace-nowrap">
          ↺ Drag to rotate · Scroll to zoom
        </span>
      </div>
    </section>
  );
}

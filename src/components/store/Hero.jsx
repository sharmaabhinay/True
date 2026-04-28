import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { openQuoteModal } from '../../store/slices/uiSlice';
import { use3DCanvas } from '../../hooks/use3DCanvas';
import { drawSofa } from '../../utils/engine3d';

const WORDS = [
  { word:'Sofa', color:'#8B6B4A' }, { word:'Almirah', color:'#6B4C2A' },
  { word:'Bedroom Set', color:'#2C1F12' }, { word:'Dining Table', color:'#C8A86B' },
  { word:'TV Unit', color:'#7A8C6E' }, { word:'Wardrobe', color:'#6B4C2A' },
  { word:'Bookshelf', color:'#8B6B4A' }, { word:'Coffee Table', color:'#C8A86B' },
];

export default function Hero() {
  const dispatch = useDispatch();
  const [idx, setIdx] = useState(0);
  const { canvasRef } = use3DCanvas((ctx,cx,cy,rx,ry)=>drawSofa(ctx,cx,cy,rx,ry,'#8B6B4A'),[]);

  useEffect(()=>{ const id=setInterval(()=>setIdx(i=>(i+1)%WORDS.length),2200); return()=>clearInterval(id); },[]);

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  const cur = WORDS[idx];

  return (
    <section id="hero" className="min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center
                       px-6 md:px-12 lg:px-16 pt-[68px] gap-8
                       bg-gradient-to-br from-ivory via-ivory to-warm relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <span className="font-cormorant text-[18vw] font-semibold text-bark/[0.04] leading-none whitespace-nowrap">CRAFT</span>
      </div>
      <div className="absolute w-[500px] h-[500px] rounded-full right-[-80px] top-1/2 -translate-y-1/2 pointer-events-none bg-gradient-radial from-gold/[0.06] to-transparent" aria-hidden="true" />

      <div className="relative z-10 pb-12 lg:pb-0">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:2.5}}
          className="inline-flex items-center gap-2 bg-bark/10 border border-bark/25 rounded-full px-4 py-1.5 text-bark text-xs mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-bark inline-block animate-pulse"/>
          Indore's Most Trusted Custom Furniture Brand
        </motion.div>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:2.6}}>
          <h1 className="font-cormorant font-light text-deep leading-[1.08] text-[clamp(2.2rem,4vw,4rem)]">
            Get your fully<br/>customized
          </h1>
          <div className="relative overflow-hidden" style={{height:'1.15em', fontSize:'clamp(2.4rem,4vw,4.2rem)'}}>
            <AnimatePresence mode="wait">
              <motion.span key={idx}
                initial={{y:50,opacity:0,rotateX:-90}} animate={{y:0,opacity:1,rotateX:0}} exit={{y:-50,opacity:0,rotateX:90}}
                transition={{type:'spring',damping:20,stiffness:300}}
                className="absolute left-0 font-cormorant font-semibold italic" style={{color:cur.color}}>
                {cur.word}
              </motion.span>
            </AnimatePresence>
          </div>
          <h1 className="font-cormorant font-light text-deep leading-[1.08] text-[clamp(2.2rem,4vw,4rem)]">furniture</h1>
        </motion.div>

        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:2.8}}
          className="text-muted leading-relaxed max-w-md mt-5 mb-8 text-sm md:text-base">
          Every piece is handcrafted to your exact specifications by master artisans in Indore.
          No catalogue items — only bespoke furniture built just for you.
        </motion.p>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:2.9}} className="flex flex-wrap gap-3">
          <button onClick={()=>scrollTo('products')}
            className="flex items-center gap-2 bg-deep text-cream px-7 py-3.5 rounded-xl text-sm font-dm font-medium hover:bg-wood hover:-translate-y-0.5 hover:shadow-warm-md transition-all active:scale-95 border-none cursor-pointer">
            Explore Collection <FiArrowRight size={15}/>
          </button>
          <button onClick={()=>dispatch(openQuoteModal())}
            className="flex items-center gap-2 bg-transparent text-bark border-2 border-bark px-7 py-3.5 rounded-xl text-sm font-dm font-medium hover:bg-bark hover:text-white hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer">
            Get Custom Quote
          </button>
        </motion.div>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:3.0}} className="flex flex-wrap gap-8 mt-10">
          {[['12K+','Happy Homes'],['500+','Custom Designs'],['18','Years in Indore']].map(([n,l])=>(
            <div key={l}>
              <div className="font-cormorant text-3xl font-semibold text-deep">{n}</div>
              <div className="text-muted text-xs mt-0.5">{l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{delay:2.6}}
        className="relative hidden lg:flex items-center justify-center" aria-hidden="true">
        <canvas ref={canvasRef} className="w-full max-w-[560px] h-[440px] cursor-grab active:cursor-grabbing"/>
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-muted text-[0.68rem] whitespace-nowrap">↺ Drag to rotate · Scroll to zoom</span>
      </motion.div>
    </section>
  );
}

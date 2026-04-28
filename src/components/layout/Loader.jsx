import React from 'react';
import { useSelector } from 'react-redux';
import { selectLoaderVisible } from '../../store/slices/uiSlice';

export default function Loader() {
  const visible = useSelector(selectLoaderVisible);
  return (
    <div className={`fixed inset-0 bg-deep flex flex-col items-center justify-center z-[9999] transition-opacity duration-700
                     ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="font-cormorant text-cream font-light tracking-widest text-4xl md:text-5xl animate-fade-up">
        True Furnitures
      </div>
      <div className="text-cream/40 text-xs tracking-[0.2em] mt-1.5" style={{animationDelay:'0.3s',animationFillMode:'both'}}>
        INDORE · EST. 2007
      </div>
      <div className="w-48 h-px bg-white/10 mt-8 relative overflow-hidden rounded-full">
        <div className="loader-bar-inner" />
      </div>
    </div>
  );
}

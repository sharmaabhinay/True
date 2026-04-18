import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectShowQuotePopup, setShowQuotePopup, openQuoteModal } from '../../store/slices/uiSlice';

export default function QuotePopup() {
  const dispatch = useDispatch();
  const show     = useSelector(selectShowQuotePopup);

  useEffect(() => {
    const t1 = setTimeout(() => dispatch(setShowQuotePopup(true)),  3000);
    const t2 = setTimeout(() => dispatch(setShowQuotePopup(false)), 10000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [dispatch]);

  return (
    <div className={`fixed bottom-6 right-6 z-[1000] transition-all duration-500
                     ${show ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'}`}>
      <div className="bg-deep text-cream rounded-2xl p-5 w-[260px] max-w-[calc(100vw-3rem)]
                      shadow-[0_16px_48px_rgba(44,31,18,0.4)] relative animate-slide-up">
        <button onClick={() => dispatch(setShowQuotePopup(false))} aria-label="Close"
                className="absolute top-2.5 right-3 text-white/30 hover:text-white/60 text-lg bg-transparent border-none cursor-pointer transition-colors leading-none">
          ×
        </button>
        <h4 className="font-cormorant text-xl font-semibold mb-1">Free Home Visit</h4>
        <p className="text-cream/65 text-xs mb-4 leading-relaxed">Our designer visits your home to plan the perfect furniture layout.</p>
        <button onClick={() => { dispatch(openQuoteModal()); dispatch(setShowQuotePopup(false)); }}
                className="w-full bg-gold text-deep text-sm font-medium py-2.5 rounded-lg hover:bg-[#d4b47a]
                           transition-colors active:scale-95 cursor-pointer border-none font-dm">
          Book Now →
        </button>
      </div>
    </div>
  );
}

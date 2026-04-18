import React from 'react';
import { useSelector } from 'react-redux';
import { selectToast } from '../../store/slices/uiSlice';

export default function Toast() {
  const { msg, visible } = useSelector(selectToast);

  return (
    <div role="status" aria-live="polite"
         className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[2000]
                     bg-deep text-cream px-6 py-3 rounded-full text-sm font-dm
                     shadow-warm-lg pointer-events-none max-w-[90vw] text-center
                     transition-all duration-400
                     ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
      {msg}
    </div>
  );
}

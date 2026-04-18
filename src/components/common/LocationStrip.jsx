import React from 'react';
import { useSelector } from 'react-redux';
import { selectLocStrip } from '../../store/slices/uiSlice';

export default function LocationStrip() {
  const { visible, city } = useSelector(selectLocStrip);
  if (!visible) return null;

  return (
    <div role="status"
         className="bg-bark text-cream text-[0.78rem] font-dm flex items-center justify-center
                    flex-wrap gap-x-3 gap-y-1 px-4 py-2.5 text-center">
      <span>📍 Delivering to <strong>{city}</strong></span>
      <span className="hidden sm:inline opacity-50">|</span>
      <span>Free delivery above ₹15,000</span>
      <span className="hidden sm:inline opacity-50">|</span>
      <span>📞 <a href="tel:7773896496" className="text-cream font-medium hover:underline">7773896496</a></span>
    </div>
  );
}

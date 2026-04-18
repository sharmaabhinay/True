import React from 'react';
import { useSelector } from 'react-redux';
import { selectAdminToast } from '../../store/slices/adminSlice';

export default function AdminToast() {
  const { msg, visible, type } = useSelector(selectAdminToast);
  const bg = type === 'error' ? 'bg-admin-red' : 'bg-admin-green';

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] ${bg} text-white text-sm font-dm
                     px-5 py-3 rounded-xl shadow-warm-lg max-w-[90vw]
                     transition-all duration-400
                     ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      {msg}
    </div>
  );
}

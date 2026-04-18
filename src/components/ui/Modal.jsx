import React, { useEffect } from 'react';

export default function Modal({ open, onClose, children, maxWidth = 'max-w-md' }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4"
         role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-deep/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 bg-ivory rounded-2xl p-6 w-full ${maxWidth} max-h-[90vh] overflow-y-auto
                       shadow-warm-lg transform transition-all duration-300`}>
        {children}
      </div>
    </div>
  );
}

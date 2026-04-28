import React from 'react';

const variants = {
  primary: 'bg-deep text-cream border-transparent hover:bg-wood hover:-translate-y-0.5 hover:shadow-warm-md active:scale-95',
  outline: 'bg-transparent text-bark border-bark hover:bg-bark hover:text-white hover:-translate-y-0.5 active:scale-95',
  ghost:   'bg-transparent text-muted border-transparent hover:text-deep active:scale-95',
  gold:    'bg-gold text-deep border-transparent hover:bg-[#d4b47a] active:scale-95',
  danger:  'bg-admin-red text-white border-transparent hover:opacity-85 active:scale-95',
};

const sizes = {
  sm:   'px-4 py-2 text-xs rounded-lg',
  md:   'px-6 py-3 text-sm rounded-xl',
  lg:   'px-8 py-4 text-base rounded-xl',
  full: 'w-full px-6 py-3 text-sm rounded-xl',
};

export default function Button({ variant='primary', size='md', className='', children, ...props }) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-dm font-medium
        border transition-all duration-200 cursor-pointer select-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

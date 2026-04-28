import React from 'react';

const typeMap = {
  bestseller: 'bg-bark text-white',
  new:        'bg-sage text-white',
  sale:       'bg-red-600 text-white',
  default:    'bg-bark text-white',
};

export default function Badge({ type = 'default', children, className = '' }) {
  return (
    <span className={`text-[0.65rem] px-2.5 py-0.5 rounded-full tracking-wide font-dm font-medium ${typeMap[type] || typeMap.default} ${className}`}>
      {children}
    </span>
  );
}

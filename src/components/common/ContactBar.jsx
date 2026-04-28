import React from 'react';

const items = [
  { icon:'📍', content: <span><strong>Vijay Nagar Square, Indore</strong> — MP 452010</span> },
  { icon:'📞', content: <a href="tel:7773896496" className="text-cream hover:underline"><strong>7773896496</strong></a> },
  { icon:'📧', content: <a href="mailto:info@truefurnitures.in" className="text-cream/80 hover:text-cream transition-colors">info@truefurnitures.in</a> },
  { icon:'🕐', content: <span>Mon–Sat: <strong>10 AM – 8 PM</strong></span> },
  { icon:'🚚', content: <span>Free delivery: <strong>Indore, Bhopal, Ujjain</strong></span> },
];

export default function ContactBar() {
  return (
    <address id="contact-bar"
             className="bg-deep text-cream font-dm not-italic px-6 md:px-12 py-4
                        flex flex-wrap items-center justify-center md:justify-between gap-x-6 gap-y-2">
      {items.map(({ icon, content }, i) => (
        <div key={i} className="flex items-center gap-2 text-[0.8rem]">
          <span>{icon}</span>
          <span>{content}</span>
        </div>
      ))}
    </address>
  );
}

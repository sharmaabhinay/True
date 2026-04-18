import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showToast } from '../../store/slices/uiSlice';
import { pushEvent } from '../../store/slices/visitorSlice';
import { useReveal } from '../../hooks/useReveal';

export default function Newsletter() {
  const dispatch  = useDispatch();
  const revealRef = useReveal();
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (!email || !email.includes('@')) { dispatch(showToast('Enter a valid email')); return; }
    dispatch(pushEvent({ type:'newsletter', email }));
    dispatch(showToast('🎉 Subscribed! Check inbox for 10% discount.'));
    setEmail('');
  };

  return (
    <section id="newsletter" ref={revealRef} className="reveal py-20 px-6 md:px-12 bg-bark text-cream text-center">
      <h2 className="font-cormorant font-light text-3xl md:text-4xl mb-2">Stay inspired</h2>
      <p className="text-cream/70 text-sm md:text-base mb-8">
        New collections, exclusive offers &amp; design tips for Indore homes.
      </p>
      <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={e => { e.preventDefault(); handleSubscribe(); }}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
               placeholder="Your email address" aria-label="Email address"
               autoComplete="email"
               className="flex-1 bg-white/15 border border-white/20 rounded-xl px-4 py-3
                          text-white placeholder-white/60 text-sm outline-none font-dm
                          focus:bg-white/20 transition-colors" />
        <button type="submit"
                className="bg-deep text-cream px-6 py-3 rounded-xl text-sm font-dm font-medium
                           hover:bg-wood transition-colors cursor-pointer border-none whitespace-nowrap">
          Subscribe
        </button>
      </form>
    </section>
  );
}

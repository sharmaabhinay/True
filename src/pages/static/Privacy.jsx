import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
export default function Privacy() {
  const S=[['Information We Collect','We collect your name, email, phone number, delivery address, and order history when you register or place an order. We also collect browsing data (pages visited, time on site) to improve your experience.'],['How We Use It','Your information is used solely to process orders, provide customer support, and send you order updates. We never sell your data to third parties.'],['Data Security','All sensitive data is stored locally on your device. We do not store payment card details. Our systems use industry-standard security practices.'],['Cookies','We use cookies to remember your cart and preferences. You can disable cookies in your browser settings, though some features may not work correctly.'],['Your Rights','You have the right to access, correct, or delete your personal data at any time. Contact us at info@truefurnitures.in to exercise these rights.'],['Contact','For privacy queries: True Furnitures, Vijay Nagar Square, Indore – 452010 | info@truefurnitures.in | 7773896496']];
  return (<><Navbar/><main className="pt-[68px] min-h-screen bg-ivory font-dm"><div className="max-w-3xl mx-auto px-6 md:px-12 py-16">
    <p className="text-bark text-[0.7rem] tracking-[0.15em] uppercase mb-2">Legal</p>
    <h1 className="font-cormorant font-light text-deep text-4xl md:text-5xl mb-2">Privacy Policy</h1>
    <p className="text-muted text-sm mb-8">Last updated: January 2025</p>
    {S.map(([t,b])=><div key={t} className="mb-6"><h2 className="font-cormorant text-xl text-deep mb-2">{t}</h2><p className="text-muted text-sm leading-relaxed">{b}</p></div>)}
  </div></main><Footer/></>);
}

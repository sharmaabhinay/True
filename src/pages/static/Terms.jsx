import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
export default function Terms() {
  const S=[['Orders & Payment','All orders require a minimum 10% advance payment before we begin crafting. Full payment is due on delivery unless otherwise agreed in writing.'],['Crafting & Lead Times','All furniture is custom-crafted to order. Lead times are 7–18 working days depending on the product. We will notify you of any delays.'],['Delivery','Free delivery is available in Indore, Bhopal, and Ujjain. White-glove assembly is included. We will contact you to arrange a delivery window.'],['Returns & Cancellations','Orders may be cancelled within 24 hours of placement for a full refund. After crafting has begun, cancellations are not possible. Defective items will be repaired or replaced at no cost.'],['Warranty','Structural warranties range from 3–10 years depending on the product. Fabric and upholstery are covered for 1 year. Warranty does not cover damage from misuse.'],['Governing Law','These terms are governed by the laws of Madhya Pradesh, India. Any disputes shall be subject to the jurisdiction of courts in Indore.']];
  return (<><Navbar/><main className="pt-[68px] min-h-screen bg-ivory font-dm"><div className="max-w-3xl mx-auto px-6 md:px-12 py-16">
    <p className="text-bark text-[0.7rem] tracking-[0.15em] uppercase mb-2">Legal</p>
    <h1 className="font-cormorant font-light text-deep text-4xl md:text-5xl mb-2">Terms &amp; Conditions</h1>
    <p className="text-muted text-sm mb-8">Last updated: January 2025</p>
    {S.map(([t,b])=><div key={t} className="mb-6"><h2 className="font-cormorant text-xl text-deep mb-2">{t}</h2><p className="text-muted text-sm leading-relaxed">{b}</p></div>)}
  </div></main><Footer/></>);
}

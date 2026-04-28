import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
export default function AboutUs() {
  return (<><Navbar/><main className="pt-[68px] min-h-screen bg-ivory font-dm">
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
      <p className="text-bark text-[0.7rem] tracking-[0.15em] uppercase mb-2">Our Story</p>
      <h1 className="font-cormorant font-light text-deep text-4xl md:text-5xl mb-8">About True Furnitures</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div><img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80" alt="Workshop" className="rounded-2xl w-full h-64 object-cover"/></div>
        <div className="flex flex-col justify-center">
          <h2 className="font-cormorant text-2xl text-deep mb-3">18 Years of Craft</h2>
          <p className="text-muted text-sm leading-relaxed">Founded in 2007 in Vijay Nagar, Indore, True Furnitures has been creating custom handcrafted furniture for homes across Madhya Pradesh. Every piece we build is a testament to the skill of our master artisans who have honed their craft over generations.</p>
        </div>
      </div>
      {[
        ['Our Mission','To bring the finest handcrafted furniture to every Indore home — built to order, built to last.'],
        ['Our Craftsmen','Our team of 40+ skilled artisans brings decades of woodworking heritage. Many are third-generation craftsmen who learned their trade from their fathers and grandfathers.'],
        ['Sustainability','We source only FSC-certified wood from responsibly managed forests. Every offcut is repurposed, and our finishing processes use natural, low-VOC oils and waxes.'],
        ['Our Promise','Every piece comes with a structural warranty. If anything fails within the warranty period, we fix or replace it — no questions asked.'],
      ].map(([t,b])=>(
        <div key={t} className="bg-cream rounded-2xl p-6 mb-4">
          <h3 className="font-cormorant text-xl text-deep mb-2">{t}</h3>
          <p className="text-muted text-sm leading-relaxed">{b}</p>
        </div>
      ))}
    </div>
  </main><Footer/></>);
}

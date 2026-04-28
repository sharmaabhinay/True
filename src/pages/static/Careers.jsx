import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
const JOBS=[{title:'Senior Craftsman',dept:'Workshop',type:'Full-time',loc:'Indore'},{title:'Interior Design Consultant',dept:'Sales',type:'Full-time',loc:'Indore'},{title:'3D Visualisation Artist',dept:'Design',type:'Full-time',loc:'Remote/Indore'},{title:'Delivery & Assembly Technician',dept:'Operations',type:'Full-time',loc:'Indore'}];
export default function Careers() {
  return (<><Navbar/><main className="pt-[68px] min-h-screen bg-ivory font-dm">
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
      <p className="text-bark text-[0.7rem] tracking-[0.15em] uppercase mb-2">Join Us</p>
      <h1 className="font-cormorant font-light text-deep text-4xl md:text-5xl mb-4">Careers at True Furnitures</h1>
      <p className="text-muted text-base mb-10 max-w-2xl">We're always looking for passionate craftsmen, designers and problem-solvers to join our Indore team. We offer competitive pay, a supportive work environment, and the chance to build something truly lasting.</p>
      <div className="space-y-4">
        {JOBS.map(j=>(
          <div key={j.title} className="bg-white border border-warm rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-bark transition-colors">
            <div>
              <h3 className="font-cormorant text-xl text-deep mb-1">{j.title}</h3>
              <div className="flex gap-2 flex-wrap">
                {[j.dept,j.type,j.loc].map(t=><span key={t} className="text-xs bg-cream text-muted px-2 py-0.5 rounded-full">{t}</span>)}
              </div>
            </div>
            <a href="mailto:careers@truefurnitures.in?subject=Application: {j.title}" className="bg-deep text-cream text-xs px-4 py-2 rounded-lg hover:bg-wood transition-colors whitespace-nowrap flex-shrink-0">Apply Now</a>
          </div>
        ))}
      </div>
      <div className="bg-cream rounded-2xl p-6 mt-8">
        <p className="text-deep text-sm font-medium mb-1">Don't see your role?</p>
        <p className="text-muted text-sm">Send your CV to <a href="mailto:careers@truefurnitures.in" className="text-bark hover:underline">careers@truefurnitures.in</a> and we'll keep it on file.</p>
      </div>
    </div>
  </main><Footer/></>);
}

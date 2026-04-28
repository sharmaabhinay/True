import React from 'react';
import { useReveal } from '../../hooks/useReveal';
import { useEMI } from '../../hooks/useEMI';
import { inr } from '../../utils/formatters';

function RangeRow({ label, value, display, min, max, step, onChange }) {
  return (
    <div className="mb-5">
      <label className="block text-muted text-[0.72rem] uppercase tracking-[0.08em] mb-1">{label}</label>
      <input type="range" min={min} max={max} step={step} value={value}
             onChange={e => onChange(+e.target.value)}
             className="w-full accent-bark mb-1 cursor-pointer" />
      <div className="font-cormorant text-bark font-semibold text-2xl" aria-live="polite">{display}</div>
    </div>
  );
}

export default function EMICalculator() {
  const revealRef = useReveal();
  const { principal, setPrincipal, months, setMonths, rate, setRate, result } = useEMI();

  return (
    <section id="emi-calc" ref={revealRef} className="reveal py-20 px-6 md:px-12 lg:px-16 bg-ivory">
      <div className="text-center mb-12">
        <p className="text-bark text-[0.7rem] tracking-[0.15em] uppercase mb-2">Easy Financing</p>
        <h2 className="font-cormorant font-light text-deep text-3xl md:text-4xl lg:text-5xl">
          Own it <em className="text-bark">today</em>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start max-w-5xl mx-auto">

        {/* Sliders */}
        <div>
          <RangeRow label="Loan Amount"       value={principal} display={inr(principal)}  min={5000}  max={500000} step={5000}  onChange={setPrincipal} />
          <RangeRow label="Tenure (Months)"   value={months}    display={`${months} months`} min={3} max={60}     step={3}     onChange={setMonths} />
          <RangeRow label="Interest Rate (%)" value={rate}      display={`${rate.toFixed(1)}%`} min={6} max={24} step={0.5}   onChange={setRate} />
          <p className="text-muted text-[0.76rem] leading-relaxed mt-4">
            Zero-cost EMI on select products. Call{' '}
            <a href="tel:7773896496" className="text-bark hover:underline">7773896496</a> for details.
          </p>
        </div>

        {/* Result card */}
        <div className="bg-deep text-cream rounded-2xl p-8" aria-live="polite">
          <h3 className="font-cormorant text-lg opacity-60 mb-3">Monthly Payment</h3>
          <div className="font-cormorant font-light text-gold text-5xl mb-1">{inr(result.monthly)}</div>
          <p className="text-cream/50 text-sm mb-8">per month for {months} months</p>
          <div className="grid grid-cols-2 gap-5">
            {[
              ['Principal',     inr(principal),      'text-cream'],
              ['Total Interest',inr(result.interest), 'text-cream'],
              ['Total Amount',  inr(result.total),    'text-cream'],
              ['You Save',      inr(result.saving),   'text-gold'],
            ].map(([k, v, cls]) => (
              <div key={k}>
                <div className={`font-cormorant text-xl font-semibold ${cls}`}>{v}</div>
                <div className="text-cream/45 text-[0.68rem] mt-0.5">{k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

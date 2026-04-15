import { useMemo, useState } from "react";
import { formatCurrency } from "../../utils/format";

function getEmi(principal, months, annualRate) {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}

export default function EmiCalculatorSection() {
  const [amount, setAmount] = useState(80000);
  const [months, setMonths] = useState(12);
  const [rate, setRate] = useState(10);

  const summary = useMemo(() => {
    const emi = getEmi(amount, months, rate);
    const total = emi * months;
    const interest = total - amount;
    return {
      emi: Math.round(emi),
      total: Math.round(total),
      interest: Math.round(interest),
      save: Math.round(Math.min(interest * 0.3, 5000)),
    };
  }, [amount, months, rate]);

  return (
    <section id="emi-calculator" className="section-shell alt-shell">
      <div className="section-head">
        <span>Easy Financing</span>
        <h2>Estimate a monthly payment before you buy</h2>
      </div>
      <div className="emi-layout">
        <div className="emi-form-card">
          <label>
            Loan Amount
            <input type="range" min="5000" max="500000" step="5000" value={amount} onChange={(e) => setAmount(+e.target.value)} />
            <strong>{formatCurrency(amount)}</strong>
          </label>
          <label>
            Tenure
            <input type="range" min="3" max="60" step="3" value={months} onChange={(e) => setMonths(+e.target.value)} />
            <strong>{months} months</strong>
          </label>
          <label>
            Interest Rate
            <input type="range" min="6" max="24" step="0.5" value={rate} onChange={(e) => setRate(+e.target.value)} />
            <strong>{rate}%</strong>
          </label>
        </div>
        <div className="emi-result-card">
          <span>Monthly payment</span>
          <h3>{formatCurrency(summary.emi)}</h3>
          <p>per month for {months} months</p>
          <div className="summary-grid">
            <div>
              <strong>{formatCurrency(amount)}</strong>
              <span>Principal</span>
            </div>
            <div>
              <strong>{formatCurrency(summary.interest)}</strong>
              <span>Interest</span>
            </div>
            <div>
              <strong>{formatCurrency(summary.total)}</strong>
              <span>Total amount</span>
            </div>
            <div>
              <strong>{formatCurrency(summary.save)}</strong>
              <span>Offer saving</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

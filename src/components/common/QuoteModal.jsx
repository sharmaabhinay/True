import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectQuoteModalOpen, closeQuoteModal, showToast, selectLocStrip } from '../../store/slices/uiSlice';
import { pushEvent } from '../../store/slices/visitorSlice';
import Modal from '../ui/Modal';

export default function QuoteModal() {
  const dispatch = useDispatch();
  const open     = useSelector(selectQuoteModalOpen);
  const { city } = useSelector(selectLocStrip);

  const [form, setForm] = useState({ name:'', phone:'', loc: city||'', cat:'', msg:'' });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim()) { toast('Please enter your name'); return; }
    dispatch(pushEvent({ type:'quote', ...form }));
    dispatch(showToast("✅ Quote sent! We'll call you within 24 hours."));
    dispatch(closeQuoteModal());
    setForm({ name:'', phone:'', loc:'', cat:'', msg:'' });
  };

  const inputCls = "w-full border border-warm rounded-xl px-4 py-3 text-sm text-deep bg-white outline-none focus:border-bark transition-colors font-dm placeholder:text-muted";

  return (
    <Modal open={open} onClose={() => dispatch(closeQuoteModal())}>
      <button onClick={() => dispatch(closeQuoteModal())}
              className="absolute top-4 right-4 text-muted hover:text-deep text-xl bg-transparent border-none cursor-pointer transition-colors">
        ×
      </button>

      <h3 className="font-cormorant text-3xl font-light text-deep mb-1">Get a Free Quote</h3>
      <p className="text-muted text-sm mb-5">Our Indore team will contact you within 24 hours.</p>

      <div className="flex flex-col gap-3">
        <input type="text"      placeholder="Full Name"                value={form.name}  onChange={e => set('name',  e.target.value)} className={inputCls} autoComplete="name" />
        <input type="tel"       placeholder="Phone Number"             value={form.phone} onChange={e => set('phone', e.target.value)} className={inputCls} autoComplete="tel" />
        <input type="text"      placeholder="Your Area / Locality"     value={form.loc}   onChange={e => set('loc',   e.target.value)} className={inputCls} />
        <select value={form.cat} onChange={e => set('cat', e.target.value)} className={inputCls}>
          <option value="">Select Category</option>
          <option>Sofa &amp; Seating</option>
          <option>Bedroom &amp; Almirahs</option>
          <option>Dining Sets</option>
          <option>Office Furniture</option>
          <option>Complete Home Setup</option>
        </select>
        <textarea placeholder="Describe your requirement…" value={form.msg} onChange={e => set('msg', e.target.value)}
                  rows={3} className={`${inputCls} resize-none`} />
        <button onClick={handleSubmit}
                className="w-full bg-deep text-cream py-3.5 rounded-xl text-sm font-medium hover:bg-wood
                           transition-colors active:scale-[0.98] cursor-pointer border-none font-dm mt-1">
          Send Request
        </button>
      </div>
    </Modal>
  );
}

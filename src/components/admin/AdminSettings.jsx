import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showAdminToast } from '../../store/slices/adminSlice';

const TOGGLES = [
  { id:'emi',      label:'EMI Calculator',   desc:'Show on homepage' },
  { id:'3d',       label:'3D Model Viewer',  desc:'Interactive models' },
  { id:'popup',    label:'Quote Popup',      desc:'Auto-show after 3s' },
  { id:'planner',  label:'Room Planner',     desc:'2D floor planner tool' },
  { id:'location', label:'Location Banner',  desc:'Auto-detect visitor city' },
];

function Toggle({ label, desc, defaultOn=true }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-admin-border last:border-0">
      <div>
        <div className="text-admin-text text-sm">{label}</div>
        <div className="text-admin-muted text-[0.68rem] mt-0.5">{desc}</div>
      </div>
      <button onClick={() => setOn(v => !v)}
              className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer border-none flex-shrink-0
                          ${on ? 'bg-admin-green' : 'bg-admin-border'}`}>
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all
                          ${on ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

export default function AdminSettings() {
  const dispatch = useDispatch();
  const [info, setInfo] = useState({
    name:'True Furnitures', phone:'7773896496',
    email:'info@truefurnitures.in', address:'Vijay Nagar Square, Indore – 452010', whatsapp:'7773896496',
  });

  const set = (k,v) => setInfo(i => ({ ...i, [k]:v }));
  const handleSave = () => dispatch(showAdminToast({ msg:'✅ Settings saved!' }));

  const inputCls = "w-full bg-admin-surface border border-admin-border rounded-lg px-3 py-2.5 text-sm text-admin-text outline-none focus:border-gold transition-colors font-dm placeholder:text-admin-muted";

  return (
    <div className="space-y-5">
      <h2 className="text-admin-text text-base font-semibold">Store Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Store info */}
        <div className="bg-admin-card border border-admin-border rounded-xl p-5 space-y-4">
          <h3 className="text-admin-text text-sm font-semibold mb-2">Store Information</h3>
          {[
            ['name',     'Store Name',  'text'],
            ['phone',    'Phone',       'tel'],
            ['email',    'Email',       'email'],
            ['address',  'Address',     'text'],
            ['whatsapp', 'WhatsApp',    'tel'],
          ].map(([k,label,type]) => (
            <div key={k}>
              <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">{label}</label>
              <input type={type} className={inputCls} value={info[k]} onChange={e=>set(k,e.target.value)} />
            </div>
          ))}
          <button onClick={handleSave}
                  className="w-full bg-gold text-deep py-2.5 rounded-lg text-sm font-semibold cursor-pointer border-none hover:opacity-85 font-dm mt-2">
            Save Changes
          </button>
        </div>

        {/* Feature toggles */}
        <div className="bg-admin-card border border-admin-border rounded-xl p-5">
          <h3 className="text-admin-text text-sm font-semibold mb-2">Feature Toggles</h3>
          {TOGGLES.map(t => <Toggle key={t.id} label={t.label} desc={t.desc} />)}
        </div>
      </div>
    </div>
  );
}

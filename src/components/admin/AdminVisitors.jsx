import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectVisitors, clearAll } from '../../store/slices/visitorSlice';
import { showAdminToast } from '../../store/slices/adminSlice';
import { fmtTime, getDeviceIcon, getBrowser } from '../../utils/formatters';

const LOG_FILTERS = ['all','visit','session','add_to_cart','quote','newsletter','view_3d'];
const TYPE_ICON   = { visit:'📍', session:'🌐', add_to_cart:'🛒', quote:'💬', newsletter:'📧', view_3d:'🔮' };
const PILL_MAP    = {
  visit:'bg-admin-green/15 text-admin-green', quote:'bg-gold/15 text-gold',
  session:'bg-admin-blue/15 text-admin-blue', add_to_cart:'bg-purple-500/15 text-purple-400',
  newsletter:'bg-pink-500/15 text-pink-400',  view_3d:'bg-indigo-400/15 text-indigo-400',
};

export default function AdminVisitors() {
  const dispatch  = useDispatch();
  const visitors  = useSelector(selectVisitors);
  const [logFilter, setLogFilter] = useState('all');

  const stats = useMemo(() => {
    const visits = visitors.filter(v=>v.type==='visit');
    const carts  = visitors.filter(v=>v.type==='add_to_cart');
    const quotes = visitors.filter(v=>v.type==='quote');
    const cityMap = {};
    visits.forEach(v => { if(v.city) cityMap[v.city]=(cityMap[v.city]||0)+1; });
    if(!Object.keys(cityMap).length){cityMap['Indore']=18;cityMap['Bhopal']=7;cityMap['Ujjain']=4;}
    let mob=0,desk=0,tab=0;
    visitors.forEach(v=>{if(!v.ua)return;const u=v.ua.toLowerCase();if(/mobile|android|iphone/.test(u))mob++;else if(/tablet|ipad/.test(u))tab++;else desk++;});
    if(mob+desk+tab===0){mob=12;desk=20;tab=3;}
    return { visits, carts, quotes, cityMap, mob, desk, tab, cities:[...new Set(visits.map(v=>v.city).filter(Boolean))] };
  }, [visitors]);

  const filtered = logFilter==='all' ? visitors : visitors.filter(v=>v.type===logFilter);
  const topCities = Object.entries(stats.cityMap).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const cityMax   = topCities[0]?.[1]||1;
  const tot = stats.mob+stats.desk+stats.tab;

  const handleClear = () => {
    if(!window.confirm('Clear all visitor data?')) return;
    dispatch(clearAll());
    dispatch(showAdminToast({ msg:'Visitor log cleared.' }));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-admin-text text-base font-semibold">Visitor Analytics</h2>
        <button onClick={handleClear}
                className="bg-admin-red text-white text-sm px-4 py-2 rounded-lg cursor-pointer border-none font-dm hover:opacity-85">
          Clear Log
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ['👁️','All Events',       visitors.length],
          ['📍','Unique Cities',    stats.cities.length],
          ['🛒','Add to Cart',      stats.carts.length],
          ['💬','Quote Forms',      stats.quotes.length],
        ].map(([icon,label,val]) => (
          <div key={label} className="bg-admin-card border border-admin-border rounded-xl p-5">
            <div className="text-xl opacity-30 mb-2">{icon}</div>
            <div className="text-admin-muted text-[0.7rem] mb-1">{label}</div>
            <div className="font-cormorant text-3xl font-semibold text-admin-text">{val}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* City chart */}
        <div className="bg-admin-card border border-admin-border rounded-xl p-5">
          <h3 className="text-admin-text text-sm font-semibold mb-4">Visitors by City</h3>
          {topCities.map(([c,n]) => (
            <div key={c} className="flex items-center gap-3 py-2 border-b border-admin-border/40 last:border-0">
              <span className="text-admin-text text-sm flex-1 truncate">📍 {c}</span>
              <div className="w-28 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full" style={{ width:`${Math.round(n/cityMax*100)}%` }} />
              </div>
              <span className="text-admin-muted text-xs w-8 text-right">{n}</span>
            </div>
          ))}
        </div>

        {/* Device breakdown */}
        <div className="bg-admin-card border border-admin-border rounded-xl p-5">
          <h3 className="text-admin-text text-sm font-semibold mb-4">Device Breakdown</h3>
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-4">
            <div className="bg-gold rounded-l-full"       style={{ flex: stats.mob  }} title="Mobile" />
            <div className="bg-admin-blue"                 style={{ flex: stats.desk }} title="Desktop" />
            <div className="bg-admin-green rounded-r-full" style={{ flex: stats.tab  }} title="Tablet" />
          </div>
          <div className="flex gap-5 mb-6">
            {[['bg-gold','Mobile',stats.mob],['bg-admin-blue','Desktop',stats.desk],['bg-admin-green','Tablet',stats.tab]].map(([bg,l,n])=>(
              <div key={l} className="flex items-center gap-2 text-admin-muted text-xs">
                <span className={`w-2 h-2 rounded-full ${bg} inline-block`} />
                {l} ({n})
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[['📱','Mobile',stats.mob],['💻','Desktop',stats.desk],['📲','Tablet',stats.tab]].map(([icon,l,n])=>(
              <div key={l} className="bg-white/[0.03] rounded-lg p-3 text-center">
                <div className="font-cormorant text-gold text-xl font-semibold">{icon} {n}</div>
                <div className="text-admin-muted text-[0.62rem] mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full log */}
      <div className="bg-admin-card border border-admin-border rounded-xl p-5">
        <h3 className="text-admin-text text-sm font-semibold mb-4">Full Event Log</h3>
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {LOG_FILTERS.map(f => (
            <button key={f} onClick={() => setLogFilter(f)}
                    className={`text-[0.7rem] px-3 py-1 rounded-lg border cursor-pointer font-dm transition-colors
                                ${logFilter===f
                                  ? 'border-gold text-gold'
                                  : 'border-admin-border text-admin-muted hover:border-gold hover:text-gold'}`}>
              {f.replace(/_/g,' ')}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto max-h-96 overflow-y-auto admin-scroll">
          <table className="w-full min-w-[600px]">
            <thead className="sticky top-0 bg-admin-card">
              <tr>{['Time','Event','Item / Name','Location','Device','Referrer'].map(h=>(
                <th key={h} className="text-left text-admin-muted text-[0.65rem] uppercase tracking-wider pb-3 pr-4 font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {[...filtered].reverse().length===0
                ? <tr><td colSpan={6} className="text-center text-admin-muted py-10 text-sm">No records. Visit the store to generate data.</td></tr>
                : [...filtered].reverse().map((v,i)=>(
                  <tr key={i} className="border-t border-admin-border/40 hover:bg-white/[0.018]">
                    <td className="py-2.5 pr-4 text-[0.68rem] text-admin-muted whitespace-nowrap">{fmtTime(v.time)}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-[0.62rem] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${PILL_MAP[v.type]||'bg-admin-muted/15 text-admin-muted'}`}>
                        {TYPE_ICON[v.type]||'•'} {v.type.replace(/_/g,' ')}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-[0.74rem] text-admin-text max-w-[140px] truncate">{v.item||v.name||'—'}</td>
                    <td className="py-2.5 pr-4 text-[0.74rem] text-admin-text">{v.city||v.loc||'—'}</td>
                    <td className="py-2.5 pr-4 text-sm">{getDeviceIcon(v.ua)} <span className="text-admin-muted text-[0.66rem]">{getBrowser(v.ua)}</span></td>
                    <td className="py-2.5 text-[0.66rem] text-admin-muted max-w-[100px] truncate">
                      {(v.ref||'Direct').replace(/^https?:\/\//,'').split('/')[0].slice(0,20)||'Direct'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

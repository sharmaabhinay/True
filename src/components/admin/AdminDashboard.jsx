import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectVisitors } from '../../store/slices/visitorSlice';
import { selectAllProducts } from '../../store/slices/productsSlice';
import { selectCustomers } from '../../store/slices/customerSlice';
import { fmtTime, getDeviceIcon } from '../../utils/formatters';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const BARS = [12,8,15,22,18,30,25];

const PILL_MAP = {
  visit:       'bg-admin-green/15 text-admin-green',
  quote:       'bg-gold/15 text-gold',
  session:     'bg-admin-blue/15 text-admin-blue',
  add_to_cart: 'bg-purple-500/15 text-purple-400',
  newsletter:  'bg-pink-500/15 text-pink-400',
  view_3d:     'bg-indigo-400/15 text-indigo-400',
  order:       'bg-gold/15 text-gold',
};
const TYPE_ICON = { visit:'📍', session:'🌐', add_to_cart:'🛒', quote:'💬', newsletter:'📧', view_3d:'🔮', order:'📦' };

function MetricCard({ icon, label, value, change }) {
  return (
    <div className="bg-admin-card border border-admin-border rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-admin-muted text-[0.7rem] mb-1.5">{label}</p>
          <p className="font-cormorant text-3xl font-semibold text-admin-text">{value}</p>
          <p className="text-admin-green text-[0.7rem] mt-1">{change}</p>
        </div>
        <span className="text-2xl opacity-30">{icon}</span>
      </div>
    </div>
  );
}

function VisitorRow({ city, n, max, colorClass='bg-gold' }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-admin-border/50 last:border-0">
      <span className="text-admin-text text-sm flex-1 truncate">📍 {city}</span>
      <div className="w-24 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${Math.round(n/max*100)}%` }} />
      </div>
      <span className="text-admin-muted text-[0.68rem] w-8 text-right">{n}</span>
    </div>
  );
}

export default function AdminDashboard() {
  const visitors = useSelector(selectVisitors);
  const products = useSelector(selectAllProducts);
  const customers = useSelector(selectCustomers);

  const stats = useMemo(() => {
    const visits  = visitors.filter(v => v.type === 'visit');
    const quotes  = visitors.filter(v => v.type === 'quote');
    const sessions = visitors.filter(v => v.type === 'session');
    const cityMap  = {};
    visits.forEach(v => { if (v.city) cityMap[v.city] = (cityMap[v.city]||0)+1; });
    if (!Object.keys(cityMap).length) { cityMap['Indore']=18; cityMap['Bhopal']=7; cityMap['Ujjain']=4; cityMap['Dewas']=2; }
    const refMap  = {};
    visitors.forEach(v => { const r=(v.ref||'Direct').replace(/^https?:\/\//,'').split('/')[0]||'Direct'; refMap[r]=(refMap[r]||0)+1; });
    if (!Object.keys(refMap).length) { refMap['Direct']=22; refMap['Google']=15; refMap['Facebook']=8; }
    return { visits, quotes, sessions, cityMap, refMap, total: visits.length + sessions.length };
  }, [visitors]);

  const topCities = Object.entries(stats.cityMap).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const topRefs   = Object.entries(stats.refMap).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const cityMax   = topCities[0]?.[1] || 1;
  const refMax    = topRefs[0]?.[1] || 1;
  const recent    = [...visitors].reverse().slice(0,8);
  const latest    = [...visitors].reverse().slice(0,20);
  const barsMax   = Math.max(...BARS);

  return (
    <div className="space-y-5">
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon="👥" label="Total Visitors"  value={stats.total||0}       change="↑ tracked live" />
        <MetricCard icon="💬" label="Quote Requests"  value={stats.quotes.length}  change="↑ from store form" />
        <MetricCard icon="🛋️" label="Active Products" value={products.filter(p=>p.active!==false).length} change="↑ manage below" />
        <MetricCard icon="👤" label="Customers" value={customers.length} change="↑ from signups" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-admin-card border border-admin-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-admin-text text-sm font-semibold">Visitor Activity</h3>
            <span className="text-admin-muted text-[0.68rem]">Last 7 days (sample)</span>
          </div>
          <div className="flex items-end gap-1.5 h-24">
            {BARS.map((v,i) => (
              <div key={i} className="flex-1 bg-gold/70 hover:bg-gold rounded-t-sm transition-colors"
                   style={{ height:`${Math.round(v/barsMax*100)}%` }} title={`${v} visitors`} />
            ))}
          </div>
          <div className="flex gap-1.5 mt-2">
            {DAYS.map(d => <div key={d} className="flex-1 text-center text-admin-muted text-[0.58rem]">{d}</div>)}
          </div>
        </div>

        {/* Top sources */}
        <div className="bg-admin-card border border-admin-border rounded-xl p-5">
          <h3 className="text-admin-text text-sm font-semibold mb-4">Top Traffic Sources</h3>
          {topRefs.map(([s,n]) => (
            <VisitorRow key={s} city={s} n={n} max={refMax} colorClass="bg-admin-blue" />
          ))}
        </div>
      </div>

      {/* Locations + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-admin-card border border-admin-border rounded-xl p-5">
          <h3 className="text-admin-text text-sm font-semibold mb-4">Top Locations</h3>
          {topCities.map(([c,n]) => <VisitorRow key={c} city={c} n={n} max={cityMax} />)}
        </div>
        <div className="bg-admin-card border border-admin-border rounded-xl p-5">
          <h3 className="text-admin-text text-sm font-semibold mb-4">Recent Activity</h3>
          {recent.length === 0
            ? <p className="text-admin-muted text-sm text-center py-6">No activity yet. Open the store first.</p>
            : recent.map((v,i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-admin-border/40 last:border-0">
                <span className="text-base">{TYPE_ICON[v.type]||'•'}</span>
                <span className="flex-1 text-admin-text text-[0.74rem] truncate">
                  {v.type.replace(/_/g,' ')}{v.item?` — ${v.item}`:v.city?` from ${v.city}`:''}
                </span>
                <span className="text-admin-muted text-[0.62rem] whitespace-nowrap">{fmtTime(v.time)}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Mini log */}
      <div className="bg-admin-card border border-admin-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-admin-text text-sm font-semibold">Latest Visitor Log</h3>
          <span className="text-admin-muted text-[0.68rem]">{visitors.length} total entries</span>
        </div>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr>{['Time','Event','Location','Device','Source'].map(h => (
                <th key={h} className="text-left text-admin-muted text-[0.65rem] uppercase tracking-wider pb-3 pr-4 font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {latest.length === 0
                ? <tr><td colSpan={5} className="text-center text-admin-muted py-8 text-sm">No visitors yet. Visit the store to start tracking.</td></tr>
                : latest.map((v,i) => (
                  <tr key={i} className="border-t border-admin-border/40 hover:bg-white/[0.018]">
                    <td className="py-2.5 pr-4 text-[0.7rem] text-admin-muted whitespace-nowrap">{fmtTime(v.time)}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-[0.62rem] font-medium px-2 py-0.5 rounded-full ${PILL_MAP[v.type]||'bg-admin-muted/20 text-admin-muted'}`}>
                        {v.type.replace(/_/g,' ')}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-[0.76rem] text-admin-text">{v.city||v.loc||'—'}</td>
                    <td className="py-2.5 pr-4 text-base">{getDeviceIcon(v.ua)}</td>
                    <td className="py-2.5 text-[0.68rem] text-admin-muted truncate max-w-[120px]">
                      {(v.ref||'Direct').replace(/^https?:\/\//,'').split('/')[0]||'Direct'}
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

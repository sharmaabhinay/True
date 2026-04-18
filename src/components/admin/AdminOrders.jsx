import React from 'react';
import { DEMO_ORDERS } from '../../data/constants';

const STATUS_CLS = {
  delivered:  'bg-admin-green/15 text-admin-green',
  processing: 'bg-gold/15 text-gold',
  shipped:    'bg-admin-blue/15 text-admin-blue',
  cancelled:  'bg-admin-red/15 text-admin-red',
};

export default function AdminOrders() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-admin-text text-base font-semibold">Orders</h2>
        <button className="bg-gold text-deep text-sm font-semibold px-5 py-2 rounded-lg cursor-pointer border-none hover:opacity-85 font-dm">
          Export
        </button>
      </div>

      <div className="bg-admin-card border border-admin-border rounded-xl p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr>{['#Order','Customer','Items','Amount','City','Date','Status'].map(h=>(
                <th key={h} className="text-left text-admin-muted text-[0.65rem] uppercase tracking-wider pb-4 pr-4 font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {DEMO_ORDERS.map(o => (
                <tr key={o.id} className="border-t border-admin-border/40 hover:bg-white/[0.018]">
                  <td className="py-3 pr-4 text-sm font-medium text-admin-text">{o.id}</td>
                  <td className="py-3 pr-4 text-sm text-admin-text">{o.customer}</td>
                  <td className="py-3 pr-4 text-[0.72rem] text-admin-muted max-w-[160px] truncate">{o.items}</td>
                  <td className="py-3 pr-4 text-gold font-medium text-sm">₹{o.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3 pr-4 text-sm text-admin-text">{o.city}</td>
                  <td className="py-3 pr-4 text-[0.7rem] text-admin-muted">{o.date}</td>
                  <td className="py-3">
                    <span className={`text-[0.62rem] font-medium px-2.5 py-1 rounded-full ${STATUS_CLS[o.status]}`}>
                      {o.status}
                    </span>
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

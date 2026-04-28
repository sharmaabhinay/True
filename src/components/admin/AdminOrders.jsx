import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllOrders, updateOrderStatus } from '../../store/slices/orderSlice';
import { showAdminToast } from '../../store/slices/adminSlice';
import { DEMO_ORDERS } from '../../data/constants';
import { inr, fmtTime } from '../../utils/formatters';

const STATUS_OPTIONS = ['placed','accepted','making','completed','ready','shipped','arrived','delivered','cancelled'];
const STATUS_CLS = {
  delivered:'bg-admin-green/15 text-admin-green', processing:'bg-gold/15 text-gold',
  shipped:'bg-admin-blue/15 text-admin-blue',     cancelled:'bg-admin-red/15 text-admin-red',
  placed:'bg-gold/15 text-gold',                  making:'bg-purple-500/15 text-purple-400',
  accepted:'bg-admin-blue/15 text-admin-blue',    completed:'bg-admin-green/15 text-admin-green',
  ready:'bg-admin-green/15 text-admin-green',     arrived:'bg-admin-blue/15 text-admin-blue',
};

export default function AdminOrders() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const liveOrders = useSelector(selectAllOrders);
  // Combine live orders + demo orders for display
  const demoAsOrders = DEMO_ORDERS.map(o => ({ ...o, userId:'demo', items:[{name:o.items,qty:1,price:o.amount}], createdAt:o.date, timeline:[] }));
  const allDisplay  = [...liveOrders, ...demoAsOrders];

  const handleStatusChange = (e, orderId) => {
    e.stopPropagation();
    dispatch(updateOrderStatus({ orderId, status: e.target.value }));
    dispatch(showAdminToast({ msg:`Status updated to: ${e.target.value}` }));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-admin-text text-base font-semibold">Orders</h2>
        <button className="bg-gold text-deep text-sm font-semibold px-5 py-2 rounded-lg cursor-pointer border-none hover:opacity-85 font-dm">Export</button>
      </div>
      <div className="bg-admin-card border border-admin-border rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead className="bg-admin-surface">
              <tr>{['#Order','Customer','Items','Amount','City','Date','Type','Status',''].map(h=>(
                <th key={h} className="text-left text-admin-muted text-[0.65rem] uppercase tracking-wider px-4 py-3 font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {allDisplay.map(o=>(
                <tr key={o.id} onClick={()=>{ if(o.userId!=='demo') navigate(`/admin/orders/${o.id}`); }}
                    className={`border-t border-admin-border/40 transition-colors ${o.userId!=='demo'?'hover:bg-white/[0.018] cursor-pointer':''}`}>
                  <td className="px-4 py-3 text-sm font-medium text-admin-text">{o.id}</td>
                  <td className="px-4 py-3 text-sm text-admin-text">{o.customer||o.userName||'—'}</td>
                  <td className="px-4 py-3 text-[0.72rem] text-admin-muted max-w-[140px] truncate">{typeof o.items==='string'?o.items:o.items?.map(i=>i.name).join(', ')}</td>
                  <td className="px-4 py-3 text-gold font-medium text-sm">{inr(o.total||o.amount)}</td>
                  <td className="px-4 py-3 text-sm text-admin-text">{o.city||o.address?.city||'—'}</td>
                  <td className="px-4 py-3 text-[0.7rem] text-admin-muted">{fmtTime(o.createdAt||o.date)}</td>
                  <td className="px-4 py-3">
                    <span className="text-[0.62rem] px-2 py-1 rounded-full bg-admin-blue/15 text-admin-blue capitalize">{(o.orderType||'cod').replace('_',' ')}</span>
                  </td>
                  <td className="px-4 py-3" onClick={e=>e.stopPropagation()}>
                    {o.userId !== 'demo' ? (
                      <select value={o.status} onChange={e=>handleStatusChange(e,o.id)}
                              className="bg-admin-surface border border-admin-border rounded-lg px-2 py-1.5 text-[0.7rem] text-admin-text outline-none focus:border-gold cursor-pointer font-dm capitalize">
                        {STATUS_OPTIONS.map(s=><option key={s} value={s} className="capitalize">{s}</option>)}
                      </select>
                    ) : (
                      <span className={`text-[0.62rem] font-medium px-2.5 py-1 rounded-full ${STATUS_CLS[o.status]||'bg-admin-muted/15 text-admin-muted'}`}>{o.status}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-admin-muted text-xs">{o.userId!=='demo'?'›':''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

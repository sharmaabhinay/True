import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiTool, FiBox, FiMapPin, FiHome } from 'react-icons/fi';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { selectAllOrders } from '../../store/slices/orderSlice';
import { selectUser } from '../../store/slices/authSlice';
import { inr } from '../../utils/formatters';

const TIMELINE_ICONS = { placed:<FiPackage/>, accepted:<FiCheckCircle/>, making:<FiTool/>, completed:<FiBox/>, ready:<FiBox/>, shipped:<FiTruck/>, arrived:<FiMapPin/>, delivered:<FiHome/>, cancelled:<FiCheckCircle/> };
const ALL_STEPS=['placed','accepted','making','completed','ready','shipped','arrived','delivered'];
const STEP_LABELS={placed:'Order Placed',accepted:'Order Accepted',making:'Crafting Started',completed:'Crafting Done',ready:'Ready to Ship',shipped:'Shipped',arrived:'Out for Delivery',delivered:'Delivered'};

export default function TrackOrder() {
  const [query,setQuery]=useState('');
  const [found,setFound]=useState(null);
  const [notFound,setNotFound]=useState(false);
  const allOrders=useSelector(selectAllOrders);
  const user=useSelector(selectUser);
  const myOrders=user ? allOrders.filter(o=>o.userId===user.id) : [];

  const handleSearch=()=>{
    const o=allOrders.find(o=>o.id.toLowerCase()===query.trim().toLowerCase());
    if(o){setFound(o);setNotFound(false);}else{setFound(null);setNotFound(true);}
  };

  const activeIdx=found ? ALL_STEPS.indexOf(found.status) : -1;

  return(<><Navbar/><main className="pt-[68px] min-h-screen bg-ivory font-dm">
    <div className="max-w-3xl mx-auto px-6 md:px-12 py-16">
      <p className="text-bark text-[0.7rem] tracking-[0.15em] uppercase mb-2">Support</p>
      <h1 className="font-cormorant font-light text-deep text-4xl mb-8">Track Your Order</h1>

      <div className="flex gap-3 mb-8">
        <div className="flex-1 relative">
          <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/>
          <input type="text" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearch()}
                 placeholder="Enter your Order ID (e.g. TF-1234567890)" className="w-full border border-warm rounded-xl pl-9 pr-4 py-3 text-sm text-deep bg-white outline-none focus:border-bark transition-colors font-dm placeholder:text-muted"/>
        </div>
        <button onClick={handleSearch} className="bg-deep text-cream px-5 py-3 rounded-xl text-sm font-dm hover:bg-wood transition-colors border-none cursor-pointer">Track</button>
      </div>

      {notFound && <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl mb-6">Order not found. Please check your Order ID.</div>}

      {found && (
        <div className="bg-white rounded-2xl border border-warm p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div><p className="font-cormorant text-2xl text-deep">{found.id}</p><p className="text-muted text-xs">{new Date(found.createdAt).toLocaleDateString('en-IN',{dateStyle:'long'})}</p></div>
            <span className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize ${found.status==='delivered'?'bg-sage/15 text-sage':found.status==='cancelled'?'bg-red-100 text-red-600':'bg-gold/15 text-bark'}`}>{found.status}</span>
          </div>
          {/* Timeline */}
          <div className="space-y-4">
            {ALL_STEPS.map((s,i)=>{
              const done=i<=activeIdx; const current=i===activeIdx;
              const logged=found.timeline?.find(t=>t.status===s);
              return(<div key={s} className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm border-2 transition-all ${current?'bg-bark border-bark text-white':done?'bg-sage border-sage text-white':'bg-white border-warm text-muted'}`}>{TIMELINE_ICONS[s]||i+1}</div>
                <div className="flex-1 pb-4 border-b border-warm last:border-0">
                  <p className={`text-sm font-medium ${done?'text-deep':'text-muted'}`}>{STEP_LABELS[s]}</p>
                  {logged && <p className="text-muted text-xs mt-0.5">{new Date(logged.time).toLocaleString('en-IN',{dateStyle:'short',timeStyle:'short'})}</p>}
                  {!logged && !done && <p className="text-muted text-xs mt-0.5">Pending</p>}
                </div>
              </div>);
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-warm flex justify-between text-sm">
            <span className="text-muted">Total</span><span className="font-cormorant font-semibold text-bark text-lg">{inr(found.total)}</span>
          </div>
        </div>
      )}

      {myOrders.length > 0 && (
        <div>
          <h2 className="font-cormorant text-xl text-deep mb-4">My Recent Orders</h2>
          <div className="space-y-3">
            {myOrders.slice(-5).reverse().map(o=>(
              <button key={o.id} onClick={()=>{setFound(o);setNotFound(false);setQuery(o.id);}}
                      className="w-full text-left bg-white border border-warm rounded-xl p-4 hover:border-bark transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium text-deep">{o.id}</p><p className="text-muted text-xs">{o.items?.length} item(s) · {inr(o.total)}</p></div>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${o.status==='delivered'?'bg-sage/15 text-sage':'bg-gold/15 text-bark'}`}>{o.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  </main><Footer/></>);
}

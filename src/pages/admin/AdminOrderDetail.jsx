import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiPackage, FiCheckCircle, FiTool, FiBox, FiTruck, FiMapPin, FiHome, FiUser, FiPhone, FiMail } from 'react-icons/fi';
import { selectOrderById, updateOrderStatus, ORDER_TIMELINE } from '../../store/slices/orderSlice';
import { showAdminToast } from '../../store/slices/adminSlice';
import { inr, fmtTime } from '../../utils/formatters';

const ICONS = { placed:<FiPackage/>, accepted:<FiCheckCircle/>, making:<FiTool/>, completed:<FiBox/>, ready:<FiBox/>, shipped:<FiTruck/>, arrived:<FiMapPin/>, delivered:<FiHome/>, cancelled:<FiCheckCircle/> };
const STATUS_OPTIONS = ['placed','accepted','making','completed','ready','shipped','arrived','delivered','cancelled'];

export default function AdminOrderDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const order    = useSelector(selectOrderById(id));

  if (!order) {
    return (
      <div className="min-h-screen bg-admin-bg flex items-center justify-center text-admin-muted">
        <div className="text-center">
          <p className="text-4xl mb-3">📦</p>
          <p>Order not found</p>
          <button onClick={() => navigate('/admin')} className="mt-4 text-gold text-sm underline bg-transparent border-none cursor-pointer">← Back to Admin</button>
        </div>
      </div>
    );
  }

  const activeIdx = ORDER_TIMELINE.findIndex(t => t.status === order.status);

  const handleStatusChange = (newStatus) => {
    dispatch(updateOrderStatus({ orderId: order.id, status: newStatus }));
    dispatch(showAdminToast({ msg: `Order status updated to: ${newStatus}` }));
  };

  return (
    <div className="min-h-screen bg-admin-bg font-dm text-admin-text p-6">
      <button onClick={() => navigate('/admin')}
              className="flex items-center gap-2 text-admin-muted hover:text-gold transition-colors bg-transparent border-none cursor-pointer mb-6 text-sm">
        <FiArrowLeft size={16}/> Back to Admin
      </button>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-admin-card border border-admin-border rounded-2xl p-6 mb-5">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-admin-text text-xl font-semibold">{order.id}</h1>
              <p className="text-admin-muted text-sm">{fmtTime(order.createdAt)}</p>
              <div className="flex gap-3 mt-2 flex-wrap">
                <span className="text-xs bg-admin-blue/15 text-admin-blue px-2.5 py-1 rounded-full capitalize">{(order.orderType||'').replace('_',' ')}</span>
                <span className="text-xs text-admin-muted">Deposit: {inr(order.deposit || 0)}</span>
                <span className="text-xs text-admin-muted">Remaining: {inr(order.remaining || 0)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-admin-muted text-xs">Status:</span>
              <select
                value={order.status}
                onChange={e => handleStatusChange(e.target.value)}
                className="bg-admin-surface border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text outline-none focus:border-gold font-dm cursor-pointer"
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Order Items */}
          <div className="bg-admin-card border border-admin-border rounded-2xl p-5">
            <h3 className="text-admin-text text-sm font-semibold mb-4">Ordered Items</h3>
            <div className="space-y-3">
              {(order.items || []).map((item, i) => (
                <button key={i}
                        onClick={() => window.open(`/product/${item.id}`, '_blank')}
                        className="w-full text-left flex items-center gap-3 p-3 bg-admin-surface rounded-xl hover:border-gold border border-admin-border transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-admin-bg overflow-hidden flex-shrink-0">
                    {item.img && <img src={item.img} alt={item.name} className="w-full h-full object-cover" onError={e=>e.target.style.display='none'}/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-admin-text text-sm truncate">{item.name}</p>
                    <p className="text-admin-muted text-xs">Qty: {item.qty} · {inr(item.price)}</p>
                  </div>
                  <p className="text-gold text-sm font-medium">{inr(item.price * item.qty)}</p>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-admin-border flex justify-between">
              <span className="text-admin-muted text-sm">Total</span>
              <span className="text-gold font-cormorant text-xl font-semibold">{inr(order.total)}</span>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-admin-card border border-admin-border rounded-2xl p-5">
            <h3 className="text-admin-text text-sm font-semibold mb-4">Customer</h3>
            {[
              [<FiUser size={14}/>,  'Name',    order.userName || order.address?.fullName],
              [<FiPhone size={14}/>, 'Phone',   order.userPhone || order.address?.phone],
              [<FiMail size={14}/>,  'Email',   order.userEmail || order.address?.email],
              [<FiMapPin size={14}/>,'Address', order.address ? `${order.address.line1}${order.address.line2?', '+order.address.line2:''}, ${order.address.city} – ${order.address.pincode}` : '—'],
            ].map(([icon,l,v]) => (
              <div key={l} className="flex items-start gap-3 py-3 border-b border-admin-border/50 last:border-0">
                <span className="text-admin-muted mt-0.5">{icon}</span>
                <div>
                  <p className="text-admin-muted text-[0.65rem] uppercase tracking-wider">{l}</p>
                  <p className="text-admin-text text-sm mt-0.5">{v || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-admin-card border border-admin-border rounded-2xl p-5 mt-5">
          <h3 className="text-admin-text text-sm font-semibold mb-5">Order Timeline</h3>
          <div className="space-y-0">
            {ORDER_TIMELINE.map((step, i) => {
              const done    = i <= activeIdx;
              const current = i === activeIdx;
              const logged  = order.timeline?.find(t => t.status === step.status);
              return (
                <div key={step.status} className="flex items-start gap-4">
                  {/* Icon + Line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 text-sm transition-all
                                     ${current ? 'bg-gold border-gold text-deep' : done ? 'bg-admin-green border-admin-green text-white' : 'bg-admin-card border-admin-border text-admin-muted'}`}>
                      {ICONS[step.status]}
                    </div>
                    {i < ORDER_TIMELINE.length - 1 && (
                      <div className={`w-0.5 h-8 mt-1 ${done && i < activeIdx ? 'bg-admin-green' : 'bg-admin-border'}`} />
                    )}
                  </div>
                  {/* Content */}
                  <div className={`pb-6 flex-1 ${i === ORDER_TIMELINE.length - 1 ? 'pb-0' : ''}`}>
                    <p className={`text-sm font-medium ${done ? 'text-admin-text' : 'text-admin-muted'}`}>{step.label}</p>
                    {logged ? (
                      <p className="text-admin-muted text-xs mt-0.5">{fmtTime(logged.time)}{logged.note ? ` — ${logged.note}` : ''}</p>
                    ) : (
                      <p className="text-admin-muted/50 text-xs mt-0.5">Pending</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin, FiShoppingBag, FiHeart, FiClock, FiMonitor } from 'react-icons/fi';
import { getUsers } from '../../store/slices/authSlice';
import { selectAllOrders } from '../../store/slices/orderSlice';
import { fmtTime, getDeviceIcon, getBrowser } from '../../utils/formatters';
import { inr } from '../../utils/formatters';

export default function AdminCustomerDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const allOrders = useSelector(selectAllOrders);
  const users     = getUsers();
  const customer  = users.find(u => String(u.id) === String(id));

  if (!customer) {
    return (
      <div className="min-h-screen bg-admin-bg flex items-center justify-center text-admin-muted">
        <div className="text-center">
          <p className="text-4xl mb-3">👤</p>
          <p>Customer not found</p>
          <button onClick={() => navigate('/admin')} className="mt-4 text-gold text-sm underline bg-transparent border-none cursor-pointer">← Back to Admin</button>
        </div>
      </div>
    );
  }

  const orders    = allOrders.filter(o => o.userId === customer.id);
  const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);

  const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 py-3 border-b border-admin-border last:border-0">
      <span className="text-admin-muted mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-admin-muted text-[0.68rem] uppercase tracking-wider">{label}</p>
        <p className="text-admin-text text-sm mt-0.5">{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-admin-bg font-dm text-admin-text p-6">
      <button onClick={() => navigate('/admin')}
              className="flex items-center gap-2 text-admin-muted hover:text-gold transition-colors bg-transparent border-none cursor-pointer mb-6 text-sm">
        <FiArrowLeft size={16}/> Back to Admin
      </button>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-admin-card border border-admin-border rounded-2xl p-6 mb-5 flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-deep text-xl font-semibold flex-shrink-0">
            {customer.avatar || customer.name?.slice(0,2).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-admin-text text-xl font-semibold">{customer.name}</h1>
            <p className="text-admin-muted text-sm">{customer.email}</p>
            <div className="flex gap-4 mt-2 flex-wrap">
              <span className="text-xs bg-admin-green/15 text-admin-green px-2.5 py-1 rounded-full">Active Customer</span>
              <span className="text-xs text-admin-muted">Joined: {fmtTime(customer.createdAt)}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gold font-cormorant text-2xl font-semibold">{inr(totalSpent)}</p>
            <p className="text-admin-muted text-xs">Total Spent</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Personal Info */}
          <div className="bg-admin-card border border-admin-border rounded-2xl p-5">
            <h3 className="text-admin-text text-sm font-semibold mb-3">Personal Information</h3>
            <InfoRow icon={<FiUser size={14}/>}    label="Full Name"    value={customer.name} />
            <InfoRow icon={<FiMail size={14}/>}    label="Email"        value={customer.email} />
            <InfoRow icon={<FiPhone size={14}/>}   label="Phone"        value={customer.phone} />
            <InfoRow icon={<FiClock size={14}/>}   label="Last Login"   value={fmtTime(customer.lastLogin)} />
          </div>

          {/* Address */}
          <div className="bg-admin-card border border-admin-border rounded-2xl p-5">
            <h3 className="text-admin-text text-sm font-semibold mb-3">Delivery Address</h3>
            {customer.address ? (
              <>
                <InfoRow icon={<FiMapPin size={14}/>} label="Street"  value={`${customer.address.line1}${customer.address.line2 ? `, ${customer.address.line2}` : ''}`} />
                <InfoRow icon={<FiMapPin size={14}/>} label="City"    value={`${customer.address.city}, ${customer.address.state}`} />
                <InfoRow icon={<FiMapPin size={14}/>} label="Pincode" value={customer.address.pincode} />
              </>
            ) : (
              <p className="text-admin-muted text-sm py-4 text-center">No address saved</p>
            )}
          </div>

          {/* Activity Stats */}
          <div className="bg-admin-card border border-admin-border rounded-2xl p-5">
            <h3 className="text-admin-text text-sm font-semibold mb-3">Activity</h3>
            {[
              ['Total Orders',   orders.length],
              ['Total Spent',    inr(totalSpent)],
              ['Wishlist Items', customer.wishlist?.length || 0],
              ['Sessions',       customer.sessions?.length || 1],
            ].map(([l,v]) => (
              <div key={l} className="flex justify-between py-2.5 border-b border-admin-border/50 last:border-0 text-sm">
                <span className="text-admin-muted">{l}</span>
                <span className="text-admin-text font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Session History */}
        {customer.sessions?.length > 0 && (
          <div className="bg-admin-card border border-admin-border rounded-2xl p-5 mt-5">
            <h3 className="text-admin-text text-sm font-semibold mb-4 flex items-center gap-2">
              <FiMonitor size={15}/> Session History ({customer.sessions.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr>{['Time','Device','Browser'].map(h=><th key={h} className="text-left text-admin-muted text-[0.65rem] uppercase tracking-wider pb-3 pr-4 font-medium">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {[...customer.sessions].reverse().slice(0,10).map((s,i)=>(
                    <tr key={i} className="border-t border-admin-border/40">
                      <td className="py-2.5 pr-4 text-[0.72rem] text-admin-muted">{fmtTime(s.time)}</td>
                      <td className="py-2.5 pr-4 text-sm">{getDeviceIcon(s.ua)}</td>
                      <td className="py-2.5 text-[0.72rem] text-admin-muted">{getBrowser(s.ua)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders */}
        <div className="bg-admin-card border border-admin-border rounded-2xl p-5 mt-5">
          <h3 className="text-admin-text text-sm font-semibold mb-4 flex items-center gap-2">
            <FiShoppingBag size={15}/> Orders ({orders.length})
          </h3>
          {orders.length === 0 ? (
            <p className="text-admin-muted text-sm text-center py-6">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map(o => (
                <button key={o.id} onClick={() => navigate(`/admin/orders/${o.id}`)}
                        className="w-full text-left bg-admin-surface border border-admin-border rounded-xl p-4 hover:border-gold transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-admin-text text-sm font-medium">{o.id}</p>
                      <p className="text-admin-muted text-xs">{o.items?.length} item(s) · {fmtTime(o.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gold text-sm font-medium">{inr(o.total)}</p>
                      <span className="text-[0.62rem] capitalize text-admin-muted">{o.status}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

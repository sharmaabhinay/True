import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAdminAuth, selectActivePanel, login, showAdminToast } from '../store/slices/adminSlice';

import AdminSidebar   from '../components/admin/AdminSidebar';
import AdminTopbar    from '../components/admin/AdminTopbar';
import AdminToast     from '../components/admin/AdminToast';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminVisitors  from '../components/admin/AdminVisitors';
import AdminProducts  from '../components/admin/AdminProducts';
import AdminQuotes    from '../components/admin/AdminQuotes';
import AdminOrders    from '../components/admin/AdminOrders';
import AdminSettings  from '../components/admin/AdminSettings';
import AdminCustomers from '../components/admin/AdminCustomers';

const ADMIN_USER = import.meta.env.REACT_APP_ADMIN_USER || 'admin';
const ADMIN_PASS = import.meta.env.REACT_APP_ADMIN_PASS || 'admin123';

function LoginScreen() {
  const dispatch = useDispatch();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err,  setErr]  = useState(false);

  const handleLogin = () => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      dispatch(login());
    } else {
      setErr(true);
      setTimeout(() => setErr(false), 2500);
    }
  };

  const inputCls = "w-full bg-admin-surface border border-admin-border rounded-lg px-4 py-3 text-sm text-admin-text outline-none font-dm placeholder:text-admin-muted focus:border-gold transition-colors";

  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center p-4">
      <div className="bg-admin-card border border-admin-border rounded-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <h2 className="font-cormorant text-3xl text-gold font-semibold">TrueFurnitures</h2>
          <p className="text-admin-muted text-xs mt-1">Admin Panel · Indore</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Username</label>
            <input type="text" value={user} onChange={e=>setUser(e.target.value)}
                   placeholder="admin" autoComplete="username" className={inputCls}
                   onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
          </div>
          <div>
            <label className="text-admin-muted text-[0.68rem] uppercase tracking-wider block mb-1.5">Password</label>
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)}
                   placeholder="admin123" autoComplete="current-password" className={inputCls}
                   onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
          </div>
          {err && <p className="text-admin-red text-xs text-center">Invalid credentials. Try admin / admin123</p>}
          <button onClick={handleLogin}
                  className="w-full bg-gold text-deep py-3 rounded-lg text-sm font-semibold cursor-pointer border-none hover:opacity-85 transition-opacity font-dm mt-2">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

const PANELS = {
  dashboard: AdminDashboard,
  visitors:  AdminVisitors,
  products:  AdminProducts,
  quotes:    AdminQuotes,
  orders:    AdminOrders,
  customers: AdminCustomers,
  settings:  AdminSettings,
};

export default function AdminPage() {
  const auth  = useSelector(selectAdminAuth);
  const panel = useSelector(selectActivePanel);

  if (!auth) return <LoginScreen />;

  const ActivePanel = PANELS[panel] || AdminDashboard;

  return (
    <div className="min-h-screen bg-admin-bg font-dm flex">
      <AdminToast />
      <AdminSidebar />

      {/* Main — offset by sidebar width on lg */}
      <div className="flex-1 flex flex-col lg:ml-[240px] min-w-0">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto admin-scroll p-5 md:p-6">
          <ActivePanel />
        </main>
      </div>
    </div>
  );
}

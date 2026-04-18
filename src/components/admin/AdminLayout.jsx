import React from 'react';
import { useSelector } from 'react-redux';
import AdminToast from './AdminToast';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import { selectAdminAuth } from '../../store/slices/adminSlice';

export default function AdminLayout({ children, title, fallback }) {
  const auth = useSelector(selectAdminAuth);

  if (!auth) return fallback || null;

  return (
    <div className="min-h-screen bg-admin-bg font-dm flex">
      <AdminToast />
      <AdminSidebar />
      <div className="flex-1 flex flex-col lg:ml-[240px] min-w-0">
        <AdminTopbar title={title} />
        <main className="flex-1 overflow-y-auto admin-scroll p-5 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiMail, FiPhone, FiChevronRight } from 'react-icons/fi';
import { getUsers } from '../../store/slices/authSlice';
import { fmtTime } from '../../utils/formatters';

export default function AdminCustomers() {
  const navigate  = useNavigate();
  const [search, setSearch] = useState('');
  const users  = getUsers();
  const filtered = users.filter(u =>
    !search ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-admin-text text-base font-semibold">Customer List</h2>
        <span className="text-admin-muted text-sm">{users.length} registered customer{users.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or phone…"
          className="w-full bg-admin-surface border border-admin-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-admin-text outline-none focus:border-gold font-dm placeholder:text-admin-muted"
        />
      </div>

      {/* Table */}
      <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-admin-muted">
            <FiUser size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">{users.length === 0 ? 'No customers yet. Customers appear here after they sign up.' : 'No customers match your search.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-admin-surface">
                <tr>
                  {['Customer','Email','Phone','Joined','Last Login','Orders',''].map(h => (
                    <th key={h} className="text-left text-admin-muted text-[0.65rem] uppercase tracking-wider px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}
                      onClick={() => navigate(`/admin/customers/${u.id}`)}
                      className="border-t border-admin-border/40 hover:bg-white/[0.02] cursor-pointer transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-deep text-xs font-semibold flex-shrink-0">
                          {u.avatar || u.name?.slice(0,2).toUpperCase() || '?'}
                        </div>
                        <span className="text-admin-text text-sm font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-admin-muted text-sm">
                        <FiMail size={12}/> {u.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-admin-muted text-sm">
                        <FiPhone size={12}/> {u.phone || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-admin-muted text-[0.72rem]">{fmtTime(u.createdAt)}</td>
                    <td className="px-4 py-3 text-admin-muted text-[0.72rem]">{fmtTime(u.lastLogin)}</td>
                    <td className="px-4 py-3 text-admin-text text-sm">{u.orders?.length || 0}</td>
                    <td className="px-4 py-3 text-admin-muted">
                      <FiChevronRight size={14} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

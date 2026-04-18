import React from 'react';
import { useSelector } from 'react-redux';
import { FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';
import { selectCustomers } from '../../store/slices/customerSlice';

export default function AdminCustomers() {
  const customers = useSelector(selectCustomers);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-admin-text text-base font-semibold">Customers</h2>
        <span className="text-admin-muted text-[0.72rem]">{customers.length} registered customers</span>
      </div>

      <div className="bg-admin-card border border-admin-border rounded-xl p-5">
        {customers.length === 0 ? (
          <p className="text-admin-muted text-sm text-center py-10">Customer accounts will appear here whenever someone signs up.</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {customers.map((customer) => (
              <article key={customer.id} className="rounded-xl border border-admin-border p-4 bg-white/[0.02]">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-admin-text text-sm font-medium">{customer.name}</p>
                    <p className="text-admin-muted text-[0.68rem] mt-1">
                      Joined {new Date(customer.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                    <FiUser />
                  </div>
                </div>

                <div className="space-y-2.5 text-[0.76rem]">
                  <Info icon={<FiMail />} text={customer.email} />
                  <Info icon={<FiPhone />} text={customer.phone} />
                  <Info icon={<FiMapPin />} text={customer.address?.line1 ? `${customer.address.line1}, ${customer.address.city}` : 'Address not added yet'} />
                </div>

                <div className="flex gap-3 mt-4 text-[0.68rem]">
                  <span className="px-2.5 py-1 rounded-full bg-gold/15 text-gold">{customer.orders?.length || 0} orders</span>
                  <span className="px-2.5 py-1 rounded-full bg-admin-blue/15 text-admin-blue">{customer.wishlist?.length || 0} wishlist items</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-admin-muted">
      <span className="text-[0.9rem]">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

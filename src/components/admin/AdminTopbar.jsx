import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiExternalLink, FiMenu, FiRefreshCw } from 'react-icons/fi';
import { selectActivePanel, toggleSidebar } from '../../store/slices/adminSlice';

const TITLES = {
  dashboard:'Dashboard', visitors:'Visitor Analytics',
  products:'Product Manager', quotes:'Quote Requests',
  customers:'Customers',
  orders:'Orders', settings:'Settings',
};

export default function AdminTopbar() {
  const dispatch = useDispatch();
  const panel    = useSelector(selectActivePanel);
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="sticky top-0 z-[50] flex items-center justify-between flex-wrap gap-3
                    px-5 py-3 bg-admin-surface border-b border-admin-border">
      <div className="flex items-center gap-3">
        <button onClick={() => dispatch(toggleSidebar())} aria-label="Toggle sidebar"
                className="lg:hidden bg-transparent border-none text-admin-text text-xl cursor-pointer p-1">
          <FiMenu />
        </button>
        <h1 className="text-admin-text text-[0.95rem] font-semibold">{TITLES[panel] || panel}</h1>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-admin-muted text-[0.72rem] hidden sm:block">{time}</span>

        <span className="bg-gold/[0.12] border border-gold/20 text-gold text-[0.7rem] px-3 py-1 rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-admin-green animate-pulse-dot inline-block" />
          Live
        </span>

        <a href="/" target="_blank" rel="noopener noreferrer"
           className="bg-gold text-deep text-[0.76rem] font-medium px-3 py-1.5 rounded-lg hover:opacity-85 transition-opacity flex items-center gap-1.5">
          View Store <FiExternalLink />
        </a>

        <button onClick={() => window.location.reload()}
                className="bg-white/[0.05] border border-admin-border text-admin-text text-[0.76rem]
                           px-3 py-1.5 rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer font-dm flex items-center gap-1.5">
          <FiRefreshCw />
          Refresh
        </button>
      </div>
    </div>
  );
}

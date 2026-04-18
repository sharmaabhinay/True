import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiBarChart2, FiBox, FiLogOut, FiMessageSquare, FiPackage, FiSettings, FiUsers, FiGlobe } from 'react-icons/fi';
import {
  selectActivePanel, selectSidebarOpen,
  setPanel, closeSidebar, logout,
} from '../../store/slices/adminSlice';

const NAV = [
  { id:'dashboard', icon:FiBarChart2, label:'Dashboard',        section:'Overview'  },
  { id:'visitors',  icon:FiUsers, label:'Visitor Analytics', section:null        },
  { id:'orders',    icon:FiPackage, label:'Orders',            section:null        },
  { id:'customers', icon:FiUsers, label:'Customers',         section:'Store'     },
  { id:'products',  icon:FiBox, label:'Products',          section:null     },
  { id:'quotes',    icon:FiMessageSquare, label:'Quote Requests',    section:null        },
  { id:'settings',  icon:FiSettings, label:'Settings',          section:'Settings'  },
];

export default function AdminSidebar() {
  const dispatch   = useDispatch();
  const active     = useSelector(selectActivePanel);
  const sideOpen   = useSelector(selectSidebarOpen);

  return (
    <>
      {/* Mobile overlay */}
      <div onClick={() => dispatch(closeSidebar())}
           className={`fixed inset-0 bg-black/50 z-[99] lg:hidden transition-all
                       ${sideOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} />

      {/* Sidebar */}
      <aside className={`fixed top-0 bottom-0 left-0 z-[100] w-[240px] bg-admin-surface
                         border-r border-admin-border flex flex-col
                         transition-transform duration-300
                         ${sideOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Logo */}
        <div className="px-5 py-5 border-b border-admin-border">
          <h2 className="font-cormorant text-xl text-gold font-semibold">TrueFurnitures</h2>
          <p className="text-admin-muted text-[0.68rem] mt-0.5">Admin Panel · Indore</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto admin-scroll">
          {NAV.map(item => (
            <React.Fragment key={item.id}>
              {item.section && (
                <div className="px-5 pt-4 pb-1 text-admin-muted text-[0.62rem] tracking-widest uppercase">
                  {item.section}
                </div>
              )}
              <button onClick={() => { dispatch(setPanel(item.id)); dispatch(closeSidebar()); }}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 text-left text-[0.82rem]
                                  cursor-pointer bg-transparent border-none border-l-2 transition-all
                                  ${active===item.id
                                    ? 'text-gold bg-gold/[0.06] border-l-gold'
                                    : 'text-admin-muted border-l-transparent hover:text-admin-text hover:bg-white/[0.03]'}`}>
                <span className="text-[0.95rem] min-w-[18px]"><item.icon /></span>
                {item.label}
              </button>
            </React.Fragment>
          ))}
          <button onClick={() => window.open('/', '_blank')}
                  className="w-full flex items-center gap-3 px-5 py-2.5 text-left text-[0.82rem]
                             cursor-pointer bg-transparent border-none border-l-2 border-l-transparent
                             text-admin-muted hover:text-admin-text hover:bg-white/[0.03] transition-all">
            <span className="text-[0.95rem] min-w-[18px]"><FiGlobe /></span>
            View Store
          </button>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-admin-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-deep text-xs font-semibold flex-shrink-0">
              AD
            </div>
            <div>
              <div className="text-admin-text text-sm">Administrator</div>
              <div className="text-admin-muted text-[0.66rem]">True Furnitures Indore</div>
            </div>
          </div>
          <button onClick={() => dispatch(logout())}
                  className="w-full bg-white/[0.04] border border-admin-border text-admin-muted text-[0.76rem]
                             py-2 rounded-lg hover:border-admin-red hover:text-admin-red transition-all cursor-pointer font-dm flex items-center justify-center gap-2">
            <FiLogOut />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

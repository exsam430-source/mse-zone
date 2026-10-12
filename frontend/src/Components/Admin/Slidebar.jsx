import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdAssignmentReturn,
  MdAddBox,
  MdViewList,
  MdLocalShipping,
} from 'react-icons/md';

const Slidebar = ({ toggleSidebar }) => {
  const handleClick = () => {
    if (window.innerWidth < 768 && toggleSidebar) toggleSidebar();
  };

  const navItems = [
    {
      to: '/admin/analytics',
      icon: <MdDashboard className="text-xl" />,
      label: 'Dashboard',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      to: '/admin/add',
      icon: <MdAddBox className="text-xl" />,
      label: 'Add Product',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      to: '/admin/list',
      icon: <MdViewList className="text-xl" />,
      label: 'Products',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      to: '/admin/AdminOrders',
      icon: <MdLocalShipping className="text-xl" />,
      label: 'Orders',
      gradient: 'from-orange-500 to-amber-500',
    },
    {
      to: '/admin/returns',
      icon: <MdAssignmentReturn className="text-xl" />,
      label: 'Returns',
      gradient: 'from-rose-500 to-pink-500',
    },
  ];

  return (
    <div className="w-64 h-full flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl overflow-y-auto">
      
      {/* ✅ Logo Area - stays at top */}
      <div className="px-6 py-8 border-b border-slate-700/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg tracking-tight">
              Admin Panel
            </h2>
            <p className="text-slate-400 text-xs">Manage everything</p>
          </div>
        </div>
      </div>

      {/* ✅ Navigation - scrollable if many items */}
      <div className="flex flex-col gap-2 pt-6 px-4 flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleClick}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 overflow-hidden flex-shrink-0 ${
                isActive
                  ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator bar */}
                {isActive && (
                  <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b ${item.gradient} shadow-lg`}
                  />
                )}

                {/* Hover glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl`}
                />

                {/* Icon */}
                <div
                  className={`relative z-10 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-br ${item.gradient} shadow-lg text-white`
                      : 'bg-slate-700/50 text-slate-400 group-hover:text-white group-hover:bg-slate-700'
                  }`}
                >
                  {item.icon}
                </div>

                {/* Label */}
                <span
                  className={`relative z-10 font-medium text-sm transition-all duration-300 ${
                    isActive ? 'text-white' : ''
                  }`}
                >
                  {item.label}
                </span>

                {/* Active arrow */}
                {isActive && (
                  <div className="ml-auto relative z-10">
                    <svg
                      className="w-4 h-4 text-white/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* ✅ Bottom Section - stays at bottom */}
      <div className="p-4 flex-shrink-0 border-t border-slate-700/30">
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl p-4 border border-indigo-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">✨</span>
            </div>
            <div>
              <p className="text-white text-xs font-medium">Pro Dashboard</p>
              <p className="text-slate-400 text-[10px]">v2.0 Universal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slidebar;
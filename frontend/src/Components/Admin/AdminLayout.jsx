import React from 'react';
import SidebarAdmin from './Slidebar.jsx';

const AdminLayout = ({ children, sidebarOpen, toggleSidebar }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      
      {/* Sidebar - Fixed on left */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 transform transition-all duration-500 ease-in-out
          ${
            sidebarOpen
              ? 'translate-x-0 shadow-2xl shadow-black/20'
              : '-translate-x-full'
          } 
          md:translate-x-0 md:shadow-none`}
      >
        <SidebarAdmin toggleSidebar={toggleSidebar} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* ✅ Main content - NO animation that causes re-mount */}
      <div className="flex-1 md:ml-64 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {React.cloneElement(children, { toggleSidebar })}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
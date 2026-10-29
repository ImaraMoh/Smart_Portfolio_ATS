import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

const DashboardShell = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="dashboard-shell flex min-h-screen bg-paper lg:gap-5 lg:p-5">
      <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <main className="dashboard-content min-w-0 flex-1">
        <div className="dashboard-page-enter w-full px-4 py-24 lg:px-0 lg:py-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardShell;

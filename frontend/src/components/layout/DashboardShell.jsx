import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

const DashboardShell = () => (
  <div className="flex min-h-screen bg-paper">
    <Sidebar />
    <main className="flex-1 min-w-0">
      <div className="max-w-5xl mx-auto px-8 py-10">
        <Outlet />
      </div>
    </main>
  </div>
);

export default DashboardShell;

import React from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/Sidebar';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      

        {/* Contenido Scrollable */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet /> {/* Aquí se renderizarán las rutas hijas del Dashboard */}
        </main>
      </div>
    
  );
};

export default DashboardLayout;

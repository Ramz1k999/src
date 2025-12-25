import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../Sidebar/Sidebar';
import './AdminLayout.scss';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-layout__content">
        <div className="admin-layout__container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
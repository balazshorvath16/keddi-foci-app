// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div>
      <Navbar />
      {/* Az Outlet biztosítja a nested route-ok renderelését */}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

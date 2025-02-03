// src/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import "../App.css"; // Győződj meg róla, hogy ez az import szerepel!

function Layout() {
  return (
    <div>
      <Navbar />
      {/* Ha a Navbar fixed pozícióban van, akkor itt érdemes extra felső paddingot adni */}
      <div className="wrapper" style={{ paddingTop: "70px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;

import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import NavbarOwner from "./NavbarOwner";
import Sidebar from "./Sidebar";
import { useAppContext } from "../../../context/useAppContext";

const Layout = () => {
  const { user, isOwner } = useAppContext();

  // 🔥 PROTECTION
  if (!user || !isOwner) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarOwner />

      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

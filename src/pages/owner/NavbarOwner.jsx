import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/useAppContext";

const NavbarOwner = () => {
  const { user, logout, isOwner } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <nav
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-20
      py-4 border-b text-gray-600 relative transition-all
      ${location.pathname === "/" ? "bg-light" : "bg-white"}`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.svg" alt="Logo" className="h-8" />
      </Link>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6">

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-6">

          {/* STUDENT LINKS */}
          {!isOwner && (
            <>
              <Link to="/pgs" className="cursor-pointer">
                PGs
              </Link>

              <Link to="/my-bookings" className="cursor-pointer">
                My Bookings
              </Link>
            </>
          )}

          {/* OWNER DASHBOARD */}
          {isOwner && (
            <button
              onClick={() => navigate("/owner/dashboard")}
              className="cursor-pointer"
            >
              Dashboard
            </button>
          )}

          {/* Avatar + Dropdown */}
          {user && (
            <div className="relative group cursor-pointer">

              <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div className="absolute right-0 mt-3 w-40 bg-white shadow-lg rounded-lg 
              opacity-0 invisible group-hover:opacity-100 group-hover:visible 
              transition-all duration-200">

                <p className="px-4 py-2 text-sm font-medium border-b">
                  {user.name}
                </p>

                {/* Show dashboard only for owner */}
                {isOwner && (
                  <button
                    onClick={() => navigate("/owner/dashboard")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Dashboard
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
                >
                  Logout
                </button>

              </div>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="sm:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="sm:hidden fixed top-16 right-0 h-screen w-full
        flex flex-col gap-6 p-6 border-t bg-white z-50">

          {/* STUDENT LINKS */}
          {!isOwner && (
            <>
              <button
                onClick={() => {
                  navigate("/pgs");
                  setOpen(false);
                }}
                className="text-lg text-left"
              >
                PGs
              </button>

              <button
                onClick={() => {
                  navigate("/my-bookings");
                  setOpen(false);
                }}
                className="text-lg text-left"
              >
                My Bookings
              </button>
            </>
          )}

          {/* OWNER DASHBOARD */}
          {isOwner && (
            <button
              onClick={() => {
                navigate("/owner/dashboard");
                setOpen(false);
              }}
              className="text-lg text-left"
            >
              Dashboard
            </button>
          )}

          {user && (
            <>
              <p className="font-medium border-t pt-4">
                {user.name}
              </p>

              <button
                onClick={handleLogout}
                className="text-red-500 text-left"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavbarOwner;
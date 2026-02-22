import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useAppContext";
import { assets, menuLinks } from "../assets/assets";

const Navbar = () => {
  const { user, isOwner, logout, setShowLogin, becomeOwner } = useAppContext();

  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-20
      py-4 border-b border-gray-200 text-gray-700 relative transition-all
      ${location.pathname === "/" ? "bg-light" : "bg-white"}`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.svg" alt="Logo" className="h-8" />
      </Link>

      <div className="flex items-center gap-6">

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-8">
          {menuLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className={`hover:text-black transition ${
                location.pathname === link.path ? "font-semibold" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden sm:flex gap-4 items-center">
          {user ? (
            <>
              {/* If NOT owner */}
              {!isOwner && (
                <button
                  onClick={becomeOwner}
                  className="text-blue-600 hover:underline transition"
                >
                  Become Owner
                </button>
              )}

              {/* If owner */}
              {isOwner && (
                <button
                  onClick={() => navigate("/owner/dashboard")}
                  className="hover:text-black transition"
                >
                  Dashboard
                </button>
              )}

              <span className="font-medium">
                Hi, {user.name}
              </span>

              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-dull transition"
            >
              Login
            </button>
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

      {/* Mobile Menu */}
      <div
        className={`sm:hidden fixed top-16 right-0 h-screen w-full
        flex flex-col gap-6 p-6 border-t border-gray-200
        transition-transform duration-300 z-50 bg-white
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {menuLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            onClick={() => setOpen(false)}
            className="text-lg"
          >
            {link.name}
          </Link>
        ))}

        {user ? (
          <>
            {!isOwner && (
              <button
                onClick={() => {
                  becomeOwner();
                  setOpen(false);
                }}
                className="text-lg text-left"
              >
                Become Owner
              </button>
            )}

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

            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="px-5 py-2 bg-gray-200 rounded-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setShowLogin(true);
              setOpen(false);
            }}
            className="px-5 py-2 bg-primary text-white rounded-lg"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import PgDetails from "./pages/PgDetails";
import PGs from "./pages/PGs";
import Mybookings from "./pages/Mybookings";
import Dashboard from "./pages/owner/Dashboard";
import AddPg from "./pages/owner/AddPg";
import ManagePgs from "./pages/owner/ManagePgs";
import ManageBookings from "./pages/owner/ManageBookings";
import Layout from "./pages/owner/Layout";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "../context/useAppContext";

const App = () => {
  const { showLogin } = useAppContext();

  return (
    <>
      <Toaster />
      {showLogin && <Login />}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pg-details/:id" element={<PgDetails />} />
                <Route path="/pgs" element={<PGs />} />
                <Route path="/my-bookings" element={<Mybookings />} />
              </Routes>
              <Footer />
            </>
          }
        />

        {/* OWNER ROUTES */}
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-pg/:id?" element={<AddPg />} />
          <Route path="manage-pg" element={<ManagePgs />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
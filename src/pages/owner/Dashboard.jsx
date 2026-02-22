import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import axios from "axios";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get("/api/owner/dashboard");

        if (data.success) {
          setDashboardData(data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-8">
        <p>No dashboard data found.</p>
      </div>
    );
  }

  const {
    totalPgs,
    availablePgs,
    totalRooms,
    totalBeds,
    availableBeds,
    occupiedBeds,
    occupancyRate,
    totalRevenue
  } = dashboardData;

  return (
    <div className="p-8 w-full bg-gray-50 min-h-screen">
      <div className="mb-8">
        <Title
          title="Owner Dashboard"
          subTitle="Monitor PG performance, occupancy and revenue"
          align="left"
        />
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <StatCard title="Total PGs" value={totalPgs} />
        <StatCard title="Available PGs" value={availablePgs} />
        <StatCard title="Total Rooms" value={totalRooms} />
        <StatCard title="Total Beds" value={totalBeds} />

        {/* Revenue Card */}
        <div className="bg-gradient-to-r from-primary to-indigo-600 p-6 rounded-xl shadow-md text-white">
          <p className="text-sm opacity-80">Total Revenue</p>
          <h2 className="text-3xl font-bold mt-2">
            ₹ {totalRevenue?.toLocaleString() || 0}
          </h2>
        </div>
      </div>

      {/* Bed Summary Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-6">
          Bed Summary
        </h3>

        <div className="grid sm:grid-cols-3 gap-6 text-center mb-6">
          <div>
            <p className="text-sm text-gray-400">Total Beds</p>
            <p className="text-xl font-semibold">
              {totalBeds}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">
              Available Beds
            </p>
            <p className="text-xl font-semibold text-green-600">
              {availableBeds}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">
              Occupied Beds
            </p>
            <p className="text-xl font-semibold text-red-500">
              {occupiedBeds}
            </p>
          </div>
        </div>

        {/* Occupancy Bar */}
        <div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{
                width: `${parseFloat(occupancyRate) || 0}%`
              }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {occupancyRate} Occupancy Rate
          </p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-2xl font-semibold mt-2">
      {value}
    </h2>
  </div>
);

export default Dashboard;

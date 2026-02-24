import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import axios from "axios";
import { toast } from "react-hot-toast";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Fetch Owner Bookings */
useEffect(() => {
  const fetchBookings = async () => {
    try {
      const { data } = await axios.get("/api/booking/owner");

      if (data.success) {
        setBookings(data.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  fetchBookings();
}, []);

  /* Delete Booking */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    try {
      const { data } = await axios.delete(`/api/booking/${id}`);

      if (data.success) {
        setBookings((prev) =>
          prev.filter((b) => b._id !== id)
        );
        toast.success("Booking deleted");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  /* Update Status */
  const updateStatus = async (id, newStatus) => {
    try {
      const { data } = await axios.put(
        "/api/booking/change-status",
        {
          bookingId: id,
          status: newStatus
        }
      );

      if (data.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === id ? { ...b, status: newStatus } : b
          )
        );

        toast.success("Status updated");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="p-10">
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="p-10 w-full bg-gray-50 min-h-screen">
      <Title
        title="Manage Bookings"
        subTitle="Track and manage PG bookings"
        align="left"
      />

      <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="hidden md:grid md:grid-cols-8 gap-4 px-6 py-4 bg-gray-100 text-sm font-medium text-gray-600">
          <span>PG Name</span>
          <span>Location</span>
          <span>Room</span>
          <span>Start Date</span>
          <span>Months</span>
          <span>Rent / Month</span>
          <span>Total</span>
          <span>Status</span>
        </div>

        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="grid grid-cols-2 md:grid-cols-8 gap-4 items-center px-6 py-4 border-t hover:bg-gray-50 transition"
            >
              <span className="font-medium">
                {booking.pg?.name}
              </span>

              <span className="text-sm text-gray-500">
                {booking.pg?.location}
              </span>

              <span className="capitalize">
                {booking.roomType}
              </span>

              <span>
                {new Date(booking.startDate).toLocaleDateString()}
              </span>

              <span>{booking.months}</span>

              <span>₹{booking.rentPerMonth}</span>

              <span className="font-semibold">
                ₹{booking.totalAmount}
              </span>

              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`px-3 py-1 text-xs rounded-full capitalize ${getStatusStyle(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>

                {booking.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        updateStatus(booking._id, "confirmed")
                      }
                      className="text-green-600 text-sm hover:underline"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(booking._id, "cancelled")
                      }
                      className="text-yellow-600 text-sm hover:underline"
                    >
                      Reject
                    </button>
                  </>
                )}

                <button
                  onClick={() =>
                    handleDelete(booking._id)
                  }
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No bookings found
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;




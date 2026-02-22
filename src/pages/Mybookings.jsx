import React, { useEffect, useState } from "react";
import axios from "axios";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get("/api/booking/user");

        if (data.success) {
          setBookings(data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

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

  if (loading) return <p className="text-center py-20">Loading...</p>;

  return (
    <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-16">
      <h1 className="text-3xl font-semibold mb-10">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="space-y-8">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={booking.pg?.images?.[0]}
                  alt={booking.pg?.name}
                  className="w-full md:w-48 h-40 object-cover rounded-xl"
                />

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {booking.pg?.name}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        📍 {booking.pg?.location}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 text-xs rounded-full capitalize ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p>Room</p>
                      <p className="font-medium">
                        {booking.roomType}
                      </p>
                    </div>

                    <div>
                      <p>Start</p>
                      <p>
                        {new Date(
                          booking.startDate
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p>Months</p>
                      <p>{booking.months}</p>
                    </div>

                    <div>
                      <p>Rent</p>
                      <p>₹{booking.rentPerMonth}</p>
                    </div>

                    <div>
                      <p>Total</p>
                      <p className="font-semibold">
                        ₹{booking.totalAmount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🔥 OWNER CONTACT SECTION */}
              {booking.status === "confirmed" && (
                <div className="mt-4 p-5 bg-green-50 rounded-xl border border-green-200">
                  <h3 className="font-semibold mb-3 text-green-700">
                    Owner Contact Details
                  </h3>

                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {booking.pg?.owner?.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {booking.pg?.owner?.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {booking.pg?.owner?.phone}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-3 flex-wrap">
                    <a
                      href={`tel:${booking.pg?.owner?.phone}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                    >
                      Call Owner
                    </a>

                    <a
                      href={`https://wa.me/${booking.pg?.owner?.phone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyBookings;

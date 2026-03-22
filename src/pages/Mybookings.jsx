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

      {/* ALERT */}
      <div className="w-full mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-amber-200 text-amber-800">
            ⚠️
          </div>

          <div className="flex-1">
            <p className="text-sm text-amber-800 leading-relaxed">
              <span className="font-semibold">Safety Notice:</span>{" "}
              Do not make any online payment before visiting the property.
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-3xl py-5 font-semibold mb-10">
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

                  {/* DETAILS */}
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">

                    {/* ROOM TYPE */}
                    <div>
                      <p>Type</p>
                      <p className="font-medium capitalize">
                        {booking.pg?.type === "room"
                          ? "Flat"
                          : booking.roomType}
                      </p>
                    </div>

                    {/* START DATE */}
                    <div>
                      <p>Start</p>
                      <p>
                        {new Date(
                          booking.startDate
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    {/* MONTHS */}
                    <div>
                      <p>Months</p>
                      <p>{booking.months}</p>
                    </div>

                    {/* RENT */}
                    <div>
                      <p>
                        {booking.pg?.type === "room"
                          ? "Flat Rent"
                          : "Rent / Bed"}
                      </p>
                      <p>₹{booking.rentPerMonth}</p>
                    </div>

                    {/* TOTAL */}
                    <div>
                      <p>Total</p>
                      <p className="font-semibold">
                        ₹{booking.totalAmount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* OWNER CONTACT */}
              {booking.status === "confirmed" && (
                <div className="mt-4 p-5 bg-green-50 rounded-xl border border-green-200">
                  <h3 className="font-semibold mb-3 text-green-700">
                    Owner Contact Details
                  </h3>

                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Owner:</span>{" "}
                      {booking.pg?.owner?.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {booking.pg?.owner?.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {booking.pg?.phone}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-3 flex-wrap">
                    <a
                      href={`tel:${booking.pg?.phone}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                    >
                      Call Owner
                    </a>

                    <a
                      href={`https://wa.me/${booking.pg?.phone}`}
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
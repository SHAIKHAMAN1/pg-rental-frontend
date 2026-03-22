import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const PgDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pg, setPg] = useState(null);
  const [roomType, setRoomType] = useState("single");
  const [months, setMonths] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchPg = async () => {
      try {
        const { data } = await axios.get(`/api/user/pg/${id}`);
        if (data.success) {
          setPg(data.pg);
        } else {
          toast.error(data.message);
        }
      } catch {
        toast.error("Failed to fetch PG");
      } finally {
        setLoading(false);
      }
    };

    fetchPg();
  }, [id]);

  /* ================= IMAGE SLIDER ================= */
  useEffect(() => {
    if (!pg?.images || pg.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === pg.images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [pg]);

  /* ================= AVAILABILITY ================= */
  const isAvailable = () => {
    if (!pg) return false;

    if (pg.type === "room") {
      return pg.occupants.current < pg.occupants.max;
    }

    return (
      pg.bedsSummary?.single?.available > 0 ||
      pg.bedsSummary?.double?.available > 0 ||
      pg.bedsSummary?.triple?.available > 0
    );
  };

  /* ================= BOOKING ================= */
  const handleBooking = async () => {
    if (!pg) return;

    let available;

    if (pg.type === "room") {
      available =
        pg.occupants.current < pg.occupants.max ? 1 : 0;
    } else {
      available =
        pg.bedsSummary?.[roomType]?.available || 0;
    }

    if (available <= 0) {
      toast.error("No availability");
      return;
    }

    try {
      setBookingLoading(true);

      const payload = {
        pgId: id,
        months,
        startDate: new Date()
      };

      if (pg.type === "pg") {
        payload.roomType = roomType;
      }

      const { data } = await axios.post(
        "/api/booking/create",
        payload
      );

      if (data.success) {
        toast.success("Booking Successful");
        navigate("/my-bookings");
      } else {
        toast.error(data.message);
      }

    } catch (err) {
      toast.error(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return <p className="text-center py-20">Loading...</p>;

  if (!pg)
    return <p className="text-center py-20">Not found</p>;

  const price =
    pg.type === "pg"
      ? pg.roomConfig?.[roomType]?.price || 0
      : pg.roomConfig?.single?.price || 0;

  const totalPrice = price * months;

  return (
    <section className="px-6 md:px-16 py-16 bg-gray-50 min-h-screen">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-gray-500 hover:text-black"
      >
        ← Back
      </button>

      <div className="grid lg:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-md">

        {/* IMAGE */}
        <div className="relative">
          <img
            src={pg.images?.[currentImage] || "/placeholder.jpg"}
            className="w-full h-[400px] object-cover rounded-xl"
          />

          {pg.images?.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {pg.images.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
                    currentImage === i
                      ? "bg-white"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="flex flex-col justify-between">

          <div>
            <h1 className="text-3xl font-bold mb-2">{pg.name}</h1>

            <p className="text-gray-500 mb-3">📍 {pg.location}</p>

            <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium mb-6">
              {pg.type === "room" ? "Room / Flat" : "PG"}
            </span>

            {/* ROOM TYPE (NO COUNT — ONLY STATUS) */}
            {pg.type === "pg" && (
              <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-700">
                  Select Room Type
                </h3>

                <div className="flex gap-3 flex-wrap">
                  {["single", "double", "triple"].map((type) => {
                    const available =
                      pg.bedsSummary?.[type]?.available || 0;

                    return (
                      <button
                        key={type}
                        disabled={available <= 0}
                        onClick={() => setRoomType(type)}
                        className={`px-4 py-2 rounded-lg border text-sm capitalize transition ${
                          roomType === type
                            ? "bg-primary text-white border-primary"
                            : "bg-gray-100 hover:bg-gray-200"
                        } ${
                          available <= 0
                            ? "opacity-40 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {type}

                        {/* 🔥 STATUS TEXT */}
                        {available > 2 ? (
                          <span className="text-green-600 text-xs ml-2">
                            Available
                          </span>
                        ) : available > 0 ? (
                          <span className="text-orange-500 text-xs ml-2">
                            Few left
                          </span>
                        ) : (
                          <span className="text-red-500 text-xs ml-2">
                            Full
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ROOM AVAILABILITY */}
            {pg.type === "room" && (
              <div className="mb-6">
                <p
                  className={`font-medium ${
                    pg.occupants.current < pg.occupants.max
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {pg.occupants.current < pg.occupants.max
                    ? "Room Available"
                    : "Room Full"}
                </p>
              </div>
            )}

            {/* MONTHS */}
            <div className="mb-6">
              <label className="block mb-2 text-sm text-gray-600">
                Select Duration
              </label>

              <select
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="border px-4 py-2 rounded-lg w-full max-w-[200px]"
              >
                {[1, 2, 3, 6].map((m) => (
                  <option key={m} value={m}>
                    {m} Months
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PRICE + BUTTON */}
          <div className="border-t pt-6 mt-6">

            <h2 className="text-2xl font-semibold">
              ₹{price} <span className="text-sm text-gray-500">/ month</span>
            </h2>

            <p className="text-gray-600 mb-4">
              Total: ₹{totalPrice}
            </p>

            <button
              disabled={!isAvailable() || bookingLoading}
              onClick={handleBooking}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition"
            >
              {bookingLoading ? "Booking..." : "Book Now"}
            </button>

            <div className="w-full my-5 bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">

          {/* ICON */}
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-amber-200 text-amber-800">
            ⚠️
          </div>

          {/* TEXT */}
          <div className="flex-1">
            <p className="text-sm text-amber-800 leading-relaxed">
              <span className="font-semibold">Safety Notice:</span>{" "}
              Do not make any online payment before visiting the property.
            </p>
          </div>

        </div>
      </div>


          </div>
        </div>
      </div>
    </section>
  );
};

export default PgDetails;
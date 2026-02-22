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

  /* ===============================
     Fetch Single PG
  =============================== */
  useEffect(() => {
    const fetchPg = async () => {
      try {
        const { data } = await axios.get(`/api/user/pg/${id}`);
        if (data.success) {
          setPg(data.pg);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch PG");
      } finally {
        setLoading(false);
      }
    };

    fetchPg();
  }, [id]);

  /* ===============================
     Auto Image Slide
  =============================== */
  useEffect(() => {
    if (!pg?.images || pg.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === pg.images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [pg]);

  /* ===============================
     Handle Booking
  =============================== */
  const handleBooking = async () => {
    if (!pg) return;

    const availableBeds =
      pg.bedsSummary?.[roomType]?.available || 0;

    if (availableBeds <= 0) {
      toast.error("No beds available for selected room type");
      return;
    }

    try {
      setBookingLoading(true);

      const { data } = await axios.post("/api/booking/create", {
        pgId: id,
        roomType,
        months,
        startDate: new Date()
      });

      if (data.success) {
        toast.success("Booking Created Successfully");
        navigate("/my-bookings");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return <p className="text-center py-20">Loading...</p>;

  if (!pg)
    return <p className="text-center py-20">PG not found</p>;

  const price = pg.roomConfig?.[roomType]?.price || 0;
  const totalPrice = price * months;

  return (
    <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-16">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-primary"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ================= IMAGE SLIDER ================= */}
        <div className="relative">
          <img
            src={
              pg.images && pg.images.length > 0
                ? pg.images[currentImage]
                : "/placeholder.jpg"
            }
            alt={pg.name}
            className="w-full h-[400px] object-cover rounded-2xl transition-all duration-300"
          />

          {/* Left Arrow */}
          {pg.images?.length > 1 && (
            <button
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === 0 ? pg.images.length - 1 : prev - 1
                )
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
            >
              ◀
            </button>
          )}

          {/* Right Arrow */}
          {pg.images?.length > 1 && (
            <button
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === pg.images.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
            >
              ▶
            </button>
          )}

          {/* Dots */}
          {pg.images?.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {pg.images.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-3 h-3 rounded-full cursor-pointer ${
                    currentImage === index
                      ? "bg-white"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ================= DETAILS ================= */}
        <div>
          <h1 className="text-3xl font-semibold">{pg.name}</h1>
          <p className="text-gray-500 mt-2">📍 {pg.location}</p>

          {/* Room Type */}
          <div className="mt-6">
            <h3 className="mb-3 font-medium">Select Room Type</h3>

            {["single", "double", "triple"].map((type) => {
              const available =
                pg.bedsSummary?.[type]?.available || 0;

              return (
                <button
                  key={type}
                  disabled={available <= 0}
                  onClick={() => setRoomType(type)}
                  className={`px-4 py-2 border mr-3 rounded-lg capitalize ${
                    roomType === type
                      ? "bg-primary text-white"
                      : ""
                  } ${
                    available <= 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {type} ({available} beds)
                </button>
              );
            })}
          </div>

          {/* Months */}
          <div className="mt-6">
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="border px-4 py-2 rounded-lg"
            >
              {[1, 2, 3, 6, 12].map((m) => (
                <option key={m} value={m}>
                  {m} Months
                </option>
              ))}
            </select>
          </div>

          {/* Pricing */}
          <div className="mt-6 space-y-2">
            <h2 className="text-xl font-semibold">
              ₹{price} / month
            </h2>
            <h3 className="text-lg">
              Total: ₹{totalPrice}
            </h3>
          </div>

          {/* Book Button */}
          <button
            disabled={bookingLoading}
            onClick={handleBooking}
            className="mt-6 px-6 py-3 bg-primary text-white rounded-lg"
          >
            {bookingLoading ? "Booking..." : "Book Now"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default PgDetails;

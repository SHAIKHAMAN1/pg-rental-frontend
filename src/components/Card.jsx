import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ pg }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  // Safe price calculation
  const prices = [
    pg.roomConfig?.single?.price,
    pg.roomConfig?.double?.price,
    pg.roomConfig?.triple?.price
  ].filter((price) => price && price > 0);

  const minPrice = prices.length ? Math.min(...prices) : null;

  const isAvailable =
    pg.bedsSummary?.single?.available > 0 ||
    pg.bedsSummary?.double?.available > 0 ||
    pg.bedsSummary?.triple?.available > 0;

  const image =
    pg.images && pg.images.length > 0
      ? pg.images[0]
      : "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <div
      onClick={() => navigate(`/pg-details/${pg._id}`)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer overflow-hidden"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={pg.name}
          className="w-full h-full object-cover hover:scale-105 transition duration-500"
        />

        {/* Availability Badge */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 text-xs rounded-full text-white ${
            isAvailable ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {isAvailable ? "Rooms Available" : "Fully Booked"}
        </span>

        {/* Girls PG Badge */}
        {pg.isGirlsPg && (
          <span className="absolute top-3 right-3 bg-pink-500 text-white px-3 py-1 text-xs rounded-full">
            Girls PG
          </span>
        )}

        {/* Price */}
        {minPrice && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
            {currency}{minPrice} / month
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-lg truncate">
          {pg.name}
        </h3>
        <p className="text-sm text-gray-500">
          📍 {pg.location}
        </p>
      </div>
    </div>
  );
};

export default Card;
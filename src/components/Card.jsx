import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ pg }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  const minPrice = Math.min(
    pg.roomConfig?.single?.price || Infinity,
    pg.roomConfig?.double?.price || Infinity,
    pg.roomConfig?.triple?.price || Infinity
  );

  const isAvailable =
    pg.bedsSummary?.single?.available > 0 ||
    pg.bedsSummary?.double?.available > 0 ||
    pg.bedsSummary?.triple?.available > 0;

  return (
    <div
      onClick={() => navigate(`/pg-details/${pg._id}`)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer"
    >
      <div className="relative h-52">
        <img
          src={pg.images?.[0]}
          alt={pg.name}
          className="w-full h-full object-cover rounded-t-2xl"
        />

        {isAvailable ? (
          <span className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 text-xs rounded-full">
            Rooms Available
          </span>
        ) : (
          <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 text-xs rounded-full">
            Fully Booked
          </span>
        )}

        <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-lg">
          {currency}{minPrice} /month
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-lg">{pg.name}</h3>
        <p className="text-sm text-gray-500">
          📍 {pg.location}
        </p>
      </div>
    </div>
  );
};

export default Card;

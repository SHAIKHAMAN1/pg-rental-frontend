import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ManagePgs = () => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ===============================
     Fetch Owner PGs
  =============================== */
  useEffect(() => {
    const fetchPgs = async () => {
      try {
        const { data } = await axios.get("/api/owner/pgs");
        if (data.success) {
          setPgs(data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch PGs");
      } finally {
        setLoading(false);
      }
    };

    fetchPgs();
  }, []);

  /* ===============================
     Delete PG
  =============================== */
  const handleDelete = async (e, pgId) => {
    e.stopPropagation(); // 🔥 prevent card redirect

    const confirmDelete = window.confirm("Delete this PG?");
    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(
        `/api/owner/delete-pg/${pgId}`
      );

      if (data.success) {
        setPgs((prev) => prev.filter((pg) => pg._id !== pgId));
        toast.success("PG deleted successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  /* ===============================
     Toggle Availability
  =============================== */
  const toggleAvailability = async (e, pgId) => {
    e.stopPropagation(); // 🔥 prevent card redirect

    try {
      const { data } = await axios.patch(
        `/api/owner/toggle-pg/${pgId}`
      );

      if (data.success) {
        setPgs((prev) =>
          prev.map((pg) =>
            pg._id === pgId
              ? { ...pg, isAvailable: data.isAvailable }
              : pg
          )
        );

        toast.success(
          data.isAvailable
            ? "PG Activated"
            : "PG Deactivated"
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (loading) {
    return <div className="p-10">Loading PGs...</div>;
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <Title
        title="Manage Your PGs"
        subTitle="Click on a PG to edit details"
        align="left"
      />

      {pgs.length === 0 ? (
        <div className="mt-12 text-gray-500">
          You haven't added any PG yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">
          {pgs.map((pg) => {
            const totalRooms = Object.values(pg.roomConfig || {})
              .reduce((acc, room) => acc + (room.rooms || 0), 0);

            const totalBeds = Object.values(pg.bedsSummary || {})
              .reduce((acc, room) => acc + (room.total || 0), 0);

            const availableBeds = Object.values(pg.bedsSummary || {})
              .reduce((acc, room) => acc + (room.available || 0), 0);

            return (
              <div
                key={pg._id}
                onClick={() =>
                  navigate(`/owner/add-pg/${pg._id}`)
                }
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-6 flex flex-col justify-between cursor-pointer"
              >
                {/* Top Section */}
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">
                      {pg.name}
                    </h3>

                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        pg.isAvailable
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {pg.isAvailable ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    📍 {pg.location}
                  </p>

                  {/* Stats */}
                  <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-400">Rooms</p>
                      <p className="font-semibold">{totalRooms}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Total Beds</p>
                      <p className="font-semibold">{totalBeds}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Available</p>
                      <p className="font-semibold text-green-600">
                        {availableBeds}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={(e) =>
                      toggleAvailability(e, pg._id)
                    }
                    className="flex-1 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                  >
                    Toggle Status
                  </button>

                  <button
                    onClick={(e) =>
                      handleDelete(e, pg._id)
                    }
                    className="flex-1 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManagePgs;
import React, { useEffect, useState } from "react";
import axios from "axios";
import Title from "../components/Title";
import Card from "../components/Card";

const PGs = () => {
  const [pgs, setPgs] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchPgs = async () => {
      try {
        const token = localStorage.getItem("token");

        // 🔥 If no token → stop early
        if (!token) {
          setError("Please login to view listings");
          setLoading(false);
          return;
        }

        const { data } = await axios.get("/api/user/all-pgs", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (data?.success) {
          setPgs(data.pgs || []);
        } else {
          setError(data?.message || "Failed to fetch listings");
        }

      } catch (error) {
        console.log(error);
        setError("Server error while fetching listings");
      } finally {
        setLoading(false);
      }
    };

    fetchPgs();
  }, []);

  /* ================= FILTER ================= */
  const filteredPGs = pgs.filter((pg) => {
    const location = pg?.location?.toLowerCase() || "";

    const cityMatch =
      selectedCity === "All" ||
      location.includes(selectedCity.toLowerCase());

    const typeMatch =
      selectedType === "All" ||
      pg.type === selectedType;

    return pg?.isAvailable && cityMatch && typeMatch;
  });

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Loading listings...</p>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-16">

      <Title
        title="Find Your Stay"
        subTitle="PGs, Rooms & Shared Living Spaces"
      />

      {/* ================= CITY FILTER ================= */}
      <div className="mt-10 flex flex-wrap gap-4">
        {["All", "Pune", "Mumbai", "Bangalore"].map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              selectedCity === city
                ? "bg-primary text-white border-primary"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* ================= TYPE FILTER ================= */}
      <div className="mt-4 flex gap-4">
        {["All", "pg", "room"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-full text-sm border capitalize transition ${
              selectedType === type
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {type === "All" ? "All" : type}
          </button>
        ))}
      </div>

      {/* ================= GRID ================= */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {filteredPGs.length > 0 ? (
          filteredPGs.map((pg) => (
            <Card key={pg._id} pg={pg} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No listings available.
          </p>
        )}

      </div>
    </section>
  );
};

export default PGs;
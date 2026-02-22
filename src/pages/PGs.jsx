import React, { useEffect, useState } from "react";
import axios from "axios";
import Title from "../components/Title";
import Card from "../components/Card";

const PGs = () => {
  const [pgs, setPgs] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     Fetch PGs
  ========================= */
  useEffect(() => {
    const fetchPgs = async () => {
      try {
        const { data } = await axios.get("/api/user/all-pgs");

        if (data?.success) {
          setPgs(data.pgs || []);
        } else {
          setError(data?.message || "Failed to fetch PGs");
        }
      } catch (error) {
        setError("Server error while fetching PGs");
      } finally {
        setLoading(false);
      }
    };

    fetchPgs();
  }, []);

  /* =========================
     Filtering
  ========================= */
  const filteredPGs = pgs.filter((pg) => {
    const location = pg?.location?.toLowerCase() || "";

    const cityMatch =
      selectedCity === "All" ||
      location.includes(selectedCity.toLowerCase());

    return pg?.isAvailable && cityMatch;
  });

  /* =========================
     Loading
  ========================= */
  if (loading)
    return (
      <div className="text-center py-20">
        <p>Loading PGs...</p>
      </div>
    );

  /* =========================
     Error
  ========================= */
  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        {error}
      </div>
    );

  return (
    <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-16">
      <Title
        title="Available PGs"
        subTitle="Browse our selection of premium PG rooms"
      />

      {/* City Filters */}
      <div className="mt-10 flex flex-wrap gap-4">
        {["All", "Pune", "Mumbai", "Bangalore"].map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-4 py-2 rounded-full text-sm border transition
              ${
                selectedCity === city
                  ? "bg-primary text-white border-primary"
                  : "bg-white hover:bg-gray-100"
              }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* PG Grid */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPGs.length > 0 ? (
          filteredPGs.map((pg) => (
            <Card key={pg._id} pg={pg} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No PGs available.
          </p>
        )}
      </div>
    </section>
  );
};

export default PGs;
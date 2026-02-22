import React, { useEffect, useState } from "react";
import Title from "./Title";
import Card from "./Card";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const [pgs, setPgs] = useState([]);

  useEffect(() => {
    const fetchPgs = async () => {
      try {
        const { data } = await axios.get("/api/user/all-pgs");
        if (data.success) {
          setPgs(data.pgs.slice(0, 6));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPgs();
  }, []);

  return (
    <div className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="Featured PGs"
        subTitle="Explore our selection of premium rooms"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {pgs.map((pg) => (
          <Card key={pg._id} pg={pg} />
        ))}
      </div>

      <button
        onClick={() => navigate("/pgs")}
        className="mt-12 px-5 py-2 border rounded-md"
      >
        Explore More
      </button>
    </div>
  );
};

export default FeaturedSection;

import React from "react";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className="px-6 md:px-16 lg:px-20 xl:px-32 my-9">
      
      <div
        className="flex flex-col md:flex-row items-center justify-between
        px-8 md:px-14 py-9
        bg-gradient-to-r from-primary to-blue-300
        rounded-3xl overflow-hidden"
      >

        {/* LEFT CONTENT */}
        <div className="text-white max-w-l text-center md:text-left">

          <h2 className="text-3xl md:text-4xl font-semibold leading-snug">
            Own a PG? Start Earning Today.
          </h2>

          <p className="mt-3 text-white/90">
            List your property on our platform and reach thousands of students instantly.
          </p>

          <p className="mt-2 text-white/80">
            We handle verified bookings, secure payments and student verification —
            so you can grow your rental income stress-free.
          </p>

          <button
            onClick={() => navigate("/owner")}
            className="mt-6 px-6 py-3 bg-white text-primary
            font-medium rounded-lg shadow-md
            hover:bg-gray-100 transition duration-300"
          >
            List Your PG
          </button>

        </div>

        {/* RIGHT SIDE ILLUSTRATION */}
        <div className="mt-10 md:mt-0 md:ml-10">
          <img
            src="/banner_pg.jpeg"  // Put this in public folder
            alt="PG Illustration"
            className=" rounded-xl  max-h-56 md:max-h-65 object-contain"
          />
        </div>

      </div>

    </section>
  );
};

export default Banner;

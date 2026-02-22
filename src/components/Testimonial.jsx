import React from "react";

const Testimonial = () => {

  const TestimonialData = [
    {
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      name: "Riya Sharma",
      handle: "@riya_pune",
      text: "Finding a safe and clean PG in Pune was so easy with this platform. The booking process was smooth and transparent!"
    },
    {
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
      name: "Arjun Mehta",
      handle: "@arjun_student",
      text: "I shifted from Delhi to Bangalore and booked my PG online before arriving. Saved me so much time and stress."
    },
    {
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200",
      name: "Sneha Patil",
      handle: "@sneha_tech",
      text: "Verified listings and honest pricing. No hidden charges. I highly recommend it to students."
    },
    {
      image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200",
      name: "Rahul Verma",
      handle: "@rahul_moves",
      text: "As a PG owner, I received genuine leads within days. The dashboard is very easy to manage."
    },
  ];

  const CreateCard = ({ Testimonial }) => (
    <div className="p-5 rounded-2xl mx-4 bg-white shadow-md hover:shadow-xl transition-all duration-300 w-80 shrink-0">

      {/* Top Section */}
      <div className="flex gap-3 items-center">
        <img
          className="w-12 h-12 rounded-full object-cover"
          src={Testimonial.image}
          alt="User"
        />

        <div className="flex flex-col">
          <div className="flex items-center gap-1 font-medium">
            {Testimonial.name}
            <span className="text-blue-500 text-xs">✔</span>
          </div>

          <span className="text-xs text-gray-500">
            {Testimonial.handle}
          </span>

          <div className="flex text-yellow-400 text-xs mt-1">
            ⭐⭐⭐⭐⭐
          </div>
        </div>
      </div>

      {/* Review Text */}
      <p className="text-sm mt-4 text-gray-700 leading-relaxed">
        {Testimonial.text}
      </p>

    </div>
  );

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">

      {/* Animation Style */}
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .marquee-inner {
          animation: marqueeScroll 30s linear infinite;
        }

        .marquee-reverse {
          animation-direction: reverse;
        }
      `}</style>

      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold">
          What Our Users Say
        </h2>
        <p className="text-gray-500 mt-3">
          Trusted by students and PG owners across India
        </p>
      </div>

      {/* First Row */}
      <div className="w-full max-w-6xl mx-auto overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>

        <div className="marquee-inner flex min-w-[200%] py-6">
          {[...TestimonialData, ...TestimonialData].map((Testimonial, index) => (
            <CreateCard key={index} Testimonial={Testimonial} />
          ))}
        </div>

        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>
      </div>

      {/* Second Row (Reverse) */}
      <div className="w-full max-w-6xl mx-auto overflow-hidden relative mt-8">
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>

        <div className="marquee-inner marquee-reverse flex min-w-[200%] py-6">
          {[...TestimonialData, ...TestimonialData].map((Testimonial, index) => (
            <CreateCard key={index} Testimonial={Testimonial} />
          ))}
        </div>

        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>
      </div>

    </section>
  );
};

export default Testimonial;

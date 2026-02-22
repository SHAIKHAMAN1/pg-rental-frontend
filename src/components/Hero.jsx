import React from 'react'

const Hero = () => {
    return (
        <div className='h-screen flex flex-col items-center justify-center gap-10 bg-light text-center'>
            <h1 className='text-4xl md:text-5xl font-semibold'>Luxury PGs on Rent</h1>
            <form
                className="flex flex-col md:flex-row items-center
  justify-between p-6 rounded-lg md:rounded-full w-full
  max-w-4xl bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)] gap-6"
            >

                {/* Left Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center px-2 gap-6">

                    {/* Location Select */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">Location</label>
                        <select
                            name="location"
                            className="outline-none bg-transparent text-gray-700"
                        >
                            <option value="">Select Location</option>
                            <option value="pune">Pune</option>
                            <option value="mumbai">Mumbai</option>
                            <option value="bangalore">Bangalore</option>
                        </select>
                    </div>

                    {/* Room Type Select */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">Room Type</label>
                        <select
                            name="roomType"
                            className=" outline-none pr- mx-2 bg-transparent text-gray-700"
                        >
                            <option value="">Select Type</option>
                            <option value="single">Single Sharing</option>
                            <option value="double">Double Sharing</option>
                            <option value="triple">Triple Sharing</option>
                        </select>
                    </div>

                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dull transition"
                >
                    Search
                </button>

            </form>

            <img src="/Hero.jpg" alt='PG' className='max-h-80 ' />
        </div>
    )
}

export default Hero
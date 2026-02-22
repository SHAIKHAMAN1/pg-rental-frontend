import React from 'react'

const Newsletter = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20 space-y-2">
            <h1 className="md:text-4xl text-2xl font-semibold">Stay Updated on Verified PG Listings</h1>
            <p className="md:text-lg text-gray-500/70 pb-8">
               Receive alerts for new PGs, availability updates, and special offers near you.
            </p>
            <form className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
                <input
                    className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
                    type="text"
                    placeholder="Enter your email id"
                    required
                />
                <button type="submit" className="md:px-12 px-8 h-full text-white bg-indigo-500 hover:bg-indigo-600 transition-all cursor-pointer rounded-md rounded-l-none">
                    Subscribe
                </button>
            </form>
        </div>
    )
}

export default Newsletter
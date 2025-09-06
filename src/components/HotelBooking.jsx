import React, { useState, useEffect } from "react";
import {
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

// --- Mock Data for Jharkhand Hotels ---
const mockHotels = [
  {
    id: 1,
    name: "Radisson Blu Hotel Ranchi",
    location: "Ranchi",
    price: 5500,
    rating: 4.7,
    amenities: ["Pool", "WiFi", "Spa", "Gym"],
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 2,
    name: "The Alcor Hotel",
    location: "Jamshedpur",
    price: 4200,
    rating: 4.5,
    amenities: ["Gym", "WiFi", "Restaurant"],
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbb5eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 3,
    name: "Sonotel Hotel Dhanbad",
    location: "Dhanbad",
    price: 3800,
    rating: 4.3,
    amenities: ["Free Breakfast", "WiFi", "Conference Hall"],
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1925&q=80",
  },
  {
    id: 4,
    name: "Imperial Heights",
    location: "Deoghar",
    price: 3000,
    rating: 4.1,
    amenities: ["Temple Proximity", "WiFi", "Vegetarian Restaurant"],
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 5,
    name: "Le Lac Sarovar Portico",
    location: "Ranchi",
    price: 4800,
    rating: 4.6,
    amenities: ["Lake View", "Rooftop Bar", "Gym"],
    image:
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 6,
    name: "Prabhat Vihar Hotel",
    location: "Netarhat",
    price: 2500,
    rating: 4.0,
    amenities: ["Sunrise Point", "Basic Amenities", "Restaurant"],
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 7,
    name: "Ramada by Wyndham",
    location: "Jamshedpur",
    price: 4000,
    rating: 4.4,
    amenities: ["Pool", "WiFi", "Business Center"],
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80",
  },
];

export default function HotelBooking() {
  // --- State Management ---
  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter & Sort State (Prices updated for INR)
  const [priceRange, setPriceRange] = useState(10000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("price_asc");

  // --- Effects ---
  useEffect(() => {
    let result = hotels;

    // Apply filters
    result = result.filter((hotel) => hotel.price <= priceRange);
    result = result.filter((hotel) => hotel.rating >= minRating);

    // Apply sorting
    const sortedResult = [...result].sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "rating_desc":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredHotels(sortedResult);
  }, [hotels, priceRange, minRating, sortBy]);

  // --- Handlers ---
  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const results = mockHotels.filter((hotel) =>
        hotel.location.toLowerCase().includes(destination.toLowerCase())
      );
      setHotels(results);
      setLoading(false);
    }, 1500); // 1.5 second delay
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 absolute top-[8vh] w-full max-h-[92vh] overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100">
      <div className="max-w-7xl mx-auto">
        {/* Header and Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Find Your Perfect Stay in Jharkhand 🏨
          </h1>
          <p className="text-slate-600 mb-6">
            Search for hotels and resorts across Jharkhand.
          </p>
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
          >
            {/* Destination */}
            <div className="lg:col-span-2">
              <label
                htmlFor="destination"
                className="block text-sm font-medium text-gray-700"
              >
                Destination
              </label>
              <div className="mt-1 relative">
                <MapPinIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                <input
                  type="text"
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Ranchi, Jamshedpur"
                  required
                />
              </div>
            </div>
            {/* Check-in */}
            <div>
              <label
                htmlFor="checkin"
                className="block text-sm font-medium text-gray-700"
              >
                Check-in
              </label>
              <input
                type="date"
                id="checkin"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {/* Check-out */}
            <div>
              <label
                htmlFor="checkout"
                className="block text-sm font-medium text-gray-700"
              >
                Check-out
              </label>
              <input
                type="date"
                id="checkout"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {/* Search Button */}
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition w-full"
            >
              Search
            </button>
          </form>
        </div>

        {/* Main Content: Filters + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg h-fit">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Filter & Sort
            </h3>
            {/* Price Range Filter */}
            <div className="mb-6">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Max Price:{" "}
                <span className="font-bold text-blue-600">₹{priceRange.toLocaleString('en-IN')}</span>
              </label>
              <input
                type="range"
                id="price"
                min="1000"
                max="10000"
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            {/* Rating Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                      minRating === rating
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-yellow-200"
                    }`}
                  >
                    {rating}
                    <StarIcon className="h-4 w-4 ml-1" />
                  </button>
                ))}
              </div>
            </div>
            {/* Sort By */}
            <div>
              <label
                htmlFor="sort"
                className="block text-sm font-medium text-gray-700"
              >
                Sort By
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Rating: High to Low</option>
              </select>
            </div>
          </aside>

          {/* Hotel Results */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-20">
                <p className="text-lg font-semibold text-gray-600">
                  Finding hotels...
                </p>
              </div>
            ) : filteredHotels.length > 0 ? (
              <div className="space-y-6">
                {filteredHotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                  >
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full md:w-1/3 h-48 md:h-full object-cover"
                    />
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold text-slate-800">
                        {hotel.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2 flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {hotel.location}
                      </p>
                      <div className="flex items-center my-2">
                        <div className="flex items-center text-yellow-400">
                          {[...Array(Math.floor(hotel.rating))].map((_, i) => (
                            <StarIcon key={i} className="h-5 w-5" />
                          ))}
                        </div>
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          {hotel.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex-grow my-4 space-x-2">
                        {hotel.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <p className="text-2xl font-bold text-gray-800">
                            ₹{hotel.price.toLocaleString('en-IN')}
                          </p>
                          <p className="text-sm text-gray-500">per night</p>
                        </div>
                        <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-700">
                  No hotels found
                </h3>
                <p className="text-gray-500 mt-2">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
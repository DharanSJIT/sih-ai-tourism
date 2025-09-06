import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, Wifi, Car, Coffee, Utensils, Waves, Dumbbell, Heart, Phone, Mail, Calendar, Users, Clock, AlertCircle, Search, Filter, X } from "lucide-react";

// Helper function to format dates to YYYY-MM-DD
const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Mock data as fallback
const mockHotelsData = {
  "chennai": [
    {
      id: 1,
      name: "The Leela Palace Chennai",
      location: "Adyar, Chennai, Tamil Nadu",
      price: 15000,
      originalPrice: 18000,
      rating: 4.8,
      reviewCount: 1250,
      amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Gym", "Valet Parking"],
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
      description: "Luxury beachfront hotel with world-class amenities and stunning sea views.",
      hotelType: "Luxury",
      distance: "2.5 km from Marina Beach"
    },
    {
      id: 2,
      name: "ITC Grand Chola",
      location: "Guindy, Chennai, Tamil Nadu", 
      price: 12500,
      originalPrice: 15000,
      rating: 4.7,
      reviewCount: 980,
      amenities: ["Free WiFi", "Business Center", "Multiple Restaurants", "Spa", "Pool"],
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
      description: "Premium business hotel with excellent connectivity and luxury services.",
      hotelType: "Business",
      distance: "5 km from Airport"
    },
    {
      id: 3,
      name: "Taj Coromandel",
      location: "Nungambakkam, Chennai, Tamil Nadu",
      price: 11000,
      originalPrice: 13500,
      rating: 4.6,
      reviewCount: 750,
      amenities: ["WiFi", "Pool", "Restaurant", "Bar", "Concierge"],
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop",
      description: "Iconic hotel in the heart of Chennai with timeless elegance.",
      hotelType: "Heritage",
      distance: "1 km from City Center"
    }
  ],
  "mumbai": [
    {
      id: 4,
      name: "The Taj Mahal Palace Mumbai",
      location: "Apollo Bunder, Mumbai, Maharashtra",
      price: 25000,
      originalPrice: 30000,
      rating: 4.9,
      reviewCount: 2100,
      amenities: ["Luxury Spa", "Multiple Restaurants", "Pool", "Heritage Tour", "Butler Service"],
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
      description: "Iconic luxury heritage hotel overlooking the Gateway of India.",
      hotelType: "Heritage Luxury",
      distance: "Gateway of India"
    }
  ],
  "delhi": [
    {
      id: 5,
      name: "The Imperial New Delhi",
      location: "Janpath, New Delhi, Delhi",
      price: 18000,
      originalPrice: 22000,
      rating: 4.7,
      reviewCount: 1500,
      amenities: ["Heritage Property", "Fine Dining", "Spa", "Art Collection", "Garden"],
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop",
      description: "Historic luxury hotel blending colonial charm with modern amenities.",
      hotelType: "Heritage Luxury",
      distance: "2 km from Connaught Place"
    }
  ],
  "bangalore": [
    {
      id: 6,
      name: "The Oberoi Bangalore",
      location: "MG Road, Bangalore, Karnataka",
      price: 16000,
      originalPrice: 19000,
      rating: 4.8,
      reviewCount: 890,
      amenities: ["Free WiFi", "Spa", "Pool", "Restaurant", "Business Center", "Gym"],
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
      description: "Contemporary luxury hotel in the heart of India's Silicon Valley.",
      hotelType: "Luxury",
      distance: "1.5 km from MG Road Metro"
    }
  ]
};

const amenityIcons = {
  "Free WiFi": <Wifi className="h-3 w-3" />,
  "WiFi": <Wifi className="h-3 w-3" />,
  "Pool": <Waves className="h-3 w-3" />,
  "Gym": <Dumbbell className="h-3 w-3" />,
  "Spa": <Heart className="h-3 w-3" />,
  "Restaurant": <Utensils className="h-3 w-3" />,
  "Parking": <Car className="h-3 w-3" />,
  "Valet Parking": <Car className="h-3 w-3" />,
  "Business Center": <Coffee className="h-3 w-3" />,
  "Multiple Restaurants": <Utensils className="h-3 w-3" />,
  "Heritage Property": <Star className="h-3 w-3" />,
  "Fine Dining": <Utensils className="h-3 w-3" />,
  "Art Collection": <Star className="h-3 w-3" />,
  "Garden": <Heart className="h-3 w-3" />,
  "Butler Service": <Users className="h-3 w-3" />,
  "Heritage Tour": <MapPin className="h-3 w-3" />,
  "Luxury Spa": <Heart className="h-3 w-3" />,
  "Concierge": <Users className="h-3 w-3" />,
  "Bar": <Coffee className="h-3 w-3" />
};

// Helper function to safely get amenities as array
const getAmenitiesArray = (amenities) => {
  if (Array.isArray(amenities)) {
    return amenities;
  }
  if (typeof amenities === 'string') {
    // If it's a string, try to split it or return as single item array
    return amenities.split(',').map(item => item.trim()).filter(item => item.length > 0);
  }
  // Fallback to default amenities
  return ['WiFi', 'Restaurant', 'Room Service'];
};

export default function HotelBooking() {
  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState(getFormattedDate(new Date()));
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return getFormattedDate(tomorrow);
  });
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState(50000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("popularity");
  const [selectedHotelType, setSelectedHotelType] = useState("all");
  const [apiMode, setApiMode] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Your RapidAPI key
  const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

  // Calculate number of nights
  const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));

  useEffect(() => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkOut <= checkIn) {
      const newCheckOutDate = new Date(checkIn);
      newCheckOutDate.setDate(newCheckOutDate.getDate() + 1);
      setCheckOutDate(getFormattedDate(newCheckOutDate));
    }
  }, [checkInDate]);

  useEffect(() => {
    let result = [...hotels];
    
    // Apply filters
    result = result.filter((hotel) => hotel.price <= priceRange);
    result = result.filter((hotel) => parseFloat(hotel.rating) >= minRating);
    
    if (selectedHotelType !== "all") {
      result = result.filter((hotel) => 
        hotel.hotelType && hotel.hotelType.toLowerCase().includes(selectedHotelType.toLowerCase())
      );
    }

    // Apply sorting
    const sortedResult = result.sort((a, b) => {
      switch (sortBy) {
        case "price_asc": return a.price - b.price;
        case "price_desc": return b.price - a.price;
        case "rating_desc": return parseFloat(b.rating) - parseFloat(a.rating);
        case "popularity": return b.reviewCount - a.reviewCount;
        case "discount": return (b.originalPrice - b.price) - (a.originalPrice - a.price);
        default: return 0;
      }
    });

    setFilteredHotels(sortedResult);
  }, [hotels, priceRange, minRating, sortBy, selectedHotelType]);

  const searchWithAPI = async () => {
    try {
      // Step 1: Get destination ID
      const locationResponse = await fetch(
        `https://booking-com.p.rapidapi.com/v1/hotels/locations?locale=en-gb&name=${encodeURIComponent(destination)}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
          }
        }
      );
      
      if (!locationResponse.ok) {
        throw new Error(`Location API returned ${locationResponse.status}`);
      }
      
      const locationData = await locationResponse.json();
      
      if (!locationData || !locationData.length) {
        throw new Error('Destination not found');
      }
      
      const destId = locationData[0].dest_id;
      const destType = locationData[0].dest_type;
      
      // Step 2: Search for hotels
      const searchParams = new URLSearchParams({
        locale: 'en-gb',
        room_number: rooms.toString(),
        checkin_date: checkInDate,
        checkout_date: checkOutDate,
        adults_number: adults.toString(),
        order_by: 'popularity',
        units: 'metric',
        filter_by_currency: 'INR',
        dest_type: destType,
        dest_id: destId.toString(),
        page_number: '0'
      });
      
      const hotelResponse = await fetch(
        `https://booking-com.p.rapidapi.com/v1/hotels/search?${searchParams}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
          }
        }
      );
      
      if (!hotelResponse.ok) {
        throw new Error(`Hotels API returned ${hotelResponse.status}`);
      }
      
      const hotelData = await hotelResponse.json();
      
      if (!hotelData.result || !Array.isArray(hotelData.result)) {
        throw new Error('No hotels found for this destination');
      }
      
      // Transform API data to our format with proper error handling
      const transformedHotels = hotelData.result.slice(0, 20).map((hotel, index) => ({
        id: hotel.hotel_id || `hotel_${index}`,
        name: hotel.hotel_name || hotel.hotel_name_trans || 'Hotel',
        location: `${hotel.city_trans || hotel.city || ''}, ${hotel.country_trans || ''}`.replace(', ,', ','),
        price: Math.round(hotel.min_total_price || hotel.price_breakdown?.gross_price?.value || 5000),
        originalPrice: Math.round((hotel.min_total_price || 5000) * 1.2),
        rating: hotel.review_score ? (hotel.review_score / 2).toFixed(1) : (4.0 + Math.random()).toFixed(1),
        reviewCount: hotel.review_nr || Math.floor(Math.random() * 1000) + 100,
        amenities: getAmenitiesArray(hotel.hotel_facilities || ['WiFi', 'Restaurant', 'Room Service']),
        image: hotel.main_photo_url ? 
          hotel.main_photo_url.replace('square60', 'square200').replace('square90', 'square200') : 
          `https://images.unsplash.com/photo-${1566073771259 + index}?w=600&h=400&fit=crop`,
        description: `Comfortable accommodation in ${hotel.district || hotel.city_trans || 'city center'} with modern amenities and excellent service.`,
        hotelType: hotel.accommodation_type_name || (hotel.is_smart_deal ? 'Smart Deal' : 'Hotel'),
        distance: hotel.distance_to_cc ? `${hotel.distance_to_cc} km from center` : hotel.distance || '',
        totalPrice: Math.round((hotel.min_total_price || 5000) * nights)
      }));
      
      return transformedHotels;
      
    } catch (apiError) {
      console.warn('API search failed:', apiError.message);
      throw apiError;
    }
  };

  const searchWithMockData = () => {
    const searchKey = destination.toLowerCase();
    let matchedHotels = [];
    
    // Check if destination matches any of our mock data cities
    Object.keys(mockHotelsData).forEach(city => {
      if (searchKey.includes(city) || city.includes(searchKey)) {
        matchedHotels = [...matchedHotels, ...mockHotelsData[city]];
      }
    });
    
    // If no specific match, show a sample from all cities
    if (matchedHotels.length === 0) {
      matchedHotels = Object.values(mockHotelsData).flat();
    }
    
    // Simulate price variations and ensure all properties exist
    return matchedHotels.map((hotel, index) => ({
      ...hotel,
      id: hotel.id || `mock_${index}`,
      price: Math.round(hotel.price * (0.8 + Math.random() * 0.4)),
      totalPrice: Math.round(hotel.price * nights * rooms),
      amenities: getAmenitiesArray(hotel.amenities)
    }));
  };

  const handleSearch = async () => {
    if (!destination.trim()) {
      setError("Please enter a destination");
      return;
    }

    setLoading(true);
    setError(null);
    setHotels([]);

    try {
      let hotelResults;
      
      if (apiMode) {
        // Try API first
        try {
          hotelResults = await searchWithAPI();
          console.log('Using real API data');
        } catch (apiError) {
          console.warn('API failed, falling back to mock data:', apiError.message);
          setError(`API Error: ${apiError.message}. Showing demo data.`);
          hotelResults = searchWithMockData();
        }
      } else {
        // Use mock data with simulated delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        hotelResults = searchWithMockData();
        console.log('Using demo data');
      }
      
      setHotels(hotelResults);
      
    } catch (error) {
      console.error("Search error:", error);
      setError(`Search failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRatingFilter = (rating) => {
    setMinRating(prevRating => prevRating === rating ? 0 : rating);
  };
  
  const handleBookNow = (hotel) => {
    const totalAmount = hotel.price * nights * rooms;
    const booking = {
      hotel: hotel,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights: nights,
      rooms: rooms,
      adults: adults,
      totalAmount: totalAmount
    };
    
    console.log("Booking Details:", booking);
    
    alert(`Booking Confirmed!\n\nHotel: ${hotel.name}\nCheck-in: ${checkInDate}\nCheck-out: ${checkOutDate}\nGuests: ${adults} adults, ${rooms} room(s)\nNights: ${nights}\nTotal Amount: ₹${totalAmount.toLocaleString('en-IN')}\n\nThank you for choosing us!`);
  };

  const resetFilters = () => {
    setPriceRange(50000);
    setMinRating(0);
    setSelectedHotelType("all");
    setSortBy("popularity");
  };

  const hotelTypes = ["all", "luxury", "business", "resort", "heritage", "budget"];

  // Mobile filter component
  const MobileFilters = () => (
    
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${showMobileFilters ? 'block' : 'hidden'} lg:hidden`}>
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Filters</h3>
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          
          {/* Price Range */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Price per night: <span className="text-blue-600">₹{priceRange.toLocaleString('en-IN')}</span>
            </label>
            <input 
              type="range" 
              min="1000" 
              max="50000" 
              step="1000" 
              value={priceRange} 
              onChange={(e) => setPriceRange(Number(e.target.value))} 
              className="w-full h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>₹1K</span>
              <span>₹50K+</span>
            </div>
          </div>
          
          {/* Star Rating */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Minimum Rating</label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingFilter(rating)}
                  className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                    minRating === rating 
                      ? "bg-yellow-400 text-white shadow-lg scale-110" 
                      : "bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:scale-105"
                  }`}
                >
                  <Star className={`h-4 w-4 ${minRating === rating ? 'fill-white' : 'fill-current'}`} />
                </button>
              ))}
            </div>
          </div>

            
          
          {/* Hotel Type */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Hotel Type</label>
            <select 
              value={selectedHotelType} 
              onChange={(e) => setSelectedHotelType(e.target.value)} 
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {hotelTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sort By */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="popularity">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="discount">Best Discounts</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(priceRange < 50000 || minRating > 0 || selectedHotelType !== "all") && (
            <button 
              onClick={() => {
                resetFilters();
                setShowMobileFilters(false);
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-all font-medium"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-[10vh]">
      {/* Mobile Filters Overlay */}
      <MobileFilters />

      {/* Header */}
      {/* <div className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg sm:text-xl">🏨</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">HotelFinder</h1>
                <p className="text-gray-500 text-xs sm:text-sm hidden sm:block">Find your perfect stay</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm text-gray-600">📞 24/7 Support</p>
              <p className="text-sm sm:text-lg font-semibold text-blue-600">+91-8000-123-456</p>
            </div>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        {/* Search Form */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-8 mb-6 sm:mb-8 border border-blue-100">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">Find Your Perfect Stay</h2>
            <p className="text-sm sm:text-lg text-gray-600">Search from thousands of hotels worldwide with the best prices guaranteed</p>
          </div>
          
          {/* API Mode Toggle */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="bg-gray-100 rounded-lg p-1 flex items-center space-x-1">
              <button
                onClick={() => setApiMode(false)}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  !apiMode ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Demo Mode
              </button>
              <button
                onClick={() => setApiMode(true)}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  apiMode ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Live API
              </button>
            </div>
          </div>
          
          {/* Mobile-first Search Form */}
          <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-6 lg:gap-6 lg:items-end">
            {/* Destination */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Where are you going?
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={destination} 
                  onChange={(e) => setDestination(e.target.value)} 
                  className="w-full pl-4 pr-12 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                  placeholder="City, landmark, or hotel name" 
                />
                <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            {/* Check-in & Check-out */}
            <div className="grid grid-cols-2 gap-2 lg:col-span-2 lg:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Check-in
                </label>
                <input 
                  type="date" 
                  value={checkInDate} 
                  min={getFormattedDate(new Date())} 
                  onChange={(e) => setCheckInDate(e.target.value)} 
                  className="w-full p-3 sm:p-4 text-sm sm:text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Check-out
                </label>
                <input 
                  type="date" 
                  value={checkOutDate} 
                  min={checkInDate} 
                  onChange={(e) => setCheckOutDate(e.target.value)} 
                  className="w-full p-3 sm:p-4 text-sm sm:text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                />
              </div>
            </div>
            
            {/* Guests */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Guests & Rooms
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select 
                  value={adults} 
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-full p-3 sm:p-4 text-sm sm:text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <select 
                  value={rooms} 
                  onChange={(e) => setRooms(Number(e.target.value))}
                  className="w-full p-3 sm:p-4 text-sm sm:text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {[1,2,3,4].map(num => (
                    <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Search Button */}
            <div className="lg:col-span-1">
              <button 
                onClick={handleSearch}
                disabled={loading || !destination.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    <span className="text-sm sm:text-base">Searching...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Search className="h-4 w-4 mr-2" />
                    <span className="text-sm sm:text-lg">Search</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Trip Summary */}
          {destination && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-2">
                <span className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {nights} night{nights !== 1 ? 's' : ''} • {rooms} room{rooms !== 1 ? 's' : ''} • {adults} guest{adults !== 1 ? 's' : ''}
                </span>
                <span className="text-blue-600 font-semibold">
                  {new Date(checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                {(priceRange < 50000 || minRating > 0 || selectedHotelType !== "all") && (
                  <button 
                    onClick={resetFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Price per night: <span className="text-blue-600">₹{priceRange.toLocaleString('en-IN')}</span>
                </label>
                <input 
                  type="range" 
                  min="1000" 
                  max="50000" 
                  step="1000" 
                  value={priceRange} 
                  onChange={(e) => setPriceRange(Number(e.target.value))} 
                  className="w-full h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹1K</span>
                  <span>₹50K+</span>
                </div>
              </div>
              
              {/* Star Rating */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Minimum Rating</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRatingFilter(rating)}
                      className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                        minRating === rating 
                          ? "bg-yellow-400 text-white shadow-lg scale-110" 
                          : "bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:scale-105"
                      }`}
                    >
                      <Star className={`h-4 w-4 ${minRating === rating ? 'fill-white' : 'fill-current'}`} />
                    </button>
                  ))}
                </div>
                {minRating > 0 && (
                  <p className="text-xs text-gray-500 mt-2">{minRating}+ star hotels</p>
                )}
              </div>
              
              {/* Hotel Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Hotel Type</label>
                <select 
                  value={selectedHotelType} 
                  onChange={(e) => setSelectedHotelType(e.target.value)} 
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {hotelTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Sort By</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)} 
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating_desc">Highest Rated</option>
                  <option value="discount">Best Discounts</option>
                </select>
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Mobile Filter Button */}
            {!loading && hotels.length > 0 && (
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <p className="text-gray-600 text-sm">
                  {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
                </p>
                <button 
                  onClick={() => setShowMobileFilters(true)}
                  className="flex items-center space-x-2 bg-white border-2 border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Filters</span>
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12 sm:py-20 bg-white rounded-2xl shadow-lg">
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">Finding amazing hotels...</h3>
                <p className="text-gray-500 text-base sm:text-lg">
                  {apiMode ? 'Searching live data from Booking.com' : 'Searching through our database'}
                </p>
              </div>
            )}
            
            {/* Error State */}
            {error && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-800 font-medium">Notice</p>
                    <p className="text-yellow-700 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Results Header - Desktop Only */}
            {!loading && !error && filteredHotels.length > 0 && (
              <div className="hidden lg:block bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
                    </h2>
                    <p className="text-gray-600">
                      {destination} • {new Date(checkInDate).toLocaleDateString('en-US', { 
                        weekday: 'short', month: 'short', day: 'numeric' 
                      })} - {new Date(checkOutDate).toLocaleDateString('en-US', { 
                        weekday: 'short', month: 'short', day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Best Price Guaranteed
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Free Cancellation
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Hotel Cards */}
            {!loading && !error && filteredHotels.length > 0 && (
              <div className="space-y-4 sm:space-y-6">
                {filteredHotels.map((hotel) => {
                  const discount = Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100);
                  const totalPrice = hotel.price * nights * rooms;
                  const amenitiesArray = getAmenitiesArray(hotel.amenities);
                  
                  return (
                    <div key={hotel.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group">
                      <div className="flex flex-col lg:flex-row">
                        {/* Hotel Image */}
                        <div className="lg:w-1/3 relative">
                          <img 
                            src={hotel.image} 
                            alt={hotel.name} 
                            className="w-full h-48 sm:h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop';
                            }}
                          />
                          
                          {/* Discount Badge */}
                          {discount > 0 && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                              {discount}% OFF
                            </div>
                          )}
                          
                          {/* Rating Badge */}
                          <div className="absolute top-3 right-3 bg-white rounded-lg px-2 py-1 shadow-lg">
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-xs font-bold text-gray-800">{hotel.rating}</span>
                            </div>
                            <p className="text-xs text-gray-500">{hotel.reviewCount} reviews</p>
                          </div>
                          
                          {/* Hotel Type Badge */}
                          <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {hotel.hotelType}
                          </div>
                        </div>
                        
                        {/* Hotel Details */}
                        <div className="lg:w-2/3 p-4 sm:p-6 flex flex-col">
                          {/* Header */}
                          <div className="flex-grow">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-grow">
                                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                  {hotel.name}
                                </h3>
                                <p className="text-gray-600 flex items-center mb-2 text-sm">
                                  <MapPin className="h-3 w-3 mr-1 text-red-500 flex-shrink-0" />
                                  {hotel.location}
                                </p>
                                {hotel.distance && (
                                  <p className="text-xs sm:text-sm text-blue-600 font-medium">{hotel.distance}</p>
                                )}
                              </div>
                            </div>
                            
                            {/* Description */}
                            <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">{hotel.description}</p>
                            
                            {/* Amenities */}
                            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                              {amenitiesArray.slice(0, 6).map((amenity, index) => (
                                <span 
                                  key={`${amenity}-${index}`} 
                                  className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full border border-blue-200"
                                >
                                  {amenityIcons[amenity] || <Wifi className="h-3 w-3" />}
                                  {amenity}
                                </span>
                              ))}
                              {amenitiesArray.length > 6 && (
                                <span className="text-xs text-gray-500 px-2 py-1">
                                  +{amenitiesArray.length - 6} more
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Price and Booking */}
                          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-4 border-t border-gray-100">
                            <div className="space-y-1">
                              {discount > 0 && (
                                <p className="text-sm text-gray-500 line-through">
                                  ₹{hotel.originalPrice.toLocaleString('en-IN')} per night
                                </p>
                              )}
                              <div className="flex items-baseline space-x-2">
                                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                                  ₹{hotel.price.toLocaleString('en-IN')}
                                </span>
                                <span className="text-gray-600 text-sm">per night</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="font-semibold">Total: ₹{totalPrice.toLocaleString('en-IN')}</span>
                                <span className="text-xs ml-1">({nights} nights, {rooms} room{rooms > 1 ? 's' : ''})</span>
                              </div>
                              <p className="text-xs text-green-600 font-medium">Includes taxes and fees</p>
                            </div>
                            
                            <div className="flex flex-col space-y-2 sm:items-end">
                              <button 
                                onClick={() => handleBookNow(hotel)} 
                                className="bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 px-6 sm:px-8 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                              >
                                <span>Book Now</span>
                              </button>
                              <div className="flex space-x-2 text-sm">
                                <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                                  View Details
                                </button>
                                <span className="text-gray-300">•</span>
                                <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* No Results with Filters Applied */}
            {!loading && !error && hotels.length > 0 && filteredHotels.length === 0 && (
              <div className="text-center py-12 sm:py-20 bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="text-4xl sm:text-6xl mb-6">🔍</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">No hotels match your filters</h3>
                <p className="text-gray-500 mb-6 text-base sm:text-lg">
                  Try adjusting your price range, rating, or hotel type filters to see more options.
                </p>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Current filters: Price ≤ ₹{priceRange.toLocaleString('en-IN')}, 
                    {minRating > 0 ? ` Rating ≥ ${minRating}★,` : ''} 
                    {selectedHotelType !== 'all' ? ` Type: ${selectedHotelType}` : ''}
                  </p>
                  <button 
                    onClick={resetFilters}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
            
            {/* Initial State - No Search Yet */}
            {!loading && !error && hotels.length === 0 && (
              <div className="text-center py-12 sm:py-20 bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="text-4xl sm:text-6xl mb-6">🏨</div>
                <h3 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-4">Ready to find your perfect stay?</h3>
                <p className="text-gray-500 text-base sm:text-lg mb-8 max-w-md mx-auto">
                  Enter your destination above and discover amazing hotels with the best prices, 
                  exclusive deals, and instant confirmation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto text-left">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-2xl mb-2">💰</div>
                    <h4 className="font-semibold text-blue-900 mb-1">Best Price Guarantee</h4>
                    <p className="text-sm text-blue-700">Find a lower price? We'll match it!</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-2xl mb-2">🚫</div>
                    <h4 className="font-semibold text-green-900 mb-1">Free Cancellation</h4>
                    <p className="text-sm text-green-700">Cancel anytime before check-in</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-2xl mb-2">⚡</div>
                    <h4 className="font-semibold text-purple-900 mb-1">Instant Confirmation</h4>
                    <p className="text-sm text-purple-700">Book now, get confirmed instantly</p>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Footer */}
      {/* <footer className="bg-gray-900 text-white py-8 sm:py-12 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🏨</span>
                </div>
                <h3 className="text-xl font-bold">HotelFinder</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trusted partner for finding the perfect accommodation worldwide. 
                Book with confidence, travel with peace of mind.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Popular Destinations</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Chennai Hotels</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mumbai Hotels</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Delhi Hotels</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bangalore Hotels</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Support</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>+91-8000-123-456</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>support@hotelfinder.com</span>
                </div>
                <div className="text-gray-400">
                  <Clock className="h-4 w-4 inline mr-2" />
                  24/7 Customer Support
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 HotelFinder. All rights reserved. | Made with care for travelers worldwide
            </p>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
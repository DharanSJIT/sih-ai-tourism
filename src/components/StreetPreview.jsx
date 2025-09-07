import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Link } from "react-router-dom";
import { ArrowLeft, Map, Eye, Landmark, Utensils, Users, Search, MapPin, X } from "lucide-react";

// Import Swiper for the image gallery
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import your map image
import JharkhandMap from '../assets/Jharkhand.png';

// Get the API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// --- Data for Map Hotspots (Popular locations for quick access) ---
const popularLocations = [
  { name: "Ranchi", top: "58%", left: "45%" },
  { name: "Jamshedpur", top: "75%", left: "60%" },
  { name: "Hazaribag", top: "40%", left: "40%" },
  { name: "Deoghar", top: "30%", left: "75%" },
  { name: "Dhanbad", top: "45%", left: "70%" },
  { name: "Netarhat", top: "65%", left: "20%" },
  { name: "Bokaro", top: "50%", left: "60%" },
];

// --- Main Component ---
const StreetPreview = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("preview");

  useEffect(() => {
    if (selectedLocation) {
      fetchStreetPreview(selectedLocation);
    }
  }, [selectedLocation]);

  // Debounced search for location suggestions
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        fetchLocationSuggestions(searchQuery);
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const fetchLocationSuggestions = async (query) => {
    if (!query.trim()) return;
    
    setSearchLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are a location search assistant for Jharkhand, India. 
        A user has typed: "${query}"
        
        Find and suggest real locations in Jharkhand state that match or are similar to this search query.
        Include cities, towns, villages, tourist spots, landmarks, districts, and other places of interest.
        
        Provide your response as a valid JSON array only. Do not include any text outside of the JSON array.
        The JSON should contain up to 8 location suggestions in this format:
        [
          {
            "name": "Full location name",
            "type": "city|town|village|district|landmark|tourist_spot",
            "description": "Very brief description (max 10 words)"
          }
        ]
        
        Make sure all suggested locations are actually in Jharkhand state, India.
        If no relevant locations are found, return an empty array: []
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const suggestions = JSON.parse(text);
      setSearchSuggestions(Array.isArray(suggestions) ? suggestions : []);
      setShowSuggestions(true);

    } catch (err) {
      console.error("Search API Error:", err);
      setSearchSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLocationSelect = (locationName) => {
    setSelectedLocation(locationName);
    setSearchQuery(locationName);
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedLocation(searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedLocation(null);
    setPreviewData(null);
    setShowSuggestions(false);
    setError("");
  };

  const fetchStreetPreview = async (locationName) => {
    setLoading(true);
    setError("");
    setPreviewData(null);
    setActiveTab("preview");

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are a virtual tour guide for Jharkhand, India. A user has selected the location: '${locationName}'.
        
        First, verify if this location actually exists in Jharkhand state, India. If it doesn't exist or is not in Jharkhand, respond with:
        {"error": "Location not found in Jharkhand or does not exist"}
        
        If the location exists in Jharkhand, generate a virtual "Street Preview" for this location.
        Provide your response as a valid JSON object only. Do not include any text outside of the JSON object.
        The JSON object should have the following structure:
        {
          "locationName": "${locationName}",
          "verified": true,
          "immersivePreview": "A vivid, first-person description of walking through a famous street or area in this location. Describe the sights, sounds, smells, and atmosphere to make the user feel like they are there. Make it engaging and immersive.",
          "keyAttractions": [
            {"name": "Attraction 1", "description": "A compelling description of a real must-see place in this location."},
            {"name": "Attraction 2", "description": "Another compelling description of a real attraction."},
            {"name": "Attraction 3", "description": "A third real attraction with description."}
          ],
          "localVibe": "Describe the authentic atmosphere and culture of this place. What are the people like? What is the pace of life? Is it modern, traditional, or a mix? Include local customs if relevant.",
          "streetFood": [
            {"name": "Food Item 1", "description": "A description of a real local street food or regional specialty and what makes it special."},
            {"name": "Food Item 2", "description": "Another local food item with description."},
            {"name": "Food Item 3", "description": "A third local delicacy with description."}
          ],
          "imageSearchKeywords": ["${locationName} street view", "${locationName} landmark", "${locationName} market", "${locationName} jharkhand", "${locationName} tourism"]
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const data = JSON.parse(text);
      
      if (data.error) {
        setError(`"${locationName}" was not found in Jharkhand or doesn't exist. Please try searching for another location.`);
      } else {
        setPreviewData(data);
      }

    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch preview. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const renderContent = () => {
    if (!previewData) return null;
    switch (activeTab) {
      case 'preview': return <p className="text-sm leading-relaxed">{previewData.immersivePreview}</p>;
      case 'attractions': return (
        <ul className="space-y-3">
          {previewData.keyAttractions?.map((item, index) => (
            <li key={index} className="text-sm">
              <strong className="text-cyan-400">{item.name}:</strong> 
              <span className="ml-2">{item.description}</span>
            </li>
          ))}
        </ul>
      );
      case 'vibe': return <p className="text-sm leading-relaxed">{previewData.localVibe}</p>;
      case 'food': return (
        <ul className="space-y-3">
          {previewData.streetFood?.map((item, index) => (
            <li key={index} className="text-sm">
              <strong className="text-orange-400">{item.name}:</strong> 
              <span className="ml-2">{item.description}</span>
            </li>
          ))}
        </ul>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white mt-[8vh]" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}>
      <div className="min-h-screen bg-black/20 backdrop-blur-sm p-4 sm:p-8">
        <header className="flex justify-between items-center mb-8">
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors absolute left-8 top-6 md:static top-0">
            <ArrowLeft size={20} /> Back to Dashboard
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold">Jharkhand Street Preview</h1>
            <p className="text-gray-400">Search and explore any location in Jharkhand</p>
          </div>
          <div className="w-40"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Search & Interactive Map */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <Search className="text-cyan-400" />
              <h2 className="text-2xl font-semibold">Search Locations</h2>
            </div>
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search for any place in Jharkhand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(searchSuggestions.length > 0)}
                  className="w-full p-4 pr-24 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!searchQuery.trim() || searchLoading}
                    className="p-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded-md transition-colors"
                  >
                    {searchLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Search size={16} />
                    )}
                  </button>
                </div>
              </form>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleLocationSelect(suggestion.name)}
                      className="w-full p-3 text-left hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0 flex items-start gap-3"
                    >
                      <MapPin size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">{suggestion.name}</div>
                        <div className="text-sm text-gray-400">
                          {suggestion.type} • {suggestion.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Access - Popular Locations */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Map size={18} className="text-cyan-400" />
                Popular Destinations
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularLocations.map(loc => (
                  <button
                    key={loc.name}
                    onClick={() => handleLocationSelect(loc.name)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                      selectedLocation === loc.name
                        ? 'bg-cyan-600 border-cyan-600 text-white'
                        : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-white'
                    }`}
                  >
                    {loc.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Map */}
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-gray-600">
              <img src={JharkhandMap} alt="Map of Jharkhand" className="w-full h-full object-contain bg-gray-800" />
              {popularLocations.map(loc => (
                <button
                  key={loc.name}
                  className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 group"
                  style={{ top: loc.top, left: loc.left }}
                  onClick={() => handleLocationSelect(loc.name)}
                  title={loc.name}
                >
                  <span className={`absolute inset-0 bg-cyan-400 rounded-full transition-all ${
                    selectedLocation === loc.name ? 'ring-4 ring-white scale-125' : 'group-hover:scale-110'
                  }`}></span>
                  <span className="absolute inset-0 bg-cyan-400 rounded-full animate-pulse"></span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Right Side: AI Generated Preview */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
            {loading ? (
              <div className="p-6 h-full flex flex-col">
                <div className="w-3/4 h-8 bg-gray-700 rounded-lg mb-6 animate-pulse"></div>
                <div className="w-full h-48 bg-gray-700 rounded-lg mb-6 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="w-full h-4 bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-1/2 h-4 bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            ) : error ? (
              <div className="p-6 h-full flex flex-col items-center justify-center text-center">
                <Search className="w-16 h-16 text-red-400 mb-4" />
                <h3 className="text-2xl font-bold text-red-400 mb-2">Location Not Found</h3>
                <p className="text-gray-300 mb-4">{error}</p>
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                >
                  Try Another Search
                </button>
              </div>
            ) : selectedLocation && previewData ? (
              <div className="flex flex-col h-full">
                <div className="p-6">
                  <h3 className="text-3xl font-bold">{previewData.locationName}</h3>
                  <p className="text-cyan-400 text-sm">Jharkhand, India</p>
                </div>
                
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  className="w-full h-56"
                >
                  {previewData.imageSearchKeywords?.map((keyword, index) => (
                    <SwiperSlide key={index}>
                      <img 
                        src={`https://source.unsplash.com/800x400/?${keyword.replace(/\s/g, '+')}`} 
                        alt={keyword} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.target.src = `https://source.unsplash.com/800x400/?jharkhand,india,${index}`;
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex border-b border-white/20 mb-4 overflow-x-auto">
                    {[
                      { id: 'preview', icon: Eye, label: 'Street View' },
                      { id: 'attractions', icon: Landmark, label: 'Attractions' },
                      { id: 'vibe', icon: Users, label: 'Local Vibe' },
                      { id: 'food', icon: Utensils, label: 'Food' },
                    ].map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                          activeTab === tab.id 
                            ? 'border-b-2 border-cyan-400 text-white' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <tab.icon size={16} /> {tab.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="text-gray-300 leading-relaxed overflow-y-auto flex-grow max-h-64 pr-2 custom-scrollbar">
                    {renderContent()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 h-full flex flex-col items-center justify-center text-center">
                <Search className="w-16 h-16 text-gray-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Discover Jharkhand</h3>
                <p className="text-gray-400 mb-4">Search for any location in Jharkhand to begin your virtual exploration</p>
                <div className="text-sm text-gray-500">
                  Try searching for: cities, towns, tourist spots, landmarks, or districts
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.7);
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default StreetPreview;
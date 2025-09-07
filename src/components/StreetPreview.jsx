import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Link } from "react-router-dom";
import { ArrowLeft, Map, Eye, Landmark, Utensils, Users, Search } from "lucide-react";

// Import Swiper for the image gallery
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import your map image
import JharkhandMap from '../assets/Jharkhand.png';
// ✨ FIX: Removed the import for the non-existent fallback-bg.jpg

// Get the API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// --- Data for Map Hotspots ---
const jharkhandLocations = [
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
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("preview");

  useEffect(() => {
    if (selectedLocation) {
      fetchStreetPreview(selectedLocation);
    }
  }, [selectedLocation]);

  const fetchStreetPreview = async (locationName) => {
    setLoading(true);
    setError("");
    setPreviewData(null);
    setActiveTab("preview");

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are a virtual tour guide for Jharkhand, India. A user has selected the city of '${locationName}'.
        Generate a virtual "Street Preview" for this location.
        Provide your response as a valid JSON object only. Do not include any text outside of the JSON object, including markdown tags.
        The JSON object should have the following structure:
        {
          "locationName": "${locationName}",
          "immersivePreview": "A vivid, first-person description of walking through a famous street or area in this location. Describe the sights, sounds, and smells to make the user feel like they are there.",
          "keyAttractions": [
            {"name": "Attraction 1", "description": "A brief, compelling description of a must-see place."},
            {"name": "Attraction 2", "description": "Another brief, compelling description."}
          ],
          "localVibe": "Describe the atmosphere and culture of the city. What are the people like? What is the pace of life? Is it modern, traditional, or a mix?",
          "streetFood": [
            {"name": "Food Item 1", "description": "A short description of a famous local street food and what makes it special."},
            {"name": "Food Item 2", "description": "Another short description of a local delight."}
          ],
          "imageSearchKeywords": ["${locationName} street", "${locationName} landmark", "${locationName} market", "${locationName} nature"]
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const data = JSON.parse(text);
      setPreviewData(data);

    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch preview. The AI might be busy, or the location is too obscure. Please try another place.");
    } finally {
      setLoading(false);
    }
  };
  
  const renderContent = () => {
    if (!previewData) return null;
    switch (activeTab) {
      case 'preview': return <p>{previewData.immersivePreview}</p>;
      case 'attractions': return (
        <ul className="space-y-4">
          {previewData.keyAttractions.map(item => <li key={item.name}><strong>{item.name}:</strong> {item.description}</li>)}
        </ul>
      );
      case 'vibe': return <p>{previewData.localVibe}</p>;
      case 'food': return (
        <ul className="space-y-4">
          {previewData.streetFood.map(item => <li key={item.name}><strong>{item.name}:</strong> {item.description}</li>)}
        </ul>
      );
      default: return null;
    }
  }

  return (
    // ✨ FIX: Replaced the image background with a CSS gradient style.
    <div className="min-h-screen bg-gray-900 text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}>
      <div className="min-h-screen bg-black/20 backdrop-blur-sm p-4 sm:p-8">
        <header className="flex justify-between items-center mb-8">
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <ArrowLeft size={20} /> Back to Dashboard
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold">Jharkhand Street Preview</h1>
            <p className="text-gray-400">Virtually explore your destination before you arrive</p>
          </div>
          <div className="w-40"></div> {/* Spacer */}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Interactive Map & Selector */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Map className="text-cyan-400" />
              <h2 className="text-2xl font-semibold">Select a Location</h2>
            </div>
            
            <select
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg mb-4 focus:ring-2 focus:ring-cyan-500"
              value={selectedLocation || ""}
            >
              <option value="" disabled>-- Choose from the list --</option>
              {jharkhandLocations.map(loc => <option key={loc.name} value={loc.name}>{loc.name}</option>)}
            </select>

            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
              <img src={JharkhandMap} alt="Map of Jharkhand" className="w-full h-full object-contain" />
              {jharkhandLocations.map(loc => (
                <button
                  key={loc.name}
                  className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2"
                  style={{ top: loc.top, left: loc.left }}
                  onClick={() => setSelectedLocation(loc.name)}
                  title={loc.name}
                >
                  <span className={`absolute inset-0 bg-cyan-400 rounded-full ${selectedLocation === loc.name ? 'ring-4 ring-white' : ''}`}></span>
                  <span className="absolute inset-0 bg-cyan-400 rounded-full animate-pulse-dot"></span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Right Side: AI Generated Preview */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
            {loading ? (
              <div className="p-6 h-full flex flex-col">
                <div className="w-3/4 h-8 rounded-lg mb-6 animate-skeleton"></div>
                <div className="w-full h-48 rounded-lg mb-6 animate-skeleton"></div>
                <div className="w-full h-4 rounded-lg mb-3 animate-skeleton"></div>
                <div className="w-full h-4 rounded-lg mb-3 animate-skeleton"></div>
                <div className="w-1/2 h-4 rounded-lg animate-skeleton"></div>
              </div>
            ) : error ? (
              <div className="p-6 h-full flex flex-col items-center justify-center text-center">
                <Search className="w-16 h-16 text-red-400 mb-4" />
                <h3 className="text-2xl font-bold text-red-400">Oops! Something went wrong.</h3>
                <p className="text-gray-300">{error}</p>
              </div>
            ) : selectedLocation && previewData ? (
              <div className="flex flex-col h-full">
                <div className="p-6">
                  <h3 className="text-3xl font-bold">{previewData.locationName}</h3>
                </div>
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  className="w-full h-56"
                >
                  {previewData.imageSearchKeywords.map((keyword, index) => (
                    <SwiperSlide key={index}>
                      <img src={`https://source.unsplash.com/400x300/?${keyword.replace(/\s/g, '+')}`} alt={keyword} className="w-full h-full object-cover" />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex border-b border-white/20 mb-4">
                    {[
                      { id: 'preview', icon: Eye, label: 'Preview' },
                      { id: 'attractions', icon: Landmark, label: 'Attractions' },
                      { id: 'vibe', icon: Users, label: 'Local Vibe' },
                      { id: 'food', icon: Utensils, label: 'Street Food' },
                    ].map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-cyan-400 text-white' : 'text-gray-400 hover:text-white'}`}
                      >
                        <tab.icon size={16} /> {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="text-gray-300 text-sm leading-relaxed overflow-y-auto flex-grow max-h-48 pr-2 custom-scrollbar">
                    {renderContent()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 h-full flex flex-col items-center justify-center text-center">
                <Search className="w-16 h-16 text-gray-500 mb-4" />
                <h3 className="text-2xl font-bold">Explore Jharkhand</h3>
                <p className="text-gray-400">Select a location on the map or from the list to begin your virtual journey.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreetPreview;
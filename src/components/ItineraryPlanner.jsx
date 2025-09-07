import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Plane,
  CircleHelp,
  Hourglass,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Heart,
  ArrowLeft,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";

// Get the API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ItineraryPlanner = () => {
  // State for form inputs
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [members, setMembers] = useState("");
  const [interests, setInterests] = useState([]);

  // State for API response and loading status
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const interestOptions = [
    {
      name: "History & Culture",
      icon: "🏛️",
      color: "from-amber-400 to-orange-500",
    },
    { name: "Geo-Tourism", icon: "🗻", color: "from-green-400 to-emerald-500" },
    {
      name: "Wildlife & Parks",
      icon: "🦁",
      color: "from-green-500 to-teal-500",
    },
    {
      name: "Adventure & Outdoors",
      icon: "🏔️",
      color: "from-blue-400 to-cyan-500",
    },
    { name: "Relaxation", icon: "🧘", color: "from-purple-400 to-pink-500" },
  ];

  const handleInterestChange = (interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const generateItinerary = async (e) => {
    e.preventDefault();
    if (!destination || !days || !budget || !members) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setLoading(true);
    setItinerary("");

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are an expert travel planner. Create a detailed and engaging travel itinerary based on the following user preferences.
        The output must be in well-structured Markdown format.

        **Travel Details:**
        - **Destination:** ${destination}
        - **Duration:** ${days} days
        - **Budget (per person, excluding flights):** Approximately $${budget} Rs.
        - **Number of Travelers:** ${members}
        - **Primary Interests:** ${interests.join(", ")}

        **Instructions for Your Response:**
        1.  **Overview:** Start with a brief, exciting summary of the trip.
        2.  **Day-by-Day Plan:** For each day, provide a clear heading (e.g., "Day 1: Arrival and Exploration").
        3.  **Activities:** Suggest 2-3 specific activities or sights for each day, including a mix of popular attractions and local gems.
        4.  **Food Recommendations:** For each day, suggest a type of local cuisine or a specific restaurant to try (e.g., "Lunch at a traditional trattoria").
        5.  **Budget Tips:** Weave in practical budget-friendly tips throughout the itinerary.
        6.  **Formatting:** Use Markdown extensively. Use bolding for emphasis, bullet points for lists, and create a clean, readable structure.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setItinerary(text);
    } catch (err) {
      console.error("API Error:", err);
      setError(
        "Failed to generate itinerary. Please check your API key and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image - Jharkhand Waterfall */}
      <div
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url('/background.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      />

      {/* ✨ FIX: Overlay opacity changed from bg-black/70 to bg-black/50 to make it less dim */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10"></div>

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-20">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-30 text-white min-h-screen">
        {/* Back button */}
        {/* <div className="absolute left-8 top-8 z-40">
          <Link
            to="/dashboard"
            className="group inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white rounded-full font-medium transition-all duration-300 border border-white/20 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Dashboard
          </Link>
        </div> */}
        <div className="absolute left-[3vw] top-[10vh]">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-teal-600 hover:text-teal-800 mb-6 font-medium transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="p-8 pt-20 min-h-screen">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-400 via-teal-500 to-blue-600 bg-clip-text text-transparent mb-4">
               ⁠AI Itinerary planner
            </h1>

            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Transform your travel dreams into perfectly crafted itineraries
              with the power of AI
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side: Form */}
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                <form onSubmit={generateItinerary} className="space-y-8">
                  {/* Destination Input */}
                  <div className="group">
                    <label className="flex items-center text-sm font-semibold text-gray-200 mb-3">
                      <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                      Where to?
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Paris, Tokyo, New York..."
                        required
                        className="w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Grid inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group">
                      <label className="flex items-center text-sm font-semibold text-gray-200 mb-3">
                        <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                        Days
                      </label>
                      <input
                        type="number"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        placeholder="7"
                        required
                        className="w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    <div className="group">
                      <label className="flex items-center text-sm font-semibold text-gray-200 mb-3">
                        <CreditCard className="w-4 h-4 mr-2 text-green-400" />
                        Budget (₹)
                      </label>
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="50000"
                        required
                        className="w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    <div className="group">
                      <label className="flex items-center text-sm font-semibold text-gray-200 mb-3">
                        <Users className="w-4 h-4 mr-2 text-purple-400" />
                        Travelers
                      </label>
                      <input
                        type="number"
                        value={members}
                        onChange={(e) => setMembers(e.target.value)}
                        placeholder="2"
                        required
                        className="w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-200 mb-4">
                      <Heart className="w-4 h-4 mr-2 text-red-400" />
                      What interests you?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {interestOptions.map((interest, index) => (
                        <button
                          type="button"
                          key={interest.name}
                          onClick={() => handleInterestChange(interest.name)}
                          className={`group relative p-4 rounded-2xl transition-all duration-500 border transform hover:scale-105 ${
                            interests.includes(interest.name)
                              ? `bg-gradient-to-r ${interest.color} border-transparent shadow-lg shadow-blue-500/25`
                              : "bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10"
                          }`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                              {interest.icon}
                            </span>
                            <span className="font-medium text-sm">
                              {interest.name}
                            </span>
                          </div>
                          {interests.includes(interest.name) && (
                            <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 hover:from-blue-700 hover:via-green-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl hover:shadow-blue-500/25"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      {loading ? (
                        <Hourglass className="animate-spin w-6 h-6" />
                      ) : (
                        <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                      )}
                      <span className="text-lg">
                        {loading
                          ? "Crafting your journey..."
                          : "Generate Itinerary"}
                      </span>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </button>

                  {error && (
                    <div className="bg-red-500/10 backdrop-blur-lg border border-red-500/20 rounded-2xl p-4">
                      <p className="text-red-300 text-center font-medium">
                        {error}
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Right Side: Display Itinerary */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Your Journey Awaits
                </h2>
              </div>

              <div className="h-[580px] p-6">
                {loading && (
                  <div className="flex flex-col items-center justify-center h-full space-y-6">
                    <div className="relative">
                      <Plane className="w-16 h-16 text-blue-400 animate-bounce" />
                      <div className="absolute inset-0 w-16 h-16 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-xl font-semibold text-gray-200">
                        Planning your adventure
                      </p>
                      <p className="text-gray-400">
                        This might take a moment...
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 200}ms` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}

                {!loading && !itinerary && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                    <div className="relative">
                      <CircleHelp className="w-16 h-16 text-gray-400" />
                      <div className="absolute inset-0 w-16 h-16 border-4 border-gray-400 rounded-full animate-spin border-t-transparent"></div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-gray-300">
                        Ready to explore?
                      </p>
                      <p className="text-gray-400 max-w-md">
                        Fill in your travel details and let AI create the
                        perfect itinerary for you
                      </p>
                    </div>
                  </div>
                )}

                {itinerary && (
                  <div
                    className="h-full overflow-y-scroll pr-4"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "rgba(59, 130, 246, 0.5) transparent",
                    }}
                  >
                    <style jsx>{`
                      .prose-container::-webkit-scrollbar {
                        width: 8px;
                      }
                      .prose-container::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 4px;
                      }
                      .prose-container::-webkit-scrollbar-thumb {
                        background: rgba(59, 130, 246, 0.5);
                        border-radius: 4px;
                      }
                      .prose-container::-webkit-scrollbar-thumb:hover {
                        background: rgba(59, 130, 246, 0.7);
                      }
                    `}</style>
                    <div className="prose-container bg-gradient-to-r from-blue-500/10 to-green-500/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-2xl font-bold text-blue-200 mb-4 border-b border-blue-500/30 pb-2">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-xl font-semibold text-green-200 mb-3 mt-6 border-l-4 border-green-500/50 pl-4">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-lg font-medium text-purple-200 mb-2 mt-4">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => (
                              <p className="text-gray-200 mb-4 leading-relaxed text-sm">
                                {children}
                              </p>
                            ),
                            ul: ({ children }) => (
                              <ul className="space-y-2 mb-4 ml-4">
                                {children}
                              </ul>
                            ),
                            li: ({ children }) => (
                              <li className="text-gray-200 flex items-start text-sm">
                                <span className="text-blue-400 mr-2 mt-1 text-xs">
                                  •
                                </span>
                                <span className="flex-1">{children}</span>
                              </li>
                            ),
                            strong: ({ children }) => (
                              <strong className="text-yellow-300 font-semibold">
                                {children}
                              </strong>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-blue-500/50 pl-4 italic text-gray-300 bg-white/5 rounded-r-lg p-3 my-4">
                                {children}
                              </blockquote>
                            ),
                            code: ({ children }) => (
                              <code className="bg-white/10 px-2 py-1 rounded text-blue-200 text-sm">
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {itinerary}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ItineraryPlanner;

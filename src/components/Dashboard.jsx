import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 p-4 absolute top-[8vh] w-full max-h-[92vh]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-200/50">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              🎉 Ready for Your Next Adventure?
            </h2>
            <p className="text-slate-600 mb-6 text-lg">
              Your AI-powered travel planning journey starts here. Let's create unforgettable experiences tailored just for you.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-teal-700 transition shadow-lg">
              Start Planning Your Trip ✈️
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-teal-200/50">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Your Travel Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Trips Planned</span>
                <span className="font-bold text-blue-600">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Destinations Saved</span>
                <span className="font-bold text-teal-600">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">AI Recommendations</span>
                <span className="font-bold text-orange-600">Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="font-bold text-blue-700 mb-2 text-xl">Smart Itinerary</h3>
            <p className="text-blue-600 mb-4">Create personalized travel plans with AI assistance</p>
            <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold">
              Plan Now
            </button>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 shadow-lg border border-teal-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="font-bold text-teal-700 mb-2 text-xl">AI Assistant</h3>
            <p className="text-teal-600 mb-4">Get instant travel advice and recommendations</p>
            <button className="w-full bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 transition font-semibold">
              Chat Now
            </button>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">🏖️</div>
            <h3 className="font-bold text-orange-700 mb-2 text-xl">Explore</h3>
            <p className="text-orange-600 mb-4">Discover amazing destinations and hidden gems</p>
            <button className="w-full bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 transition font-semibold">
              Explore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

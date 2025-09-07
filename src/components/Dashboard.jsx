import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  // Array of features with their corresponding routes
  const features = [
    {
      icon: "🗺️",
      title: "AI Itinerary Planner",
      description: "Craft your perfect trip with intelligent suggestions.",
      buttonText: "Plan Now",
      route: "/planner", // Example route
      theme: {
        from: "from-blue-50",
        to: "to-blue-100",
        border: "border-blue-200",
        titleText: "text-blue-700",
        descText: "text-blue-600",
        buttonBg: "bg-blue-600",
        buttonHover: "hover:bg-blue-700",
      },
    },
    {
      icon: "🏨",
      title: "Hotel Booking",
      description: "Find and book the best stays for your journey.",
      buttonText: "Book a Stay",
      route: "/hotelbooking", // This will navigate to your HotelBooking page
      theme: {
        from: "from-indigo-50",
        to: "to-indigo-100",
        border: "border-indigo-200",
        titleText: "text-indigo-700",
        descText: "text-indigo-600",
        buttonBg: "bg-indigo-600",
        buttonHover: "hover:bg-indigo-700",
      },
    },
    {
      icon: "✈️",
      title: "Transportation",
      description: "Arrange flights, trains, and car rentals with ease.",
      buttonText: "Get Moving",
      route: "/transportation", // Example route
      theme: {
        from: "from-sky-50",
        to: "to-sky-100",
        border: "border-sky-200",
        titleText: "text-sky-700",
        descText: "text-sky-600",
        buttonBg: "bg-sky-600",
        buttonHover: "hover:bg-sky-700",
      },
    },
    {
      icon: "🏘️",
      title: "Street Preview",
      description: "Virtually explore your destination before you arrive.",
      buttonText: "Start Exploring",
      route: "/streetpreview",
      // No route specified for this one, so the button will be disabled
      theme: {
        from: "from-teal-50",
        to: "to-teal-100",
        border: "border-teal-200",
        titleText: "text-teal-700",
        descText: "text-teal-600",
        buttonBg: "bg-teal-600",
        buttonHover: "hover:bg-teal-700",
      },
    },
    {
      icon: "⭐",
      title: "Feedback",
      description: "Share your travel experiences to help others.",
      buttonText: "Leave Review",
      route: "/feedback", // Example route
      theme: {
        from: "from-amber-50",
        to: "to-amber-100",
        border: "border-amber-200",
        titleText: "text-amber-700",
        descText: "text-amber-600",
        buttonBg: "bg-amber-600",
        buttonHover: "hover:bg-amber-700",
      },
    },
    {
      icon: "🛍️",
      title: "Marketplace",
      description: "Shop for travel essentials and local goods.",
      buttonText: "Go Shopping",
      // No route specified
      theme: {
        from: "from-rose-50",
        to: "to-rose-100",
        border: "border-rose-200",
        titleText: "text-rose-700",
        descText: "text-rose-600",
        buttonBg: "bg-rose-600",
        buttonHover: "hover:bg-rose-700",
      },
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 p-4 absolute top-[8vh] w-full max-h-[92vh] overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Welcome Card */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-200/50">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              🎉 Ready for Your Next Adventure,{" "}
              {user ? user.displayName?.split(" ")[0] : "Explorer"}?
            </h2>
            <p className="text-slate-600 mb-6 text-lg">
              Your AI-powered travel planning journey starts here. Let's create
              unforgettable experiences tailored just for you.
            </p>
            <Link to="/planner">
              <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-teal-700 transition shadow-lg">
                Start Planning Your Trip ✈️
              </button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-teal-200/50">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Your Travel Stats
            </h3>
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
                <span className="text-slate-600">Bookings Made</span>
                <span className="font-bold text-indigo-600">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${feature.theme.from} ${feature.theme.to} rounded-2xl p-6 shadow-lg border ${feature.theme.border} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3
                className={`font-bold ${feature.theme.titleText} mb-2 text-xl`}
              >
                {feature.title}
              </h3>
              <p className={`${feature.theme.descText} mb-4 flex-grow`}>
                {feature.description}
              </p>
              <button
                onClick={() => {
                  if (feature.route) {
                    navigate(feature.route);
                  }
                }}
                disabled={!feature.route}
                className={`w-full ${feature.theme.buttonBg} text-white py-3 rounded-xl ${feature.theme.buttonHover} transition font-semibold mt-auto disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {feature.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// // src/App.jsx

// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "./firebase";

// // Import your page and component files
// import Welcome from "./pages/Welcome";
// import Login from "./pages/Login";
// import SignUp from "./pages/Signup";
// import Dashboard from "./components/Dashboard";
// import Navbar from "./components/Navbar";
// import HotelBooking from "./components/HotelBooking";
// import Transportation from './components/Transportation';

// // Loading component for a better user experience
// const Loading = () => (
//   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
//     <div className="text-center">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//       <p className="text-slate-600 font-medium">Loading your adventure...</p>
//     </div>
//   </div>
// );

// // Error component for Firebase errors
// const ErrorComponent = ({ error }) => (
//   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
//     <div className="text-center max-w-md mx-auto p-6">
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 shadow-lg">
//         <strong className="font-bold">🚨 Authentication Error!</strong>
//         <span className="block sm:inline mt-2"> {error.message}</span>
//       </div>
//       <div className="space-y-3">
//         <button
//           onClick={() => window.location.reload()}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
//         >
//           🔄 Retry
//         </button>
//         <p className="text-slate-500 text-sm">
//           If the problem persists, please check your internet connection.
//         </p>
//       </div>
//     </div>
//   </div>
// );

// // Protected Route: Only allows access if the user is authenticated
// const ProtectedRoute = ({ children }) => {
//   const [user, loading, error] = useAuthState(auth);

//   if (loading) {
//     return <Loading />;
//   }

//   if (error) {
//     return <ErrorComponent error={error} />;
//   }

//   return user ? children : <Navigate to="/login" replace />;
// };

// // Public Route: Redirects to dashboard if the user is already authenticated
// const PublicRoute = ({ children }) => {
//   const [user, loading, error] = useAuthState(auth);

//   if (loading) {
//     return <Loading />;
//   }

//   if (error) {
//     return <ErrorComponent error={error} />;
//   }

//   return !user ? children : <Navigate to="/dashboard" replace />;
// };

// // Layout wrapper for pages that should have navbar
// const LayoutWithNavbar = ({ children }) => {
//   return (
//     <>
//       <Navbar />
//       <div className="pt-16">{children}</div>
//     </>
//   );
// };

// // Layout wrapper for auth pages (no navbar)
// const AuthLayout = ({ children }) => {
//   return <div className="min-h-screen">{children}</div>;
// };


import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

// Import your page and component files
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import HotelBooking from "./components/HotelBooking";
import Transportation from './components/Transportation';
import ItineraryPlanner from "./components/ItineraryPlanner";
import StreetPreview from "./components/StreetPreview";
import Marketplace from "./components/Marketplace";

// --- Helper Components (No changes needed here) ---

// Loading component for a better user experience
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    <p className="ml-4 text-gray-600">Loading...</p>
  </div>
);

// Error component for Firebase errors
const ErrorComponent = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-red-50">
    <div className="text-center p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold text-red-700">Authentication Error</h2>
      <p className="text-gray-600 mt-2">{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

// Protected Route: Only allows access if the user is authenticated
const ProtectedRoute = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <Loading />;
  if (error) return <ErrorComponent error={error} />;
  return user ? children : <Navigate to="/login" replace />;
};

// Public Route: Redirects to dashboard if the user is already authenticated
const PublicRoute = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <Loading />;
  if (error) return <ErrorComponent error={error} />;
  return !user ? children : <Navigate to="/dashboard" replace />;
};

// Layout wrapper for pages that should have a navbar
const LayoutWithNavbar = ({ children }) => (
  <>
    <Navbar />
    <main className="pt-16"> {/* Add padding to prevent content from hiding under the fixed navbar */}
      {children}
    </main>
  </>
);


function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        {/* Welcome page - accessible to all, shows navbar */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/hotelbooking" element={<HotelBooking />} />
        <Route path="/hotelbooking" element={<HotelBooking />} />
        <Route path="/transportation" element={<Transportation />} />
        <Route path="/planner" element={<ItineraryPlanner />} />
        <Route path="/streetpreview" element={<StreetPreview />} />
        <Route path="/marketplace" element={<Marketplace />} />


        {/* Fallback route to redirect any invalid URL */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </div>
  );
}

export default App;

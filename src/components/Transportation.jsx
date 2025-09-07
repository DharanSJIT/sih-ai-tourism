import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plane,
  Train,
  Car,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Clock,
  Star,
  AlertCircle,
} from "lucide-react";

// --- CONFIG & CONSTANTS ---
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

// Extended IATA code mapping with popular airports
const AIRPORT_CODES = {
  // US Major Cities
  "NEW YORK": "JFK",
  NYC: "JFK",
  MANHATTAN: "LGA",
  "LOS ANGELES": "LAX",
  LA: "LAX",
  HOLLYWOOD: "LAX",
  CHICAGO: "ORD",
  MIAMI: "MIA",
  BOSTON: "BOS",
  "SAN FRANCISCO": "SFO",
  SF: "SFO",
  SEATTLE: "SEA",
  "LAS VEGAS": "LAS",
  VEGAS: "LAS",
  ATLANTA: "ATL",
  DENVER: "DEN",
  PHOENIX: "PHX",
  DETROIT: "DTW",
  WASHINGTON: "DCA",
  DC: "DCA",

  // International
  LONDON: "LHR",
  PARIS: "CDG",
  TOKYO: "NRT",
  DUBAI: "DXB",
  SINGAPORE: "SIN",
  "HONG KONG": "HKG",
  AMSTERDAM: "AMS",
  FRANKFURT: "FRA",
  ROME: "FCO",
  MADRID: "MAD",
  BARCELONA: "BCN",
  BERLIN: "BER",
  ZURICH: "ZUR",
  VIENNA: "VIE",
  ISTANBUL: "IST",

  // Indian Cities
  MUMBAI: "BOM",
  DELHI: "DEL",
  "NEW DELHI": "DEL",
  BANGALORE: "BLR",
  BENGALURU: "BLR",
  CHENNAI: "MAA",
  KOLKATA: "CCU",
  CALCUTTA: "CCU",
  HYDERABAD: "HYD",
  PUNE: "PNQ",
  AHMEDABAD: "AMD",
  GOA: "GOI",
  KOCHI: "COK",
  COCHIN: "COK",
  THIRUVANANTHAPURAM: "TRV",

  // Alternative API endpoints for testing
  TEST: "JFK",
  DEMO: "LAX",
};

// Valid IATA codes for validation
const VALID_IATA_CODES = new Set([
  "JFK",
  "LAX",
  "ORD",
  "DFW",
  "DEN",
  "LAS",
  "PHX",
  "MIA",
  "SEA",
  "BOS",
  "SFO",
  "LGA",
  "EWR",
  "ATL",
  "IAH",
  "MSP",
  "DTW",
  "PHL",
  "LHR",
  "CDG",
  "AMS",
  "FRA",
  "MAD",
  "FCO",
  "ZUR",
  "VIE",
  "ARN",
  "CPH",
  "OSL",
  "HEL",
  "NRT",
  "ICN",
  "PVG",
  "HKG",
  "SIN",
  "BKK",
  "KUL",
  "DXB",
  "DOH",
  "BOM",
  "DEL",
  "BLR",
  "MAA",
  "CCU",
  "HYD",
  "PNQ",
  "AMD",
  "GOI",
  "COK",
  "TRV",
]);

const API_CONFIG = {
  // Primary flight API (Booking.com)
  flights: {
    host: "booking-com.p.rapidapi.com",
    endpoint: "https://booking-com.p.rapidapi.com/v1/flights/search",
  },
  // Alternative flight API (Skyscanner)
  alternativeFlights: {
    host: "skyscanner44.p.rapidapi.com",
    endpoint: "https://skyscanner44.p.rapidapi.com/search",
  },
  cars: {
    host: "booking-com.p.rapidapi.com",
    locationsEndpoint: "https://booking-com.p.rapidapi.com/v1/cars/locations",
    searchEndpoint: "https://booking-com.p.rapidapi.com/v1/cars/search",
  },
};

// --- UTILITY FUNCTIONS ---
const normalizeAirportCode = (input) => {
  if (!input) return "";
  const upperInput = input.toUpperCase().trim();

  // If it's already a 3-letter IATA code
  if (/^[A-Z]{3}$/.test(upperInput) && VALID_IATA_CODES.has(upperInput)) {
    return upperInput;
  }

  // Check city name mapping
  if (AIRPORT_CODES[upperInput]) {
    return AIRPORT_CODES[upperInput];
  }

  // Try partial matches
  for (const [city, code] of Object.entries(AIRPORT_CODES)) {
    if (city.includes(upperInput) || upperInput.includes(city)) {
      return code;
    }
  }

  return upperInput;
};

const validateAirportCode = (code) => {
  if (!code) return false;
  const normalizedCode = normalizeAirportCode(code);
  return VALID_IATA_CODES.has(normalizedCode);
};

const formatDateForAPI = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // YYYY-MM-DD format
};

const validateSearchParams = (type, params) => {
  const errors = [];

  switch (type) {
    case "flights":
      if (!params.from?.trim()) {
        errors.push("Departure airport is required");
      } else if (!validateAirportCode(params.from)) {
        errors.push(
          `Invalid departure airport code: "${params.from}". Try codes like JFK, LAX, LHR`
        );
      }

      if (!params.to?.trim()) {
        errors.push("Destination airport is required");
      } else if (!validateAirportCode(params.to)) {
        errors.push(
          `Invalid destination airport code: "${params.to}". Try codes like JFK, LAX, LHR`
        );
      }

      if (!params.date) {
        errors.push("Departure date is required");
      } else {
        const selectedDate = new Date(params.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
          errors.push("Departure date cannot be in the past");
        }

        // Check if date is too far in the future (most APIs limit to ~330 days)
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 330);
        if (selectedDate > maxDate) {
          errors.push("Departure date is too far in the future");
        }
      }

      if (
        params.from &&
        params.to &&
        normalizeAirportCode(params.from) === normalizeAirportCode(params.to)
      ) {
        errors.push("Departure and destination airports cannot be the same");
      }
      break;

    case "cars":
      if (!params.location?.trim()) errors.push("Pickup location is required");
      if (!params.pickupDate) errors.push("Pickup date is required");
      if (!params.dropoffDate) errors.push("Drop-off date is required");

      if (params.pickupDate && params.dropoffDate) {
        const pickup = new Date(params.pickupDate);
        const dropoff = new Date(params.dropoffDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (pickup < today) errors.push("Pickup date cannot be in the past");
        if (dropoff <= pickup)
          errors.push("Drop-off date must be after pickup date");
      }
      break;

    case "trains":
      if (!params.from?.trim()) errors.push("Departure station is required");
      if (!params.to?.trim()) errors.push("Destination station is required");
      if (!params.date) errors.push("Journey date is required");
      else if (new Date(params.date) < new Date().setHours(0, 0, 0, 0)) {
        errors.push("Journey date cannot be in the past");
      }
      break;
  }

  return errors;
};

// --- UI SUB-COMPONENTS ---
const FormInput = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  min,
  error,
  suggestions = [],
}) => (
  <div className="relative">
    <label className="block text-sm font-medium text-white/90 mb-2">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        className={`w-full ${
          Icon ? "pl-10" : "pl-4"
        } pr-4 py-3 bg-black/30 backdrop-blur-sm border ${
          error ? "border-red-400/50" : "border-white/20"
        } rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-400/50" : "focus:ring-blue-400/50"
        } focus:border-transparent transition-all duration-300`}
        list={suggestions.length > 0 ? `${label}-suggestions` : undefined}
      />
      {suggestions.length > 0 && (
        <datalist id={`${label}-suggestions`}>
          {suggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      )}
    </div>
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    {!error && suggestions.length > 0 && (
      <p className="text-white/50 text-xs mt-1">
        Popular: {suggestions.slice(0, 3).join(", ")}
      </p>
    )}
  </div>
);

const ResultCard = ({ result, type }) => {
  const ICONS = {
    flight: <Plane className="w-5 h-5 text-blue-400" />,
    car: <Car className="w-5 h-5 text-yellow-400" />,
    train: <Train className="w-5 h-5 text-green-400" />,
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-[1.02] group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
            {ICONS[type]}
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">
              {result.mainInfo}
            </h3>
            <p className="text-white/70 text-sm">{result.subInfo}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <p className="text-xl font-bold text-white">{result.price}</p>
          {result.rating && (
            <div className="flex items-center justify-end space-x-1 mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white/70 text-sm">{result.rating}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-white/70">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{result.timeInfo}</span>
          </div>
        </div>
        <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all duration-300 text-white font-medium transform hover:scale-105">
          Book
        </button>
      </div>
    </div>
  );
};

const ErrorMessage = ({ message }) => (
  <div className="flex items-center space-x-2 mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
    <AlertCircle className="w-5 h-5 flex-shrink-0" />
    <span>{message}</span>
  </div>
);

const SearchCard = ({
  type,
  title,
  subtitle,
  query,
  setQuery,
  onSearch,
  loading,
  error,
  today,
  airportSuggestions,
}) => {
  const ICONS = { flights: Plane, trains: Train, cars: Car };
  const COLORS = { flights: "blue", trains: "green", cars: "yellow" };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
      <div className="flex items-center mb-6">
        <div className={`p-3 bg-${COLORS[type]}-500/20 rounded-xl`}>
          {React.createElement(ICONS[type], {
            className: `text-3xl text-${COLORS[type]}-400 w-8 h-8`,
          })}
        </div>
        <div className="ml-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-white/70">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-6">
        {type === "flights" && (
          <>
            <FormInput
              label="From"
              type="text"
              value={query.from}
              onChange={(e) => setQuery({ ...query, from: e.target.value })}
              placeholder="Enter airport code or city (e.g., JFK, New York)"
              icon={MapPin}
              suggestions={airportSuggestions}
            />
            <FormInput
              label="To"
              type="text"
              value={query.to}
              onChange={(e) => setQuery({ ...query, to: e.target.value })}
              placeholder="Enter airport code or city (e.g., LAX, Los Angeles)"
              icon={MapPin}
              suggestions={airportSuggestions}
            />
            <FormInput
              label="Departure Date"
              type="date"
              value={query.date}
              onChange={(e) => setQuery({ ...query, date: e.target.value })}
              icon={Calendar}
              min={today}
            />
          </>
        )}

        {type === "trains" && (
          <>
            <FormInput
              label="From Station"
              type="text"
              value={query.from}
              onChange={(e) => setQuery({ ...query, from: e.target.value })}
              placeholder="e.g., Mumbai CST, New Delhi"
              icon={MapPin}
            />
            <FormInput
              label="To Station"
              type="text"
              value={query.to}
              onChange={(e) => setQuery({ ...query, to: e.target.value })}
              placeholder="e.g., Chennai Central, Bangalore"
              icon={MapPin}
            />
            <FormInput
              label="Journey Date"
              type="date"
              value={query.date}
              onChange={(e) => setQuery({ ...query, date: e.target.value })}
              icon={Calendar}
              min={today}
            />
          </>
        )}

        {type === "cars" && (
          <>
            <FormInput
              label="Pickup Location"
              type="text"
              value={query.location}
              onChange={(e) => setQuery({ ...query, location: e.target.value })}
              placeholder="City or Airport (e.g., Mumbai, JFK Airport)"
              icon={MapPin}
            />
            <FormInput
              label="Pickup Date"
              type="date"
              value={query.pickupDate}
              onChange={(e) =>
                setQuery({ ...query, pickupDate: e.target.value })
              }
              icon={Calendar}
              min={today}
            />
            <FormInput
              label="Drop-off Date"
              type="date"
              value={query.dropoffDate}
              onChange={(e) =>
                setQuery({ ...query, dropoffDate: e.target.value })
              }
              icon={Calendar}
              min={query.pickupDate || today}
            />
          </>
        )}

        {error && <ErrorMessage message={error} />}

        <button
          onClick={onSearch}
          disabled={loading}
          className={`w-full bg-gradient-to-r from-${COLORS[type]}-500 to-${COLORS[type]}-600 hover:from-${COLORS[type]}-600 hover:to-${COLORS[type]}-700 font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Search {title}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// --- MAIN TRANSPORTATION COMPONENT ---
const Transportation = () => {
  // --- STATE MANAGEMENT ---
  const [flightQuery, setFlightQuery] = useState({
    from: "",
    to: "",
    date: "",
  });
  const [carQuery, setCarQuery] = useState({
    location: "",
    pickupDate: "",
    dropoffDate: "",
  });
  const [trainQuery, setTrainQuery] = useState({ from: "", to: "", date: "" });

  const [results, setResults] = useState({ flights: [], cars: [], trains: [] });
  const [loading, setLoading] = useState({
    flights: false,
    cars: false,
    trains: false,
  });
  const [error, setError] = useState({
    flights: null,
    cars: null,
    trains: null,
  });

  const [activeTab, setActiveTab] = useState("flights");
  const [showResults, setShowResults] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Popular airport suggestions
  const airportSuggestions = [
    "JFK",
    "LAX",
    "LHR",
    "CDG",
    "DXB",
    "BOM",
    "DEL",
    "SIN",
    "NRT",
    "FRA",
  ];

  // --- API & DATA LOGIC ---
  const handleSearch = async (type) => {
    // Clear previous errors
    setError((prev) => ({ ...prev, [type]: null }));

    // Get current query
    let currentQuery;
    switch (type) {
      case "flights":
        currentQuery = flightQuery;
        break;
      case "cars":
        currentQuery = carQuery;
        break;
      case "trains":
        currentQuery = trainQuery;
        break;
    }

    // Validate input
    const validationErrors = validateSearchParams(type, currentQuery);
    if (validationErrors.length > 0) {
      setError((prev) => ({
        ...prev,
        [type]: validationErrors.join(". ") + ".",
      }));
      return;
    }

    setShowResults(true);
    setActiveTab(type);
    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      let data = [];

      if (type === "flights") {
        data = await searchFlightsWithFallback(currentQuery);
      } else if (type === "cars") {
        data = await searchCarsAPI(currentQuery);
      } else if (type === "trains") {
        data = await searchTrainsMock(currentQuery);
      }

      setResults((prev) => ({ ...prev, [type]: data }));
    } catch (err) {
      console.error(`Search error for ${type}:`, err);

      let errorMessage = `Failed to search ${type}. `;

      if (err.message.includes("422")) {
        errorMessage +=
          "The search parameters are invalid. Please check your airport codes and dates.";
      } else if (err.message.includes("401") || err.message.includes("403")) {
        errorMessage +=
          "Authentication failed. Please check the API configuration.";
      } else if (err.message.includes("429")) {
        errorMessage +=
          "Too many requests. Please wait a moment and try again.";
      } else if (
        err.message.includes("network") ||
        err.message.includes("fetch")
      ) {
        errorMessage +=
          "Network connection error. Please check your internet connection.";
      } else {
        errorMessage += err.message || "Please try again later.";
      }

      setError((prev) => ({ ...prev, [type]: errorMessage }));
      setResults((prev) => ({ ...prev, [type]: [] }));
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  // Enhanced flight search with fallback to mock data
  const searchFlightsWithFallback = async ({ from, to, date }) => {
    const fromCode = normalizeAirportCode(from);
    const toCode = normalizeAirportCode(to);

    console.log(`Searching flights: ${fromCode} → ${toCode} on ${date}`);

    // Try real API first
    if (RAPIDAPI_KEY && RAPIDAPI_KEY !== "your_rapidapi_key_here") {
      try {
        return await searchFlightsAPI({ from: fromCode, to: toCode, date });
      } catch (apiError) {
        console.warn(
          "Primary flight API failed, falling back to mock data:",
          apiError.message
        );
        // Fall back to mock data
        return await searchFlightsMock({ from: fromCode, to: toCode, date });
      }
    } else {
      console.info("No API key configured, using mock flight data");
      return await searchFlightsMock({ from: fromCode, to: toCode, date });
    }
  };

  const searchFlightsAPI = async ({ from, to, date }) => {
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === "your_rapidapi_key_here") {
      throw new Error("API key is not configured properly");
    }

    const fromCode = normalizeAirportCode(from);
    const toCode = normalizeAirportCode(to);
    const formattedDate = formatDateForAPI(date);

    // Validate normalized codes
    if (!VALID_IATA_CODES.has(fromCode)) {
      throw new Error(`Invalid departure airport code: ${fromCode}`);
    }
    if (!VALID_IATA_CODES.has(toCode)) {
      throw new Error(`Invalid destination airport code: ${toCode}`);
    }

    const params = new URLSearchParams({
      from_airport_iata: fromCode,
      to_airport_iata: toCode,
      departure_date: formattedDate,
      number_of_adults: "1",
      locale: "en-us",
      currency: "USD",
    });

    console.log(
      "Flight API request:",
      `${API_CONFIG.flights.endpoint}?${params}`
    );

    const response = await fetch(`${API_CONFIG.flights.endpoint}?${params}`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": API_CONFIG.flights.host,
        Accept: "application/json",
      },
    });

    console.log("Flight API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Flight API error response:", errorText);

      if (response.status === 422) {
        throw new Error(
          `Invalid search parameters for route ${fromCode} → ${toCode}. This route might not be available or the date format is incorrect.`
        );
      } else if (response.status === 401 || response.status === 403) {
        throw new Error(
          "API authentication failed. Please check your RapidAPI key."
        );
      } else if (response.status === 429) {
        throw new Error(
          "API rate limit exceeded. Please try again in a few minutes."
        );
      } else {
        throw new Error(
          `Flight search failed (HTTP ${response.status}). Please try again later.`
        );
      }
    }

    const data = await response.json();
    console.log("Flight API response data:", data);

    if (!data || (!data.flights && !data.data && !data.results)) {
      console.warn("No flights found in API response");
      return [];
    }

    const flights = data.flights || data.data || data.results || [];

    return flights.slice(0, 10).map((flight, index) => {
      const mainLeg = flight.legs?.[0] || flight;

      return {
        id: flight.flight_key || flight.id || `flight-${index}`,
        mainInfo: `${mainLeg.origin?.code || fromCode} → ${
          mainLeg.destination?.code || toCode
        }`,
        subInfo:
          mainLeg.operating_carrier?.name || mainLeg.airline || "Airline",
        timeInfo: mainLeg.duration_minutes
          ? `${Math.floor(mainLeg.duration_minutes / 60)}h ${
              mainLeg.duration_minutes % 60
            }m`
          : mainLeg.duration ||
            `${2 + Math.floor(Math.random() * 10)}h ${Math.floor(
              Math.random() * 60
            )}m`,
        price:
          flight.price_details?.display_price_formatted ||
          flight.price ||
          `$${Math.floor(Math.random() * 800) + 200}`,
        rating: flight.rating || (4.0 + Math.random()).toFixed(1),
      };
    });
  };

  // Mock flight data for testing and fallback
  const searchFlightsMock = async ({ from, to, date }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockFlights = [
          {
            id: "flight-1",
            mainInfo: `${from} → ${to}`,
            subInfo: "Emirates",
            timeInfo: "8h 30m",
            price: "$649",
            rating: "4.5",
          },
          {
            id: "flight-2",
            mainInfo: `${from} → ${to}`,
            subInfo: "American Airlines",
            timeInfo: "6h 45m",
            price: "$589",
            rating: "4.2",
          },
          {
            id: "flight-3",
            mainInfo: `${from} → ${to}`,
            subInfo: "Delta Airlines",
            timeInfo: "7h 15m",
            price: "$723",
            rating: "4.3",
          },
          {
            id: "flight-4",
            mainInfo: `${from} → ${to}`,
            subInfo: "United Airlines",
            timeInfo: "9h 20m",
            price: "$456",
            rating: "4.0",
          },
        ];

        resolve(mockFlights);
      }, 2000);
    });
  };

  const searchCarsAPI = async ({ location, pickupDate, dropoffDate }) => {
    // Mock car rental data for now
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockCars = [
          {
            id: "car-1",
            mainInfo: "Toyota Camry",
            subInfo: "Standard • Hertz",
            timeInfo: "Flexible pickup",
            price: "$45/day",
            rating: "4.3",
          },
          {
            id: "car-2",
            mainInfo: "BMW 3 Series",
            subInfo: "Luxury • Avis",
            timeInfo: "Flexible pickup",
            price: "$89/day",
            rating: "4.6",
          },
          {
            id: "car-3",
            mainInfo: "Honda CR-V",
            subInfo: "SUV • Enterprise",
            timeInfo: "Flexible pickup",
            price: "$67/day",
            rating: "4.4",
          },
        ];

        resolve(mockCars);
      }, 1500);
    });
  };

  const searchTrainsMock = ({ from, to, date }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockTrains = [
          {
            id: "train-1",
            mainInfo: "12952 - Mumbai Rajdhani",
            subInfo: "16:55 - 08:35 • 15h 40m",
            timeInfo: "RAC 12",
            price: "₹2,580",
            rating: "4.2",
          },
          {
            id: "train-2",
            mainInfo: "12138 - Punjab Mail",
            subInfo: "20:10 - 21:30 • 25h 20m",
            timeInfo: "Confirmed",
            price: "₹1,200",
            rating: "3.8",
          },
        ];

        resolve(mockTrains);
      }, 1500);
    });
  };

  const resetSearch = () => {
    setShowResults(false);
    setError({ flights: null, cars: null, trains: null });
    setResults({ flights: [], cars: [], trains: [] });
  };

  // --- RENDER ---
  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)",
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-32 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12 pt-[7vh]">
            <h1 className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Journey Awaits
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
              Seamless booking for flights, trains, and car rentals with
              intelligent search.
            </p>
            {!RAPIDAPI_KEY && (
              <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-200 max-w-2xl mx-auto">
                <p className="text-sm">
                  Demo Mode: Using sample data. Add VITE_RAPIDAPI_KEY to your
                  .env file for live results.
                </p>
              </div>
            )}
          </header>

          {/* Main Content */}
          {!showResults ? (
            /* Search Cards */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <SearchCard
                type="flights"
                title="Flights"
                subtitle="Worldwide destinations"
                query={flightQuery}
                setQuery={setFlightQuery}
                onSearch={() => handleSearch("flights")}
                loading={loading.flights}
                error={error.flights}
                today={today}
                airportSuggestions={airportSuggestions}
              />
              <SearchCard
                type="trains"
                title="Trains"
                subtitle="Indian Railways"
                query={trainQuery}
                setQuery={setTrainQuery}
                onSearch={() => handleSearch("trains")}
                loading={loading.trains}
                error={error.trains}
                today={today}
              />
              <SearchCard
                type="cars"
                title="Cars"
                subtitle="Freedom to explore"
                query={carQuery}
                setQuery={setCarQuery}
                onSearch={() => handleSearch("cars")}
                loading={loading.cars}
                error={error.cars}
                today={today}
              />
            </div>
          ) : (
            /* Results Section */
            <div className="space-y-8">
              {/* Back Button */}
              <button
                onClick={resetSearch}
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors group"
              >
                <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Search</span>
              </button>

              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  {
                    id: "flights",
                    label: "Flights",
                    icon: Plane,
                    resultCount: results.flights.length,
                    color: "from-blue-500 to-blue-600",
                  },
                  {
                    id: "trains",
                    label: "Trains",
                    icon: Train,
                    resultCount: results.trains.length,
                    color: "from-green-500 to-green-600",
                  },
                  {
                    id: "cars",
                    label: "Cars",
                    icon: Car,
                    resultCount: results.cars.length,
                    color: "from-yellow-500 to-yellow-600",
                  },
                ].map(({ id, label, icon: Icon, resultCount, color }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                      activeTab === id
                        ? `bg-gradient-to-r ${color} shadow-lg`
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        activeTab === id ? "bg-white/20" : "bg-white/10"
                      }`}
                    >
                      {resultCount}
                    </span>
                  </button>
                ))}
              </div>

              {/* Error Display */}
              {error[activeTab] && <ErrorMessage message={error[activeTab]} />}

              {/* Loading State */}
              {loading[activeTab] && (
                <div className="flex flex-col items-center justify-center p-12 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                  <p className="text-white/70">
                    Searching for the best {activeTab}...
                  </p>
                </div>
              )}

              {/* No Results */}
              {!loading[activeTab] &&
                results[activeTab].length === 0 &&
                !error[activeTab] && (
                  <div className="text-center py-12 text-white/70">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">
                      No results found
                    </h3>
                    <p>
                      Try different airport codes like JFK, LAX, LHR, or CDG
                    </p>
                  </div>
                )}

              {/* Results Grid */}
              {!loading[activeTab] && results[activeTab].length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {results[activeTab].map((result, i) => (
                    <ResultCard
                      key={result.id || i}
                      result={result}
                      type={activeTab.slice(0, -1)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transportation;

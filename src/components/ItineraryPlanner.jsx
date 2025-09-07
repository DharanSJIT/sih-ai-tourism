import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Plane, CircleHelp, Hourglass } from 'lucide-react';

// Get the API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ItineraryPlanner = () => {
  // State for form inputs
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('');
  const [budget, setBudget] = useState('');
  const [members, setMembers] = useState('');
  const [interests, setInterests] = useState([]);

  // State for API response and loading status
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const interestOptions = ['History & Culture', 'Food & Drink', 'Adventure & Outdoors', 'Relaxation', 'Shopping & Nightlife'];

  const handleInterestChange = (interest) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const generateItinerary = async (e) => {
    e.preventDefault();
    if (!destination || !days || !budget || !members) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setLoading(true);
    setItinerary('');

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are an expert travel planner. Create a detailed and engaging travel itinerary based on the following user preferences.
        The output must be in well-structured Markdown format.

        **Travel Details:**
        - **Destination:** ${destination}
        - **Duration:** ${days} days
        - **Budget (per person, excluding flights):** Approximately $${budget} USD
        - **Number of Travelers:** ${members}
        - **Primary Interests:** ${interests.join(', ')}

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
      setError('Failed to generate itinerary. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✨ REMOVED mt-[20vh] and adjusted height to fill remaining space.
    // The LayoutWithNavbar in App.jsx now provides the initial top padding.
    <div className="min-h-[50vh] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 absolute top-[10vh] w-full max-h-[70vh] ">
       <h1 className="text-4xl md:text-5xl font-extrabold text-center text-indigo-600 dark:text-indigo-400 mb-6 drop-shadow-lg">
  AI Itinerary Planner
</h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Form */}
         {/* <h1 className="text-3xl font-bold">AI Itinerary Planner</h1> */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            {/* <Sparkles className="w-8 h-8 text-indigo-500" /> */}
            <div>
             
              <p className="text-gray-500 dark:text-gray-400">Craft your perfect trip with intelligent suggestions.</p>
            </div>
          </div>

          <form onSubmit={generateItinerary} className="space-y-6">
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Destination</label>
              <input type="text" id="destination" value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g., Paris, France" required className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="days" className="block text-sm font-medium">Days</label>
                <input type="number" id="days" value={days} onChange={e => setDays(e.target.value)} placeholder="e.g., 7" required className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md p-3" />
              </div>
              <div>
                <label htmlFor="budget" className="block text-sm font-medium">Budget (USD per person)</label>
                <input type="number" id="budget" value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g., 1500" required className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md p-3" />
              </div>
              <div>
                <label htmlFor="members" className="block text-sm font-medium">Travelers</label>
                <input type="number" id="members" value={members} onChange={e => setMembers(e.target.value)} placeholder="e.g., 2" required className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md p-3" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Interests (Optional)</label>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {interestOptions.map(interest => (
                  <button type="button" key={interest} onClick={() => handleInterestChange(interest)} className={`p-3 text-sm rounded-lg transition-all duration-200 ${interests.includes(interest) ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
              {loading ? <Hourglass className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              {loading ? 'Generating...' : 'Generate Itinerary'}
            </button>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          </form>
        </div>

        {/* Right Side: Display Itinerary */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg relative min-h-[500px]">
          <div className="sticky top-8"> {/* Adjusted sticky top to account for navbar */}
            <h2 className="text-2xl font-bold mb-4">Your Generated Itinerary</h2>
            
            {loading && (
              <div className="flex flex-col items-center justify-center h-full mt-20">
                <Plane className="w-16 h-16 text-indigo-400 animate-bounce" />
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Planning your adventure...</p>
              </div>
            )}

            {!loading && !itinerary && (
              <div className="flex flex-col items-center justify-center h-full mt-20 text-center">
                <CircleHelp className="w-16 h-16 text-gray-400" />
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Your trip plan will appear here once generated.</p>
              </div>
            )}
            
            {itinerary && (
              // Adjusted h-[70vh] to h-[calc(100vh-180px)] to better fit the remaining space
              <div className="prose prose-indigo dark:prose-invert max-w-none h-[calc(100vh-180px)] overflow-y-auto pr-4">
                  <ReactMarkdown>{itinerary}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ItineraryPlanner;
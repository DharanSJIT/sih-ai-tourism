import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { ref, onValue, push, set } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';

function Feedback() {
  const [user] = useAuthState(auth);
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState('');
  const [place, setPlace] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const feedbackRef = ref(db, 'feedbacks');
    const unsubscribe = onValue(feedbackRef, (snapshot) => {
      const feedbackList = [];
      snapshot.forEach((childSnapshot) => {
        feedbackList.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      // Sort feedbacks by timestamp descending
      feedbackList.sort((a, b) => b.timestamp - a.timestamp);
      setFeedbacks(feedbackList);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newFeedback.trim() || !place.trim() || !user) return;

    setLoading(true);
    try {
      const feedbackRef = ref(db, 'feedbacks');
      const newFeedbackRef = push(feedbackRef);
      await set(newFeedbackRef, {
        name: user.displayName || 'Anonymous',
        place: place,
        message: newFeedback,
        timestamp: Date.now(),
      });
      setNewFeedback('');
      setPlace('');
    } catch (error) {
      console.error('Error adding feedback: ', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-8 text-center">Feedback</h1>

        {/* Submit Feedback Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-amber-200/50 mb-8">
          <h2 className="text-2xl font-bold text-amber-700 mb-4">Share Your Feedback</h2>
          {user ? (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Enter the place you're giving feedback for..."
                className="w-full p-4 mb-4 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <textarea
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
                placeholder="Tell us about your experience..."
                className="w-full p-4 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                rows="4"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-amber-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-700 transition disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          ) : (
            <p className="text-slate-600">Please log in to submit feedback.</p>
          )}
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">What Others Are Saying</h2>
          {feedbacks.length === 0 ? (
            <p className="text-slate-600">No feedback yet. Be the first to share!</p>
          ) : (
            feedbacks.map((feedback) => (
              <div key={feedback.id} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-200/50">
                <div className="flex items-center mb-2">
                  <span className="font-bold text-blue-700">{feedback.name}</span>
                  <span className="text-slate-500 ml-2">
                    {new Date(feedback.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-600 mb-2"><strong>Place:</strong> {feedback.place}</p>
                <p className="text-slate-700">{feedback.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Feedback;
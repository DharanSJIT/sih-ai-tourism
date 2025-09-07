import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ShoppingCart, Heart, Star, Search, MapPin, Calendar, IndianRupee, Sparkles, Loader2, X, Plus, Minus, ShoppingBag } from 'lucide-react';

const Marketplace = () => {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [budget, setBudget] = useState('all');
  const [duration, setDuration] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [notification, setNotification] = useState('');

  // Mock data for Jharkhand marketplace
  const products = [
    {
      id: 1,
      name: "Trekking Backpack 60L",
      category: "travel-essentials",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      description: "Durable waterproof backpack perfect for Jharkhand's hilly terrain and monsoon season.",
      price: 2499,
      rating: 4.5,
      reviews: 128,
      recommended: ["ranchi", "jamshedpur", "dhanbad"],
      budgetRange: "mid",
      tags: ["waterproof", "trekking", "60L", "durable"]
    },
    {
      id: 2,
      name: "Monsoon Raincoat",
      category: "travel-essentials",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      description: "Lightweight, breathable raincoat essential for Jharkhand's heavy monsoons.",
      price: 899,
      rating: 4.3,
      reviews: 95,
      recommended: ["all"],
      budgetRange: "budget",
      tags: ["raincoat", "monsoon", "waterproof", "lightweight"]
    },
    {
      id: 3,
      name: "Comprehensive First Aid Kit",
      category: "travel-essentials",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      description: "Complete medical kit with essentials for remote travel in tribal areas.",
      price: 1299,
      rating: 4.7,
      reviews: 203,
      recommended: ["all"],
      budgetRange: "mid",
      tags: ["medical", "safety", "emergency", "remote travel"]
    },
    {
      id: 4,
      name: "Jharkhand Trail Mix",
      category: "travel-essentials",
      image: "https://images.unsplash.com/photo-1599599810694-57a2ca8276a8?w=400&h=300&fit=crop",
      description: "Energy-packed mix of local nuts, dried fruits, and seeds from Jharkhand.",
      price: 349,
      rating: 4.4,
      reviews: 87,
      recommended: ["all"],
      budgetRange: "budget",
      tags: ["snacks", "energy", "local", "nuts"]
    },
    {
      id: 5,
      name: "Santal Tribe Cotton Saree",
      category: "handloom",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop",
      description: "Authentic handwoven saree by Santal artisans with traditional geometric patterns.",
      price: 3500,
      rating: 4.8,
      reviews: 67,
      recommended: ["ranchi", "dumka"],
      budgetRange: "premium",
      tags: ["saree", "handwoven", "santal", "traditional"]
    },
    {
      id: 6,
      name: "Khadi Cotton Kurta Set",
      category: "handloom",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop",
      description: "Comfortable khadi cotton kurta perfect for exploring Jharkhand's cultural sites.",
      price: 1899,
      rating: 4.5,
      reviews: 142,
      recommended: ["ranchi", "jamshedpur"],
      budgetRange: "mid",
      tags: ["khadi", "cotton", "kurta", "cultural"]
    },
    {
      id: 7,
      name: "Traditional Gamcha Towel",
      category: "handloom",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
      description: "Hand-woven gamcha towel, a versatile cloth used by locals across Jharkhand.",
      price: 299,
      rating: 4.2,
      reviews: 76,
      recommended: ["all"],
      budgetRange: "budget",
      tags: ["gamcha", "handwoven", "versatile", "traditional"]
    },
    {
      id: 8,
      name: "Dokra Metal Elephant",
      category: "tribal-crafts",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      description: "Exquisite Dokra art piece crafted using ancient lost-wax casting technique.",
      price: 2200,
      rating: 4.9,
      reviews: 34,
      recommended: ["ranchi", "dhanbad"],
      budgetRange: "premium",
      tags: ["dokra", "metal art", "handcrafted", "traditional"]
    },
    {
      id: 9,
      name: "Bamboo Basket Set",
      category: "tribal-crafts",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      description: "Handcrafted bamboo baskets by tribal artisans, perfect for home decor.",
      price: 899,
      rating: 4.4,
      reviews: 56,
      recommended: ["all"],
      budgetRange: "budget",
      tags: ["bamboo", "baskets", "eco-friendly", "decor"]
    },
    {
      id: 10,
      name: "Tribal Wooden Mask",
      category: "tribal-crafts",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      description: "Traditional wooden mask representing Jharkhand's rich tribal heritage.",
      price: 1599,
      rating: 4.6,
      reviews: 41,
      recommended: ["ranchi", "dumka"],
      budgetRange: "mid",
      tags: ["wooden", "mask", "tribal", "heritage"]
    },
    {
      id: 11,
      name: "Thekua (Traditional Sweet)",
      category: "regional-sweets",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
      description: "Authentic Thekua, a beloved Jharkhand festival sweet made with jaggery and wheat.",
      price: 299,
      rating: 4.7,
      reviews: 189,
      recommended: ["all"],
      budgetRange: "budget",
      tags: ["thekua", "festival", "sweet", "jaggery"]
    },
    {
      id: 12,
      name: "Pitha Variety Pack",
      category: "regional-sweets",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
      description: "Assorted traditional rice cakes including Arsa and Kheer Pitha.",
      price: 449,
      rating: 4.5,
      reviews: 93,
      recommended: ["ranchi", "jamshedpur"],
      budgetRange: "budget",
      tags: ["pitha", "rice cakes", "traditional", "variety"]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', icon: '🛍️' },
    { id: 'travel-essentials', name: 'Travel Essentials', icon: '🎒' },
    { id: 'handloom', name: 'Handloom', icon: '🧵' },
    { id: 'tribal-crafts', name: 'Tribal Crafts', icon: '🎨' },
    { id: 'regional-sweets', name: 'Regional Sweets', icon: '🍯' }
  ];

  const destinations = [
    'Ranchi', 'Jamshedpur', 'Dhanbad', 'Dumka', 'Hazaribagh', 'Bokaro'
  ];

  // Efficient Gemini API call with debouncing and caching
  const getAIRecommendations = useCallback(async () => {
    const cacheKey = `${selectedDestination}-${duration}-${budget}-${searchTerm}`;
    const cachedResult = sessionStorage.getItem(`ai-rec-${cacheKey}`);
    
    if (cachedResult) {
      setAiRecommendations(JSON.parse(cachedResult));
      return;
    }

    setLoadingRecommendations(true);
    
    try {
      const prompt = `As a Jharkhand travel expert, suggest 3-5 products for:
      Destination: ${selectedDestination || 'Any location'}
      Duration: ${duration || 'flexible'} days
      Budget: ${budget === 'all' ? 'flexible' : budget}
      Interest: ${searchTerm || 'general travel'}
      
      Categories: Travel essentials, Handloom, Tribal crafts, Regional sweets.
      Give brief recommendations (1-2 lines each) focusing on Jharkhand specialties.`;

      // Replace YOUR_GEMINI_API_KEY with your actual API key
      const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const recommendations = data.candidates[0]?.content?.parts[0]?.text || "";
        const recArray = recommendations.split('\n').filter(line => line.trim());
        
        setAiRecommendations(recArray);
        sessionStorage.setItem(`ai-rec-${cacheKey}`, JSON.stringify(recArray));
      } else {
        throw new Error('API call failed');
      }
    } catch (error) {
      console.error('AI API Error:', error);
      // Fallback recommendations
      const fallbacks = [
        "🎒 Trekking Backpack - Essential for Jharkhand's varied terrain",
        "☔ Monsoon Raincoat - Must-have for heavy monsoon season",
        "🧵 Khadi Kurta - Comfortable local clothing for cultural visits",
        "🍯 Thekua Sweet - Authentic Jharkhand festival delicacy",
        "🎨 Tribal Crafts - Beautiful souvenirs from local artisans"
      ];
      setAiRecommendations(fallbacks);
    }
    
    setLoadingRecommendations(false);
  }, [selectedDestination, duration, budget, searchTerm]);

  // Debounced AI recommendations
  useEffect(() => {
    if (selectedDestination || duration || budget !== 'all' || searchTerm) {
      const timer = setTimeout(() => {
        getAIRecommendations();
        setShowAiSuggestions(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      setShowAiSuggestions(false);
      setAiRecommendations([]);
    }
  }, [selectedDestination, duration, budget, searchTerm, getAIRecommendations]);

  // Filter products with AI-powered sorting
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDestination = !selectedDestination || 
                                product.recommended.includes('all') ||
                                product.recommended.includes(selectedDestination.toLowerCase());
      const matchesBudget = budget === 'all' || product.budgetRange === budget;
      
      return matchesCategory && matchesSearch && matchesDestination && matchesBudget;
    });

    // AI-powered sorting
    if (aiRecommendations.length > 0) {
      filtered.sort((a, b) => {
        const aRecommended = aiRecommendations.some(rec => 
          rec.toLowerCase().includes(a.name.toLowerCase()) || 
          a.tags.some(tag => rec.toLowerCase().includes(tag))
        );
        const bRecommended = aiRecommendations.some(rec => 
          rec.toLowerCase().includes(b.name.toLowerCase()) || 
          b.tags.some(tag => rec.toLowerCase().includes(tag))
        );
        
        return aRecommended && !bRecommended ? -1 : (!aRecommended && bRecommended ? 1 : 0);
      });
    }

    return filtered;
  }, [selectedCategory, searchTerm, selectedDestination, budget, aiRecommendations]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    showNotification(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const isProductRecommended = (product) => {
    return aiRecommendations.some(rec => 
      rec.toLowerCase().includes(product.name.toLowerCase()) || 
      product.tags.some(tag => rec.toLowerCase().includes(tag))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 mt-[8vh] pt-4 pb-8 px-4 lg:px-8">
      {/* Fixed Cart Button */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:from-green-600 hover:to-blue-600 transition-all flex items-center space-x-2 mt-14"
      >
        <ShoppingBag size={20} />
        <span className="font-medium">Cart: {cartItemsCount} items</span>
      </button>

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          {notification}
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 py-4 border-b">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-orange-600 font-bold">₹{item.price}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">Total: ₹{cartTotal}</span>
                </div>
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 mb-8 border border-orange-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Destination */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
              >
                <option value="">All Destinations</option>
                {destinations.map(dest => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div className="relative">
              <IndianRupee className="absolute left-3 top-3 text-gray-400" size={20} />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                <option value="all">All Budgets</option>
                <option value="budget">Budget (₹0-1000)</option>
                <option value="mid">Mid-range (₹1000-3000)</option>
                <option value="premium">Premium (₹3000+)</option>
              </select>
            </div>

            {/* Duration */}
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Trip duration (days)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          {/* AI Recommendation Button */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => {
                getAIRecommendations();
                setShowAiSuggestions(true);
              }}
              disabled={loadingRecommendations}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* {loadingRecommendations ? <Loader2 className="animate-spin" size={18} /> } */}
              <span>{loadingRecommendations ? 'Generating...' : 'Get AI Recommendations'}</span>
            </button>
          </div>
        </div>

        {/* AI Recommendations Panel */}
        {showAiSuggestions && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 lg:p-6 mb-8 border border-blue-200">
            <div className="flex items-start space-x-3">
              {/* <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg flex-shrink-0">
                <Sparkles size={20} />
              </div> */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-3">
                  <h3 className="font-bold text-gray-900">AI-Powered Recommendations</h3>
                  {loadingRecommendations && <Loader2 className="animate-spin text-blue-500" size={16} />}
                </div>
                {loadingRecommendations ? (
                  <p className="text-gray-600">Analyzing your preferences to suggest the best products...</p>
                ) : (
                  <div className="space-y-2">
                    {aiRecommendations.map((rec, index) => (
                      <p key={index} className="text-gray-700 text-sm leading-relaxed">{rec}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="flex flex-wrap gap-2 lg:gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-full font-medium transition-all text-sm lg:text-base ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span className="hidden sm:inline">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border group ${
                isProductRecommended(product) 
                  ? 'border-blue-300 ring-2 ring-blue-100' 
                  : 'border-orange-100'
              }`}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                    favorites.includes(product.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-red-50'
                  }`}
                >
                  <Heart size={18} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} />
                </button>
                <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {product.budgetRange === 'budget' ? '💰' : product.budgetRange === 'mid' ? '💳' : '💎'}
                </div>
                {isProductRecommended(product) && (
                  <div className="absolute bottom-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <Sparkles size={12} />
                    <span>AI Pick</span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4 lg:p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  <Star className="text-yellow-400 fill-current" size={16} />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-gray-400 text-xs">({product.reviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl lg:text-2xl font-bold text-orange-600">₹{product.price}</span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product)}
                  className={`w-full py-2.5 lg:py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-sm lg:text-base ${
                    isProductRecommended(product)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                  }`}
                >
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* Enhanced Recommendations Note */}
        {(selectedDestination || duration) && (
          <div className="mt-12 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-4 lg:p-6 border border-orange-200">
            <div className="flex items-start space-x-3">
              <div className="bg-orange-500 text-white p-2 rounded-lg flex-shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Personalized Recommendations</h3>
                <p className="text-gray-700 text-sm lg:text-base">
                  Products are curated using AI recommendations based on your destination and travel preferences. 
                  Items marked with <span className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs lg:text-sm"><Sparkles size={12} /><span>AI Pick</span></span> are specially recommended for your Jharkhand adventure!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </div>
  );
};

export default Marketplace;
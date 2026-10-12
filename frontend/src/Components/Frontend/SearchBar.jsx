import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../../context/ShopContext";
import { FaMicrophone, FaTimes, FaSearch, FaClock, FaFire } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../../App";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = ({ inline = false, onClose }) => {
  const { search, setSearch, products } = useContext(ShopContext);

  const [suggestions, setSuggestions] = useState([]);
  const [recent, setRecent] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const navigate = useNavigate();
  const inputRef = useRef();

  const trending = ["Shoes", "Mobile", "Watch", "Perfume", "T-shirt"];

  // ✅ Auto-focus when component mounts (for modal)
  useEffect(() => {
    if (inline && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
        setIsFocused(true);
      }, 100);
    }
  }, [inline]);

  // Load recent searches
  useEffect(() => {
    const r = JSON.parse(localStorage.getItem("recent_searches")) || [];
    setRecent(r);
  }, []);

  // Filter suggestions based on search
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const s = search.toLowerCase();
    const filtered = products
      .filter((item) => item.name.toLowerCase().includes(s))
      .slice(0, 10);

    setSuggestions(filtered);
    setCursor(0);
  }, [search, products]);

  const addRecent = (text) => {
    if (!text.trim()) return;
    let updated = [text, ...recent.filter((r) => r !== text)].slice(0, 8);
    setRecent(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search not supported in your browser");
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.start();
    rec.onresult = (e) => setSearch(e.results[0][0].transcript);
  };

  const goToProduct = (item) => {
    addRecent(item.name);
    setSuggestions([]);
    setSearch("");
    navigate(`/product/${item._id}`);
    setIsFocused(false);
    if (onClose) onClose();
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((prev) => (prev + 1) % suggestions.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    }
    if (e.key === "Enter" && suggestions.length > 0) {
      e.preventDefault();
      goToProduct(suggestions[cursor]);
    }
  };

  const handleSearchClick = (term) => {
    setSearch(term);
    addRecent(term);
    inputRef.current?.focus();
  };

  const clearSearch = () => {
    setSearch("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  // ✅ Show dropdown when focused
  const showDropdown = isFocused;

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative flex items-center border-2 border-gray-300 px-5 py-4 rounded-2xl bg-white focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 transition-all duration-300 shadow-lg hover:shadow-xl">
        <FaSearch className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
        
        <input
          ref={inputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          type="text"
          placeholder="Search for products..."
          className="flex-1 outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
        />

        {search && (
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={clearSearch}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          >
            <FaTimes className="w-4 h-4 text-gray-500" />
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={startVoice}
          className="p-2 ml-2 hover:bg-indigo-50 rounded-full transition-colors flex-shrink-0"
        >
          <FaMicrophone className="w-5 h-5 text-indigo-600" />
        </motion.button>
      </div>

      {/* Dropdown Suggestions */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 mt-3 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl z-50 max-h-[500px] overflow-y-auto"
          >
            {search.trim() === "" ? (
              <>
                {/* Recent Searches */}
                {recent.length > 0 && (
                  <div className="border-b border-gray-100">
                    <div className="flex items-center gap-2 px-5 py-3">
                      <FaClock className="text-gray-400 text-xs" />
                      <h3 className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                        Recent Searches
                      </h3>
                    </div>
                    {recent.map((r, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ x: 4, backgroundColor: "#f9fafb" }}
                        className="px-5 py-3 cursor-pointer flex items-center gap-3 text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => handleSearchClick(r)}
                      >
                        <FaSearch className="text-gray-400 text-xs" />
                        <span className="font-medium">{r}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Trending */}
                {trending.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 px-5 py-3">
                      <FaFire className="text-orange-500 text-sm" />
                      <h3 className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                        Trending Searches
                      </h3>
                    </div>
                    {trending.map((t, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ x: 4, backgroundColor: "#f9fafb" }}
                        className="px-5 py-3 cursor-pointer flex items-center gap-3 text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => handleSearchClick(t)}
                      >
                        <FaSearch className="text-indigo-500 text-xs" />
                        <span className="font-medium">{t}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {recent.length === 0 && (
                  <div className="px-5 py-8 text-center">
                    <FaSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Start typing to search products</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {suggestions.length > 0 ? (
                  <>
                    <div className="px-5 py-3 border-b border-gray-100">
                      <h3 className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                        Products ({suggestions.length})
                      </h3>
                    </div>
                    {suggestions.map((item, index) => (
                      <motion.div
                        key={item._id}
                        whileHover={{ x: 4, backgroundColor: "#f9fafb" }}
                        className={`px-5 py-4 flex items-center gap-4 cursor-pointer transition-all ${
                          cursor === index ? "bg-indigo-50 border-l-4 border-indigo-600" : "border-l-4 border-transparent"
                        }`}
                        onClick={() => goToProduct(item)}
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-gray-100">
                          <img
                            src={`${backendUrl}/${item.images[0]}`}
                            className="w-full h-full object-cover"
                            alt={item.name}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/56?text=No+Image";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 font-semibold text-sm truncate">
                            {item.name}
                          </p>
                          <p className="text-indigo-600 font-bold text-sm mt-1">
                            ${item.price}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </>
                ) : (
                  <div className="px-5 py-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <FaSearch className="text-gray-400 text-3xl" />
                    </div>
                    <p className="text-gray-700 font-semibold text-base mb-1">No products found</p>
                    <p className="text-gray-400 text-sm">
                      Try searching with different keywords
                    </p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
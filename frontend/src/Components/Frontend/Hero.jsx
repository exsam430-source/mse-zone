import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import { assets } from "../../assets/Frontend/assets";
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiPlay } from "react-icons/fi";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";

const Hero = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // Fetch latest product images
  useEffect(() => {
    const fetchLatestImages = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/product/list`);
        if (res.data.success) {
          const allImages = res.data.products
            .slice(0, 6)
            .map(p => ({
              image: `${backendURL}${p.images[0]?.replace(/^Images/, "/Images")}`,
              name: p.name,
              price: p.price,
              id: p._id
            }));
          setImages(allImages);
        }
      } catch (err) {
        console.error("Failed to fetch images:", err);
      }
    };
    fetchLatestImages();
  }, [backendURL]);

  // Auto slide logic
  useEffect(() => {
    if (!isAutoPlaying || images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, images.length, isAutoPlaying]);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev + 1) % images.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, [images.length]);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-300/30 to-purple-300/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-pink-300/30 to-orange-300/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-300/20 to-blue-300/20 rounded-full blur-3xl"
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-[1920px] mx-auto px-6 lg:px-16 pt-8 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 min-h-[calc(100vh-120px)]">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-1/2 z-20"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-6"
            >
              <HiSparkles className="text-indigo-600 text-lg" />
              <span className="text-sm font-semibold text-indigo-700">New Collection 2025</span>
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute h-2 w-2 rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] mb-6"
            >
              <span className="text-gray-900">Discover</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Timeless
              </span>
              <br />
              <span className="text-gray-900">Fashion</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 text-lg lg:text-xl leading-relaxed mb-8 max-w-lg"
            >
              Step into elegance — where design meets comfort. Our latest arrivals 
              are crafted for the modern trendsetter who values both style and quality.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link to="/collection">
                <motion.button
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-full font-bold text-lg shadow-2xl shadow-indigo-500/40 hover:shadow-3xl hover:shadow-indigo-500/50 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Shop Collection
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <FiArrowRight className="text-xl" />
                    </motion.span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 px-6 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-indigo-300 rounded-full font-semibold text-gray-700 hover:text-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiPlay className="text-white text-sm ml-0.5" />
                </div>
                Watch Lookbook
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-6 mt-12 pt-8 border-t border-gray-200"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">50,000+</span> Happy Customers
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image Slider */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-1/2 relative"
          >
            {/* Main Image Container */}
            <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] w-full">
              {/* Decorative Frame */}
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-[3rem] opacity-20 blur-2xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-[2.5rem] p-1">
                <div className="relative w-full h-full bg-white rounded-[2.3rem] overflow-hidden">
                  <AnimatePresence mode="wait">
                    {images.length > 0 && (
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0"
                      >
                        <img
                          src={images[currentIndex]?.image}
                          alt={images[currentIndex]?.name || "Hero Image"}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        
                        {/* Product Info Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="absolute bottom-6 left-6 right-6"
                        >
                          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-2xl">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">Featured Product</p>
                                <h3 className="text-gray-900 font-bold text-lg truncate max-w-[200px]">
                                  {images[currentIndex]?.name || "Premium Collection"}
                                </h3>
                                <p className="text-indigo-600 font-bold text-xl mt-1">
                                  ${images[currentIndex]?.price || "99.00"}
                                </p>
                              </div>
                              <Link to={`/product/${images[currentIndex]?.id}`}>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
                                >
                                  <FiArrowRight className="text-2xl" />
                                </motion.button>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all z-20"
                  >
                    <FiChevronLeft className="text-2xl" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all z-20"
                  >
                    <FiChevronRight className="text-2xl" />
                  </button>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-2xl flex items-center justify-center z-30"
              >
                <div className="text-center text-white">
                  <p className="text-xs font-bold">UP TO</p>
                  <p className="text-2xl font-black">50%</p>
                  <p className="text-xs font-bold">OFF</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 px-6 py-4 bg-white rounded-2xl shadow-2xl flex items-center gap-3 z-30"
              >
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <HiLightningBolt className="text-green-600 text-2xl" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Flash Sale</p>
                  <p className="text-xs text-gray-500">Ends in 24h</p>
                </div>
              </motion.div>
            </div>

            {/* Dots Indicator */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                    setTimeout(() => setIsAutoPlaying(true), 10000);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-gradient-to-r from-indigo-600 to-purple-600"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
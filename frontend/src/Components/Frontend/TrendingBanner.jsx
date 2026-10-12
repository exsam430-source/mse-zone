import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';

const TrendingBanner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 py-20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent w-full"
            style={{ top: `${20 + i * 20}%` }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              ✨ Limited Time Offer
            </motion.span>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Summer Sale
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                Up to 50% OFF
              </span>
            </h2>

            <p className="text-gray-400 text-lg mb-8 max-w-md">
              Don't miss out on our biggest sale of the season. Premium quality 
              fashion at unbeatable prices.
            </p>

            <div className="flex gap-4">
              <Link to="/collection">
                <motion.button
                  className="group flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Shop Sale
                  <FiArrowUpRight className="group-hover:rotate-45 transition-transform" />
                </motion.button>
              </Link>

              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-gray-900"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-white font-semibold">5000+</p>
                  <p className="text-gray-400 text-sm">Happy Shoppers</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Countdown */}
          <motion.div
            className="grid grid-cols-4 gap-4"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {[
              { value: "05", label: "Days" },
              { value: "12", label: "Hours" },
              { value: "45", label: "Minutes" },
              { value: "30", label: "Seconds" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <motion.p
                  className="text-4xl md:text-5xl font-bold text-white"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                >
                  {item.value}
                </motion.p>
                <p className="text-gray-400 text-sm mt-2">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrendingBanner;
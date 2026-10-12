import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import ProductItem from "./ProductItem";
import { motion } from "framer-motion";
import { FiAward, FiTrendingUp } from "react-icons/fi";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <div className="relative py-20 px-4 sm:px-8 md:px-16">
      {/* Section Header */}
      <div className="text-center mb-16">
        <motion.div
          className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 px-4 py-2 rounded-full mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <FiAward className="text-yellow-400" />
          <span className="text-sm font-medium text-yellow-300">Top Rated Products</span>
        </motion.div>

        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-white">Best </span>
          <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
            Sellers
          </span>
        </motion.h2>

        <motion.p
          className="text-gray-400 max-w-2xl mx-auto text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          Discover our top-selling picks — the products our customers can't get enough of.
        </motion.p>

        {/* Stats Bar */}
        <motion.div
          className="flex justify-center gap-8 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          {[
            { icon: FiTrendingUp, value: "10K+", label: "Items Sold" },
            { icon: FiAward, value: "4.9", label: "Avg Rating" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-300">
              <stat.icon className="text-yellow-400" />
              <span className="font-bold">{stat.value}</span>
              <span className="text-gray-500">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Products Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {bestSeller.map((item, index) => (
          <motion.div
            key={item._id}
            className="relative group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            {/* Bestseller Badge */}
            {index === 0 && (
              <div className="absolute -top-3 -left-3 z-10">
                <motion.div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  #1 Best Seller
                </motion.div>
              </div>
            )}

            {/* Product Card with Glow Effect */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-purple-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/20">
              <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring" }}>
                <ProductItem
                  id={item._id}
                  images={item.images}
                  name={item.name}
                  price={item.price}
                  backendUrl={backendUrl}
                  darkMode={true}
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default BestSeller;
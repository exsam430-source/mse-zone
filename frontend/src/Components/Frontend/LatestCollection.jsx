import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { ShopContext } from "../../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latest, setLatest] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", "men", "women", "kids", "accessories"];

  useEffect(() => {
    if (products?.length > 0) {
      setLatest(products.slice(0, 10));
    }
  }, [products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative py-20">
      {/* Background Decoration */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-40 -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-30 -z-10" />

      {/* Section Header */}
      <div className="text-center mb-16" data-aos="fade-up">
        <motion.div
          className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-purple-700">Just Arrived</span>
        </motion.div>

        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-gray-900">Latest </span>
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            Collection
          </span>
        </motion.h2>

        <motion.p
          className="text-gray-600 max-w-2xl mx-auto text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          Discover our newest arrivals — fresh styles and timeless pieces,
          crafted to make your collection stand out.
        </motion.p>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Products Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {latest.map((item, index) => (
          <motion.div
            key={item._id}
            variants={itemVariants}
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ProductItem
              id={item._id}
              images={item.images}
              name={item.name}
              price={item.price}
              backendUrl={backendUrl}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* View All Button */}
      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <Link to="/collection">
          <motion.button
            className="group inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-semibold shadow-xl shadow-gray-900/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            View All Collection
            <motion.span
              className="group-hover:translate-x-1 transition-transform"
            >
              <FiArrowRight />
            </motion.span>
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
};

export default LatestCollection;
import React from 'react';
import { motion } from 'framer-motion';
import { FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';

const FeaturesBar = () => {
  const features = [
    { icon: FiTruck, title: "Free Shipping", desc: "On orders over $1000" },
    { icon: FiShield, title: "Secure Payment", desc: "100% protected" },
    { icon: FiRefreshCw, title: "Easy Returns", desc: "30-day guarantee" },
    { icon: FiHeadphones, title: "24/7 Support", desc: "Always here to help" },
  ];

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/10 p-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/30"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <feature.icon size={24} />
            </motion.div>
            <div>
              <h4 className="font-semibold text-gray-900">{feature.title}</h4>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeaturesBar;
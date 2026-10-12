import React from "react";
import { motion } from "framer-motion";
import { FiRefreshCw, FiShield, FiHeadphones, FiTruck, FiCreditCard, FiGift } from "react-icons/fi";

const OurPolicy = () => {
  const policies = [
    {
      icon: FiRefreshCw,
      title: "Easy Exchange",
      desc: "Hassle-free exchange within 30 days",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: FiShield,
      title: "7 Days Return",
      desc: "Easy return guarantee with full refund",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      icon: FiHeadphones,
      title: "24/7 Support",
      desc: "Professional support around the clock",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: FiTruck,
      title: "Free Shipping",
      desc: "Free shipping on orders over $100",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
    },
    {
      icon: FiCreditCard,
      title: "Secure Payment",
      desc: "Multiple secure payment options",
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50",
    },
    {
      icon: FiGift,
      title: "Gift Cards",
      desc: "Perfect gift for your loved ones",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <section className="relative py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white -z-10" />
      
      {/* Section Header */}
      <div className="text-center mb-16">
        <motion.span
          className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-purple-700 text-sm font-medium mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Why Choose Us
        </motion.span>

        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-gray-900">Our </span>
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            Policies
          </span>
        </motion.h2>

        <motion.p
          className="text-gray-600 max-w-2xl mx-auto text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          We're committed to providing the best shopping experience with 
          customer-first policies.
        </motion.p>
      </div>

      {/* Policy Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {policies.map((policy, index) => (
          <motion.div
            key={index}
            className="group relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className={`${policy.bgColor} rounded-3xl p-8 h-full border border-gray-100 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10`}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              {/* Icon */}
              <motion.div
                className={`w-16 h-16 bg-gradient-to-br ${policy.color} rounded-2xl flex items-center justify-center text-white shadow-lg mb-6`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <policy.icon size={28} />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
                {policy.title}
              </h3>
              <p className="text-gray-600">{policy.desc}</p>

              {/* Decorative Arrow */}
              <motion.div
                className="absolute bottom-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.2 }}
              >
                <span className="text-gray-600">→</span>
              </motion.div>
            </motion.div>

            {/* Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${policy.color} rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10`} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default OurPolicy;
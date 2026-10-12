import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { ShopContext } from '../../context/ShopContext';
import axios from 'axios';
import { FiMail, FiCheck, FiGift, FiStar } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

const NewSletterBox = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const { backendURL, token, applyNewsletterDiscount } = useContext(ShopContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter a valid email.");

    setLoading(true);

    try {
      await axios.post(`${backendURL}/api/newsletter/subscribe`, { email });
      setSubscribed(true);
      toast.success("Subscribed successfully!");

      if (token) {
        const applied = await applyNewsletterDiscount(email);
        if (applied) toast.success("10% Discount Applied!");
      } else {
        toast.info("Login to get your 10% discount.");
      }
    } catch (err) {
      if (err.response?.data?.message === "Email already subscribed") {
        toast.info("You are already subscribed.");
        if (token) {
          const applied = await applyNewsletterDiscount(email);
          if (applied) toast.success("10% Discount Applied!");
        }
      } else {
        toast.error("Something went wrong. Try again.");
      }
    }

    setEmail('');
    setLoading(false);
  };

  return (
    <section className="relative">
      {/* Main Container */}
      <motion.div
        className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-1"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="bg-gray-900 rounded-[2.8rem] px-8 py-16 md:px-16 md:py-20 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.1, 0.5, 0.1],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Glowing Orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-30" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-30" />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            {/* Icon */}
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-8 shadow-lg shadow-purple-500/30"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <FiMail size={36} className="text-white" />
            </motion.div>

            {/* Heading */}
            <AnimatePresence mode="wait">
              {!subscribed ? (
                <motion.div
                  key="subscribe"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                    Get{" "}
                    <span className="relative">
                      <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                        10% OFF
                      </span>
                      <motion.span
                        className="absolute -top-2 -right-4"
                        animate={{ rotate: [0, 20, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <HiSparkles className="text-yellow-400" size={24} />
                      </motion.span>
                    </span>
                    {" "}Your First Order
                  </h2>

                  <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                    Subscribe to our newsletter and be the first to know about new collections, 
                    exclusive deals, and special offers!
                  </p>

                  {/* Benefits */}
                  <div className="flex flex-wrap justify-center gap-6 mb-10">
                    {[
                      { icon: FiGift, text: "Exclusive Offers" },
                      { icon: FiStar, text: "Early Access" },
                      { icon: HiSparkles, text: "Special Discounts" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-2 text-gray-300"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <item.icon className="text-purple-400" />
                        <span>{item.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Form */}
                  <motion.form
                    onSubmit={onSubmitHandler}
                    className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="relative flex-1">
                      <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                        required
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="relative overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-purple-500/30 disabled:opacity-70"
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {loading ? (
                          <>
                            <motion.span
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            Subscribing...
                          </>
                        ) : (
                          "Subscribe Now"
                        )}
                      </span>
                    </motion.button>
                  </motion.form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10"
                >
                  <motion.div
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <FiCheck size={48} className="text-white" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Welcome to the Family! 🎉
                  </h3>
                  <p className="text-gray-400 text-lg">
                    Check your email for your exclusive 10% discount code!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trust Badges */}
            <motion.div
              className="flex justify-center items-center gap-6 mt-10 text-gray-500 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="flex items-center gap-2">
                <FiCheck className="text-green-500" /> No Spam
              </span>
              <span className="flex items-center gap-2">
                <FiCheck className="text-green-500" /> Unsubscribe Anytime
              </span>
              <span className="flex items-center gap-2">
                <FiCheck className="text-green-500" /> Privacy Protected
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default NewSletterBox;
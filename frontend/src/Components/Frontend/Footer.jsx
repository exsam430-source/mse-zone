import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../../assets/Frontend/assets";
import { Link } from "react-router-dom";
import { 
  FiFacebook, 
  FiInstagram, 
  FiTwitter, 
  FiYoutube,
  FiMail, 
  FiPhone, 
  FiMapPin,
  FiArrowUp,
  FiSend,
  FiHeart,
  FiCreditCard,
  FiShield,
  FiTruck
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Updated footer links according to your pages
  const footerLinks = {
    company: [
      { name: "About Us", path: "/about" },
      { name: "Our Story", path: "/about" },
      { name: "Contact", path: "/contact" },
    ],
    shop: [
      { name: "New Arrivals", path: "/collection" },
      { name: "Best Sellers", path: "/collection" },
      { name: "All Products", path: "/collection" },
    ],
    support: [
      { name: "Contact Us", path: "/contact" },
      { name: "My Orders", path: "/orders" },
      { name: "Track Order", path: "/orders" },
    ],
    legal: [
      { name: "Privacy Policy", path: "/contact" },
      { name: "Terms of Service", path: "/contact" },
    ],
  };

  const socialLinks = [
    { icon: FiFacebook, href: "https://facebook.com", label: "Facebook", color: "hover:bg-blue-600" },
    { icon: FiInstagram, href: "https://instagram.com", label: "Instagram", color: "hover:bg-pink-600" },
    { icon: FiTwitter, href: "https://twitter.com", label: "Twitter", color: "hover:bg-sky-500" },
    { icon: FiYoutube, href: "https://youtube.com", label: "YouTube", color: "hover:bg-red-600" },
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Decorative Top Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-white"
          />
        </svg>
      </div>

      {/* Main Footer */}
      <div className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black pt-32 pb-10">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
        </div>

        {/* Animated Stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Newsletter Section */}
          <motion.div
            className="relative mb-16 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-white/10 backdrop-blur-sm overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Decorative Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-30" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500 rounded-full blur-3xl opacity-30" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <motion.div
                  className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-4"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <HiSparkles className="text-yellow-400" />
                  <span className="text-sm text-white/80">Join Our Community</span>
                </motion.div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Subscribe & Get{" "}
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    10% OFF
                  </span>
                </h3>
                <p className="text-gray-400">
                  Be the first to know about new collections and exclusive offers.
                </p>
              </div>

              <motion.form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full sm:w-80 pl-12 pr-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-purple-500/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubscribed ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        ✓
                      </motion.span>
                      Subscribed!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Subscribe
                      <FiSend />
                    </span>
                  )}
                </motion.button>
              </motion.form>
            </div>
          </motion.div>

          {/* Main Footer Content */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12 mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Brand Section */}
            <motion.div 
              className="col-span-2 md:col-span-3 lg:col-span-2"
              variants={itemVariants}
            >
              <Link to="/" className="inline-block mb-6">
                <div className="flex items-center gap-3">
                  <motion.img
                    src={assets.logo}
                    alt="Logo"
                    className="h-12 w-auto"
                    whileHover={{ scale: 1.05 }}
                  />
                  <motion.img
                    src={assets.logo2}
                    alt="Logo 2"
                    className="h-10 w-auto hidden sm:block"
                    whileHover={{ scale: 1.05 }}
                  />
                </div>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                Elevate your wardrobe with carefully curated pieces that define elegance.
                Designed to inspire confidence every day. Premium quality fashion for the modern lifestyle.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white border border-white/10 transition-all duration-300 ${social.color} hover:border-transparent hover:scale-110`}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <social.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Company Links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-white font-semibold text-lg mb-6 relative inline-block">
                Company
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <motion.li key={index} whileHover={{ x: 5 }}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white text-sm transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-purple-500 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Shop Links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-white font-semibold text-lg mb-6 relative inline-block">
                Shop
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
              </h4>
              <ul className="space-y-3">
                {footerLinks.shop.map((link, index) => (
                  <motion.li key={index} whileHover={{ x: 5 }}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white text-sm transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-purple-500 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-white font-semibold text-lg mb-6 relative inline-block">
                Support
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
              </h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <motion.li key={index} whileHover={{ x: 5 }}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white text-sm transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-purple-500 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h4 className="text-white font-semibold text-lg mb-6 relative inline-block">
                Contact
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="tel:+923001234567"
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                  >
                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-purple-500/30 transition-colors">
                      <FiPhone size={16} />
                    </span>
                    <span className="text-sm">+92 300 1234567</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contact@msezone.com"
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                  >
                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-purple-500/30 transition-colors">
                      <FiMail size={16} />
                    </span>
                    <span className="text-sm">contact@msezone.com</span>
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-3 text-gray-400">
                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 flex-shrink-0">
                      <FiMapPin size={16} />
                    </span>
                    <span className="text-sm">
                      123 Fashion Street,<br />
                      Karachi, Pakistan
                    </span>
                  </div>
                </li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Features Bar */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-white/10 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {[
              { icon: FiTruck, text: "Free Shipping", subtext: "On orders over Rs.5000" },
              { icon: FiShield, text: "Secure Payment", subtext: "100% Protected" },
              { icon: FiCreditCard, text: "Easy Returns", subtext: "7 Day Policy" },
              { icon: FiHeart, text: "24/7 Support", subtext: "Always Available" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400">
                  <feature.icon size={22} />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{feature.text}</p>
                  <p className="text-gray-500 text-xs">{feature.subtext}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <motion.p
              className="text-gray-500 text-sm text-center md:text-left"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              © 2025{" "}
              <span className="font-medium text-white">MSE Zone</span>. 
              All Rights Reserved. Made with{" "}
              <motion.span
                className="inline-block text-red-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ❤️
              </motion.span>{" "}
              in Pakistan
            </motion.p>

            {/* Payment Methods */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <span className="text-gray-500 text-sm">We Accept:</span>
              <div className="flex gap-2">
                {["💳", "💰", "🏦", "📱"].map((icon, i) => (
                  <motion.div
                    key={i}
                    className="w-10 h-7 bg-white/10 rounded flex items-center justify-center text-lg"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    {icon}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Legal Links - FIXED: Added legal array to footerLinks */}
            <div className="flex items-center gap-4 text-sm">
              {footerLinks.legal.map((link, index) => (
                <React.Fragment key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                  {index < footerLinks.legal.length - 1 && (
                    <span className="text-gray-700">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button - Only shows when scrolled */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-500/30 z-50"
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            whileHover={{ scale: 1.1, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <FiArrowUp size={24} />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
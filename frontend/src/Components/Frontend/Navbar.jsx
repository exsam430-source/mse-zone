import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { assets } from '../../assets/Frontend/assets';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import SearchBar from './SearchBar.jsx';
import {
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiPackage,
  FiRotateCcw,
  FiLogOut,
  FiSettings,
  FiHeart,
  FiPhone,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { RiVipCrownFill } from 'react-icons/ri';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const {
    token,
    setToken,
    user,
    setUser,
    getCartCount,
    removeDiscount,
    setSearch,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Keyboard shortcut for search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Close on Escape
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearch("");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearch]);

  // ✅ Close search modal function
  const closeSearch = () => {
    setSearchOpen(false);
    setSearch("");
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('email');
    localStorage.removeItem('cartItems');

    setToken('');
    setUser(null);
    removeDiscount();
    setProfileOpen(false);
    setMobileMenu(false);

    navigate('/');
  };

  const closeMenuAndNavigate = (path) => {
    setMobileMenu(false);
    setProfileOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Main Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white shadow-2xl border-b border-gray-100'
            : 'bg-white/95 backdrop-blur-xl'
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-24 lg:h-28">
            
            {/* Left Section - Logo */}
            <div className="flex items-center gap-8 lg:gap-16">
              {/* Logo */}
              <Link to="/" className="relative group">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <img
                    src={assets.logo}
                    alt="Logo"
                    className="h-14 lg:h-16 w-auto object-contain transition-all duration-300"
                  />
                  {/* Premium glow effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-500 rounded-full" />
                </motion.div>
              </Link>

              {/* Desktop Navigation - Large & Clear */}
              <nav className="hidden xl:flex items-center gap-2">
                {[
                  { to: '/collection', label: 'Collection', icon: <FiShoppingBag className="text-xl" /> },
                  { to: '/about', label: 'About Us', icon: <HiSparkles className="text-xl" /> },
                  { to: '/contact', label: 'Contact', icon: <FiPhone className="text-xl" /> },
                ].map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `
                      relative px-6 py-4 rounded-2xl font-semibold text-base transition-all duration-300
                      flex items-center gap-3 group
                      ${isActive
                        ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl shadow-indigo-500/30'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/80'
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <motion.span
                          className={`transition-all ${isActive ? 'text-white' : 'text-indigo-600'}`}
                          whileHover={{ scale: 1.2, rotate: 15 }}
                        >
                          {item.icon}
                        </motion.span>
                        <span className="text-base font-semibold tracking-wide">
                          {item.label}
                        </span>
                        {!isActive && (
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Right Section - Large & Prominent Actions */}
            <div className="flex items-center gap-4 lg:gap-6">
              
              {/* Search Bar - Large & Modern */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(true)}
                className="hidden lg:flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-2xl transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md group min-w-[280px]"
              >
                <FiSearch className="text-xl text-gray-500 group-hover:text-indigo-600 transition-colors" />
                <span className="text-base text-gray-500 group-hover:text-gray-700 font-medium">
                  Search products...
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <kbd className="px-2.5 py-1 text-xs font-semibold text-gray-500 bg-white border border-gray-300 rounded-lg shadow-sm">
                    ⌘
                  </kbd>
                  <kbd className="px-2.5 py-1 text-xs font-semibold text-gray-500 bg-white border border-gray-300 rounded-lg shadow-sm">
                    K
                  </kbd>
                </div>
              </motion.button>

              {/* Admin Panel - Premium Badge */}
              {token && isAdmin && (
                <Link to="/admin/analytics">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden lg:flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl shadow-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 border-2 border-purple-400/20"
                  >
                    <RiVipCrownFill className="text-2xl text-yellow-300" />
                    <span className="text-base">Admin Panel</span>
                  </motion.button>
                </Link>
              )}

              {/* Login Button - Large & Attractive */}
              {!token && (
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden lg:flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-2xl font-bold text-base shadow-xl shadow-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 relative overflow-hidden group"
                  >
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <FiUser className="text-xl relative z-10" />
                    <span className="relative z-10">Sign In</span>
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </motion.button>
                </Link>
              )}

              {/* Cart - Large & Eye-catching */}
              <Link to="/cart">
                <motion.button
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-4 lg:p-5 bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-indigo-100/50 group"
                >
                  <FiShoppingBag className="text-2xl lg:text-3xl text-indigo-600 group-hover:text-purple-600 transition-colors" />
                  
                  {getCartCount() > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 min-w-[28px] h-7 px-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 border-2 border-white"
                    >
                      {getCartCount()}
                    </motion.div>
                  )}
                  
                  {/* Pulse animation when items in cart */}
                  {getCartCount() > 0 && (
                    <div className="absolute inset-0 rounded-2xl bg-indigo-400 animate-ping opacity-20" />
                  )}
                </motion.button>
              </Link>

              {/* Profile - Large Avatar */}
              {token && (
                <div className="hidden lg:block relative">
                  <motion.button
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="relative"
                  >
                    <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-xl shadow-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300">
                      <div className="w-full h-full rounded-xl bg-white flex items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                          <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent font-black text-2xl">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Online indicator - larger */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full shadow-lg" />
                  </motion.button>

                  {/* Profile Dropdown - Large & Luxurious */}
                  <AnimatePresence>
                    {profileOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setProfileOpen(false)}
                        />
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 20, scale: 0.9 }}
                          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                          className="absolute right-0 top-20 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                        >
                          {/* Premium Header with Gradient */}
                          <div className="relative p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                            
                            <div className="relative z-10">
                              <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center overflow-hidden ring-4 ring-white/30 shadow-xl">
                                  {user?.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-white font-black text-2xl">
                                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-white text-xl truncate mb-1">
                                    {user?.name || 'User'}
                                  </p>
                                  <p className="text-sm text-white/90 truncate font-medium">
                                    {user?.email || ''}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Stats */}
                              <div className="grid grid-cols-2 gap-3 mt-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                                  <p className="text-2xl font-bold text-white">12</p>
                                  <p className="text-xs text-white/80 font-medium">Orders</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                                  <p className="text-2xl font-bold text-white">{getCartCount()}</p>
                                  <p className="text-xs text-white/80 font-medium">In Cart</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items - Large & Clear */}
                          <div className="p-4">
                            {[
                              { icon: <FiUser className="text-xl" />, label: 'My Profile', path: '/profile', color: 'text-gray-700', bg: 'hover:bg-gray-50' },
                              { icon: <FiPackage className="text-xl" />, label: 'My Orders', path: '/orders', color: 'text-blue-600', bg: 'hover:bg-blue-50' },
                              { icon: <FiRotateCcw className="text-xl" />, label: 'Returns', path: '/returns', color: 'text-orange-600', bg: 'hover:bg-orange-50' },
                              { icon: <FiHeart className="text-xl" />, label: 'Wishlist', path: '/wishlist', color: 'text-red-600', bg: 'hover:bg-red-50' },
                              { icon: <FiSettings className="text-xl" />, label: 'Settings', path: '/profile', color: 'text-gray-600', bg: 'hover:bg-gray-50' },
                            ].map((item, index) => (
                              <motion.button
                                key={index}
                                whileHover={{ x: 6 }}
                                onClick={() => closeMenuAndNavigate(item.path)}
                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${item.bg} group mb-2`}
                              >
                                <span className={`${item.color} group-hover:scale-110 transition-transform`}>
                                  {item.icon}
                                </span>
                                <span className="text-base font-semibold text-gray-800">
                                  {item.label}
                                </span>
                              </motion.button>
                            ))}
                          </div>

                          {/* Logout - Prominent */}
                          <div className="p-4 border-t border-gray-100">
                            <motion.button
                              whileHover={{ x: 6 }}
                              onClick={logout}
                              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 transition-all duration-200 group"
                            >
                              <FiLogOut className="text-xl text-red-600 group-hover:scale-110 transition-transform" />
                              <span className="text-base font-semibold text-red-600">
                                Logout
                              </span>
                            </motion.button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Menu Button - Large */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenu(!mobileMenu)}
                className="xl:hidden p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-md hover:shadow-lg transition-all border border-indigo-100"
              >
                <FiMenu className="text-2xl text-indigo-600" />
              </motion.button>

              {/* Mobile Search Button - Large */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchOpen(true)}
                className="lg:hidden p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-md hover:shadow-lg transition-all border border-indigo-100"
              >
                <FiSearch className="text-2xl text-indigo-600" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Premium gradient border at bottom */}
        <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
      </motion.header>

      {/* Premium Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <>
            {/* Premium Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenu(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60]"
            />

            {/* Luxurious Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Premium Header */}
              <div className="relative p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black tracking-tight">Menu</h2>
                    <motion.button
                      whileTap={{ scale: 0.9, rotate: 90 }}
                      onClick={() => setMobileMenu(false)}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-colors"
                    >
                      <FiX className="text-2xl" />
                    </motion.button>
                  </div>

                  {/* User Info */}
                  {token ? (
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center overflow-hidden ring-4 ring-white/30">
                          {user?.avatar ? (
                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white font-black text-2xl">
                              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-xl truncate mb-1">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-sm text-white/90 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link to="/login" onClick={() => setMobileMenu(false)}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 px-8 bg-white text-indigo-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
                      >
                        Sign In / Register
                      </motion.button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Navigation - Large & Clear */}
              <nav className="flex-1 overflow-y-auto p-6 space-y-3">
                {[
                  { to: '/collection', label: 'Collection', icon: <FiShoppingBag className="text-2xl" />, gradient: 'from-blue-500 to-cyan-500' },
                  { to: '/about', label: 'About Us', icon: <HiSparkles className="text-2xl" />, gradient: 'from-purple-500 to-pink-500' },
                  { to: '/contact', label: 'Contact', icon: <FiPhone className="text-2xl" />, gradient: 'from-orange-500 to-red-500' },
                ].map((item, index) => (
                  <NavLink
                    key={index}
                    to={item.to}
                    onClick={() => setMobileMenu(false)}
                    className={({ isActive }) => `
                      flex items-center gap-5 px-6 py-5 rounded-2xl transition-all duration-300 shadow-lg
                      ${isActive
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-xl`
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span>{item.icon}</span>
                    <span className="font-bold text-lg">{item.label}</span>
                  </NavLink>
                ))}

                {/* Admin Panel */}
                {token && isAdmin && (
                  <Link to="/admin/analytics" onClick={() => setMobileMenu(false)}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-5 px-6 py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl"
                    >
                      <RiVipCrownFill className="text-2xl text-yellow-300" />
                      <span className="font-bold text-lg">Admin Panel</span>
                    </motion.div>
                  </Link>
                )}

                {/* User Menu */}
                {token && (
                  <div className="pt-6 mt-6 border-t border-gray-200 space-y-3">
                    <p className="px-2 text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                      Account
                    </p>
                    {[
                      { icon: <FiUser className="text-xl" />, label: 'My Profile', path: '/profile' },
                      { icon: <FiPackage className="text-xl" />, label: 'Orders', path: '/orders' },
                      { icon: <FiRotateCcw className="text-xl" />, label: 'Returns', path: '/returns' },
                      { icon: <FiHeart className="text-xl" />, label: 'Wishlist', path: '/wishlist' },
                    ].map((item, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ x: 6 }}
                        onClick={() => closeMenuAndNavigate(item.path)}
                        className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all"
                      >
                        <span>{item.icon}</span>
                        <span className="font-semibold text-base">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </nav>

              {/* Premium Footer */}
              {token && (
                <div className="p-6 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-4 px-8 py-5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <FiLogOut className="text-2xl" />
                    <span>Logout</span>
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ✅ Premium Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[80] flex items-start justify-center pt-20 lg:pt-32 px-4 lg:px-6"
            onClick={closeSearch}
          >
            <motion.div
              initial={{ y: -100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -100, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-3">
                  <FiSearch className="text-2xl lg:text-3xl" />
                  Search Products
                </h2>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeSearch}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm"
                >
                  <FiX className="text-xl lg:text-2xl text-white" />
                </motion.button>
              </div>

              {/* Search Bar Component */}
              <SearchBar 
                inline={true} 
                onClose={closeSearch} 
              />

              {/* Quick Tip - Hidden on Mobile */}
              <div className="mt-4 text-center hidden lg:block">
                <p className="text-white/60 text-sm">
                  💡 Tip: Use{' '}
                  <kbd className="px-2 py-1 bg-white/20 rounded text-white/80 text-xs mx-1">
                    ⌘ K
                  </kbd>{' '}
                  or{' '}
                  <kbd className="px-2 py-1 bg-white/20 rounded text-white/80 text-xs mx-1">
                    Ctrl K
                  </kbd>{' '}
                  to quickly open search
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
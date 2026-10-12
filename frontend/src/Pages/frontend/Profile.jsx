import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../../context/ShopContext';
import { 
  FaCamera, 
  FaLinkedin, 
  FaTwitter, 
  FaInstagram, 
  FaEdit,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaShieldAlt,
  FaChartLine
} from 'react-icons/fa';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiUser, 
  FiLock,
  FiEye,
  FiEyeOff,
  FiPackage,
  FiClock,
  FiTrendingUp
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Dropzone from 'react-dropzone';
import zxcvbn from 'zxcvbn';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { token, backendURL, setUser: setContextUser, user: contextUser,  refreshUserProfile } = useContext(ShopContext);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', linkedin: '', twitter: '', instagram: '', bio: '',
  });

  // Password
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  const [passwordScore, setPasswordScore] = useState(0);

  // Stats
  const [ordersCount, setOrdersCount] = useState(0);
  const [lastLogin, setLastLogin] = useState('');
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Image
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Modals
  const [showImageConfirm, setShowImageConfirm] = useState(false);
  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch profile
  const fetchProfile = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const res = await axios.get(`${backendURL}/api/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data.success) {
        const userData = res.data.user;
        
        // Construct full avatar URL
        const avatarUrl = userData.avatar 
          ? `${backendURL}${userData.avatar}?t=${Date.now()}`
          : null;
        
        const userWithAvatar = {
          ...userData,
          avatar: avatarUrl
        };
        
        setUser(userWithAvatar);
        
        // Update context user with avatar
        if (setContextUser) {
          setContextUser(userWithAvatar);
        }
        
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          linkedin: userData.linkedin || '',
          twitter: userData.twitter || '',
          instagram: userData.instagram || '',
          bio: userData.bio || '',
        });
        
        setLastLogin(userData.lastLogin ? new Date(userData.lastLogin).toLocaleString() : 'N/A');
        computeProfileCompletion(userData);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      toast.error(err.response?.data?.message || 'Failed to load profile');
    }
  };

  // Fetch orders
  const fetchOrdersCount = async () => {
    if (!token) return;
    try {
      const res = await axios.post(
        `${backendURL}/api/order/userOrders`,
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        setOrdersCount(res.data.orders.length);
      }
    } catch (err) {
      console.error('Orders fetch error:', err);
    }
  };

  const computeProfileCompletion = (userData) => {
    const fields = ['name', 'email', 'phone', 'address', 'bio', 'linkedin', 'twitter', 'instagram'];
    const filled = fields.filter(f => userData[f] && userData[f] !== '').length;
    setProfileCompletion(Math.round((filled / fields.length) * 100));
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchOrdersCount();
    }
  }, [token]);

  // Update profile
  const handleProfileUpdate = async () => {
    try {
      const res = await axios.put(
        `${backendURL}/api/profile/me`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        setSuccessMessage('Profile updated successfully!');
        setShowSuccessModal(true);
        fetchProfile();
        setEditMode(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  // Password strength
  const handlePasswordChange = (value) => {
    setNewPassword(value);
    setPasswordScore(zxcvbn(value).score);
  };

  // Update password
  const updatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error('All password fields are required');
    }
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords don't match");
    }
    if (newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }
    
    try {
      const res = await axios.put(
        `${backendURL}/api/profile/me/password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        setSuccessMessage('Password updated successfully!');
        setShowSuccessModal(true);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordSection(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    }
  };

  // Image upload
  const handleImageUpload = async () => {
  if (!selectedImage) return toast.error('Please select an image first');
  
  const formData = new FormData();
  formData.append('image', selectedImage);

  try {
    setUploading(true);
    const res = await axios.post(
      `${backendURL}/api/profile/me/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    if (res.data.success) {
      const newAvatarUrl = `${backendURL}${res.data.avatar}?t=${Date.now()}`;
      
      // Update local state
      setUser(prev => ({ ...prev, avatar: newAvatarUrl }));
      
      // Update context to sync with navbar
      if (setContextUser) {
        setContextUser(prev => ({ ...prev, avatar: newAvatarUrl }));
      }

      // ✅ REFRESH ENTIRE USER PROFILE IN CONTEXT
      if (refreshUserProfile) {
        setTimeout(() => {
          refreshUserProfile();
        }, 500);
      }
      
      setSelectedImage(null);
      setImagePreview(null);
      setShowImageConfirm(false);
      setSuccessMessage('Profile picture updated successfully!');
      setShowSuccessModal(true);
    }
  } catch (err) {
    console.error('Image upload error:', err);
    toast.error(err.response?.data?.message || 'Failed to upload image');
  } finally {
    setUploading(false);
  }
};


  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setShowImageConfirm(true);
  };

  const passwordStrengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][passwordScore];
  const passwordStrengthText = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][passwordScore];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            My Profile
          </h1>
          <p className="text-gray-600 text-lg">Manage your account settings and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar - Profile Card */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Profile Header with Gradient */}
              <div className="relative h-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
              </div>

              {/* Avatar */}
              <div className="relative px-8 pb-8">
                <div className="relative -mt-20 mb-6">
                  <Dropzone onDrop={onDrop} accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}>
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()} className="cursor-pointer group">
                        <input {...getInputProps()} />
                        <div className="relative w-40 h-40 mx-auto">
                          <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1.5 shadow-2xl group-hover:shadow-indigo-500/50 transition-all duration-300">
                            <div className="w-full h-full rounded-[22px] overflow-hidden bg-white">
                              {imagePreview || user.avatar ? (
                                <img
                                  src={imagePreview || user.avatar}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                                  <span className="text-6xl font-black bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Camera Icon Overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-3xl flex items-center justify-center transition-all duration-300">
                            <div className="text-center">
                              <FaCamera className="text-white text-3xl mb-2 mx-auto" />
                              <p className="text-white text-sm font-semibold">Change Photo</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Dropzone>
                </div>

                {/* User Info */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
                  <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                    <FiMail className="text-indigo-600" />
                    {user.email}
                  </p>
                </div>

                {/* Profile Completion */}
                <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
                    <span className="text-sm font-bold text-indigo-600">{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${profileCompletion}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl text-center border border-blue-200">
                    <FiPackage className="text-3xl text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-900">{ordersCount}</p>
                    <p className="text-xs text-blue-600 font-medium">Orders</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl text-center border border-green-200">
                    <FiTrendingUp className="text-3xl text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-900">{profileCompletion}%</p>
                    <p className="text-xs text-green-600 font-medium">Complete</p>
                  </div>
                </div>

                {/* Last Login */}
                <div className="p-4 bg-gray-50 rounded-2xl mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FiClock className="text-lg text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-500">Last Login</p>
                      <p className="font-semibold text-gray-800">{lastLogin}</p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                {(user.linkedin || user.twitter || user.instagram) && (
                  <div className="flex justify-center gap-4 mb-6">
                    {user.linkedin && (
                      <motion.a
                        whileHover={{ scale: 1.1, y: -2 }}
                        href={user.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center hover:bg-blue-200 transition-colors"
                      >
                        <FaLinkedin className="text-2xl text-blue-600" />
                      </motion.a>
                    )}
                    {user.twitter && (
                      <motion.a
                        whileHover={{ scale: 1.1, y: -2 }}
                        href={user.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center hover:bg-sky-200 transition-colors"
                      >
                        <FaTwitter className="text-2xl text-sky-600" />
                      </motion.a>
                    )}
                    {user.instagram && (
                      <motion.a
                        whileHover={{ scale: 1.1, y: -2 }}
                        href={user.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center hover:bg-pink-200 transition-colors"
                      >
                        <FaInstagram className="text-2xl text-pink-600" />
                      </motion.a>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditMode(!editMode)}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <FaEdit />
                    {editMode ? 'Cancel Editing' : 'Edit Profile'}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                    className="w-full py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 border-2 border-gray-300"
                  >
                    <FiLock />
                    Change Password
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Edit Profile Form */}
            <AnimatePresence>
              {editMode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Edit Profile Information
                    </h3>
                    <motion.button
                      whileHover={{ rotate: 90 }}
                      onClick={() => setEditMode(false)}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <FaTimes className="text-2xl text-gray-400" />
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <FiUser className="inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-base"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <FiMail className="inline mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-base"
                        placeholder="your@email.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <FiPhone className="inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-base"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <FiMapPin className="inline mr-2" />
                        Address
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-base"
                        placeholder="123 Main St, City, Country"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <FaLinkedin className="inline mr-2 text-blue-600" />
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all text-base"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    {/* Twitter */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <FaTwitter className="inline mr-2 text-sky-600" />
                        Twitter Profile
                      </label>
                      <input
                        type="url"
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none transition-all text-base"
                        placeholder="https://twitter.com/username"
                      />
                    </div>

                    {/* Instagram */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <FaInstagram className="inline mr-2 text-pink-600" />
                        Instagram Profile
                      </label>
                      <input
                        type="url"
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-100 outline-none transition-all text-base"
                        placeholder="https://instagram.com/username"
                      />
                    </div>

                    {/* Bio - Full Width */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Bio / About Me
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows="4"
                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-base resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="mt-8 flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleProfileUpdate}
                      className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <FaSave />
                      Save Changes
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEditMode(false)}
                      className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold text-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Change Password Section */}
            <AnimatePresence>
              {showPasswordSection && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                      <FaShieldAlt />
                      Change Password
                    </h3>
                    <motion.button
                      whileHover={{ rotate: 90 }}
                      onClick={() => setShowPasswordSection(false)}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <FaTimes className="text-2xl text-gray-400" />
                    </motion.button>
                  </div>

                  <div className="max-w-xl space-y-6">
                    {/* Old Password */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.old ? 'text' : 'password'}
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full px-5 py-4 pr-14 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100 outline-none transition-all text-base"
                          placeholder="Enter current password"
                        />
                        <button
                          onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.old ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.new ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => handlePasswordChange(e.target.value)}
                          className="w-full px-5 py-4 pr-14 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100 outline-none transition-all text-base"
                          placeholder="Enter new password"
                        />
                        <button
                          onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.new ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
                        </button>
                      </div>
                      
                      {/* Password Strength Meter */}
                      {newPassword && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Password Strength</span>
                            <span className={`text-sm font-bold ${passwordStrengthColor.replace('bg-', 'text-')}`}>
                              {passwordStrengthText}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(passwordScore + 1) * 20}%` }}
                              className={`h-full rounded-full ${passwordStrengthColor} transition-all duration-300`}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.confirm ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-5 py-4 pr-14 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100 outline-none transition-all text-base"
                          placeholder="Confirm new password"
                        />
                        <button
                          onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.confirm ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
                        </button>
                      </div>
                      
                      {/* Password Match Indicator */}
                      {confirmPassword && (
                        <p className={`mt-2 text-sm font-medium ${
                          newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                        </p>
                      )}
                    </div>

                    {/* Update Button */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={updatePassword}
                      className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <FiLock />
                      Update Password
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Card when not editing */}
            {!editMode && !showPasswordSection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
              >
                <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
                  Account Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
                    <p className="text-sm font-semibold text-gray-500 mb-2">Full Name</p>
                    <p className="text-lg font-bold text-gray-900">{user.name || 'Not set'}</p>
                  </div>
                  
                  <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
                    <p className="text-sm font-semibold text-gray-500 mb-2">Email</p>
                    <p className="text-lg font-bold text-gray-900 truncate">{user.email}</p>
                  </div>
                  
                  <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
                    <p className="text-sm font-semibold text-gray-500 mb-2">Phone</p>
                    <p className="text-lg font-bold text-gray-900">{user.phone || 'Not set'}</p>
                  </div>
                  
                  <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
                    <p className="text-sm font-semibold text-gray-500 mb-2">Address</p>
                    <p className="text-lg font-bold text-gray-900">{user.address || 'Not set'}</p>
                  </div>
                  
                  {user.bio && (
                    <div className="md:col-span-2 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200">
                      <p className="text-sm font-semibold text-indigo-600 mb-2">Bio</p>
                      <p className="text-base text-gray-700 leading-relaxed">{user.bio}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Image Upload Confirmation */}
        {showImageConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={() => !uploading && setShowImageConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-indigo-500">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Update Profile Picture?</h3>
                <p className="text-gray-600">Are you sure you want to update your profile picture?</p>
              </div>
              
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleImageUpload}
                  disabled={uploading}
                  className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold shadow-lg disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                    </>
                  ) : (
                    'Yes, Update'
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowImageConfirm(false);
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  disabled={uploading}
                  className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-2xl font-semibold disabled:opacity-50"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-5xl text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSuccessModal(false)}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold shadow-lg"
              >
                OK
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
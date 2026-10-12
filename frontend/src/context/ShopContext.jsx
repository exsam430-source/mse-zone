import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { applyNewsletterDiscount } from "../utils/discount";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  // ==================== STATE INITIALIZATION ====================
  const currency = '$';
  const delivery_fee = 10;
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  // Search & UI State
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Cart & Products State
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);

  // Auth State
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [userLoading, setUserLoading] = useState(true);

  // Newsletter State
  const [newsletterDiscount, setNewsletterDiscount] = useState(
    JSON.parse(localStorage.getItem('newsletterDiscount')) || false
  );

  // ==================== FETCH USER PROFILE (INCLUDING AVATAR) ====================
  const fetchUserProfile = async (authToken) => {
    try {
      const res = await axios.get(`${backendURL}/api/profile/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      if (res.data.success) {
        const userData = res.data.user;
        
        // Construct full avatar URL if avatar exists
        const avatarUrl = userData.avatar 
          ? `${backendURL}${userData.avatar}?t=${Date.now()}`
          : null;
        
        const userWithAvatar = {
          ...userData,
          avatar: avatarUrl
        };
        
        setUser(userWithAvatar);
        return userWithAvatar;
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      // If profile fetch fails, create basic user object from token
      return null;
    }
  };

  // ==================== INITIALIZE USER ON APP MOUNT ====================
  useEffect(() => {
    const initializeUser = async () => {
      setUserLoading(true);
      const localToken = localStorage.getItem("token");

      // No token - load guest cart
      if (!localToken) {
        const savedCart = JSON.parse(localStorage.getItem("cartItems") || "{}");
        setCartItems(savedCart);
        setUserLoading(false);
        return;
      }

      try {
        const parts = localToken.split(".");
        if (parts.length !== 3) {
          throw new Error("Invalid token format");
        }

        const payload = JSON.parse(atob(parts[1]));

        // ===== HANDLE ADMIN TOKEN =====
        if (payload.role === 'admin' || payload.isAdmin === true) {
          setToken(localToken);
          setUser({
            _id: 'admin',
            name: 'Admin',
            email: payload.email || 'admin@example.com',
            avatar: null,
            isAdmin: true
          });
          setUserLoading(false);
          return;
        }

        // ===== HANDLE REGULAR USER TOKEN =====
        const userData = payload.user || payload;
        const userId = userData._id || userData.id;

        if (!userId) {
          throw new Error("User ID not found in token");
        }

        localStorage.setItem("userId", userId);
        setToken(localToken);
        setUserId(userId);

        // Fetch full user profile including avatar
        const fullUserData = await fetchUserProfile(localToken);
        
        if (!fullUserData) {
          // Fallback to basic user data if profile fetch fails
          setUser({
            _id: userId,
            name: userData.name || "User",
            email: userData.email || "",
            avatar: null,
          });
        }

        // Fetch user cart
        try {
          const res = await axios.post(
            `${backendURL}/api/cart/get`,
            { userId },
            { headers: { Authorization: `Bearer ${localToken}` } }
          );
          if (res.data.success) {
            setCartItems(res.data.cartData || {});
          } else {
            setCartItems({});
          }
        } catch (cartErr) {
          console.error("Failed to fetch cart:", cartErr);
          setCartItems({});
        }

        // Check newsletter
        if (userData.email) {
          try {
            const checkRes = await axios.get(`${backendURL}/api/newsletter/check`, {
              params: { email: userData.email },
            });
            if (checkRes.data.subscribed) {
              setNewsletterDiscount(true);
              localStorage.setItem("newsletterDiscount", true);
              localStorage.setItem("subscribedEmail", userData.email);
            } else {
              setNewsletterDiscount(false);
              localStorage.removeItem("newsletterDiscount");
              localStorage.removeItem("subscribedEmail");
            }
          } catch (err) {
            console.error("Newsletter check failed:", err);
          }
        }

      } catch (err) {
        console.error("Initialization error:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setToken('');
        setUser(null);
      } finally {
        setUserLoading(false);
      }
    };

    initializeUser();
  }, [backendURL]);

  // ==================== REFRESH USER PROFILE ====================
  const refreshUserProfile = async () => {
    if (!token || user?.isAdmin) return;
    
    try {
      const updatedUser = await fetchUserProfile(token);
      if (updatedUser) {
        console.log("User profile refreshed:", updatedUser);
      }
    } catch (err) {
      console.error("Failed to refresh user profile:", err);
    }
  };

  // ==================== CART FUNCTIONS ====================
  const addToCart = async (itemId, size = "default", color = "defaultColor", volume = "defaultVolume") => {
    if (!size) {
      toast.error("Select The Size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (!cartData[itemId]) cartData[itemId] = {};
    if (!cartData[itemId][size]) cartData[itemId][size] = {};
    if (!cartData[itemId][size][color]) cartData[itemId][size][color] = {};
    if (!cartData[itemId][size][color][volume]) cartData[itemId][size][color][volume] = { quantity: 0 };

    cartData[itemId][size][color][volume].quantity += 1;
    setCartItems(cartData);

    // Track analytics event
    try {
      const trackUserId = localStorage.getItem("userId") || null;
      await axios.post(`${backendURL}/api/analytics/events`, {
        userId: trackUserId,
        productId: itemId,
        type: "add_to_cart",
        meta: { size, color, volume }
      });
    } catch (err) {
      console.error("Add-to-cart tracking failed:", err);
    }

    // Save to backend if logged in
    if (token && userId && !user?.isAdmin) {
      try {
        await axios.post(
          `${backendURL}/api/cart/add`,
          { userId, itemId, size, color, volume },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Failed to add to cart:", error);
        toast.error("Failed to save cart item");
      }
    } else {
      localStorage.setItem("cartItems", JSON.stringify(cartData));
    }
  };

  const updateQuantity = async (itemId, size = "defaultSize", color = "defaultColor", volume = "defaultVolume", quantity) => {
    const newCart = structuredClone(cartItems);

    if (!newCart[itemId]) newCart[itemId] = {};
    if (!newCart[itemId][size]) newCart[itemId][size] = {};
    if (!newCart[itemId][size][color]) newCart[itemId][size][color] = {};

    if (quantity > 0) {
      newCart[itemId][size][color][volume] = { quantity };
    } else {
      delete newCart[itemId][size][color][volume];
      if (Object.keys(newCart[itemId][size][color]).length === 0) delete newCart[itemId][size][color];
      if (Object.keys(newCart[itemId][size]).length === 0) delete newCart[itemId][size];
      if (Object.keys(newCart[itemId]).length === 0) delete newCart[itemId];
    }

    setCartItems(newCart);

    if (token && userId && !user?.isAdmin) {
      try {
        await axios.post(
          `${backendURL}/api/cart/update`,
          { userId, itemId, size, color, volume, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Failed to update quantity:", err);
        toast.error("Failed to update cart");
      }
    } else {
      localStorage.setItem("cartItems", JSON.stringify(newCart));
    }
  };

  const getCartCount = () => {
    let count = 0;
    for (const itemId in cartItems) {
      const sizes = cartItems[itemId];
      for (const sizeKey in sizes) {
        const colors = sizes[sizeKey];
        for (const colorKey in colors) {
          const volumes = colors[colorKey];
          for (const volumeKey in volumes) {
            count += volumes[volumeKey]?.quantity || 0;
          }
        }
      }
    }
    return count;
  };

  const getCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const product = products.find(p => p._id === itemId);
      if (!product) continue;

      const sizes = cartItems[itemId];
      for (const sizeKey in sizes) {
        const colors = sizes[sizeKey];
        for (const colorKey in colors) {
          const volumes = colors[colorKey];
          for (const volumeKey in volumes) {
            const quantity = volumes[volumeKey]?.quantity || 0;
            total += applyNewsletterDiscount(product.price, newsletterDiscount) * quantity;
          }
        }
      }
    }
    return total;
  };

  // ==================== PRODUCTS FUNCTIONS ====================
  const getProductsData = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/product/list`);
      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        console.error("Failed to fetch products:", res.data.message);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const getUserCart = async () => {
    if (!token || !userId || user?.isAdmin) {
      console.log("Skipping cart fetch - Admin user or not logged in");
      return;
    }

    try {
      const res = await axios.post(
        `${backendURL}/api/cart/get`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setCartItems(res.data.cartData || {});
      } else {
        setCartItems({});
      }
    } catch (err) {
      console.error("Failed to fetch user cart:", err);
      setCartItems({});
    }
  };

  // ==================== NEWSLETTER / DISCOUNT FUNCTIONS ====================
  const checkNewsletterEmail = async (email) => {
    try {
      const res = await axios.get(`${backendURL}/api/newsletter/check`, { params: { email } });
      const subscribed = res.data.subscribed;
      setNewsletterDiscount(subscribed);
      localStorage.setItem('newsletterDiscount', subscribed);
      localStorage.setItem('subscribedEmail', email);
      return subscribed;
    } catch (err) {
      console.error("Failed to check newsletter:", err);
      setNewsletterDiscount(false);
      localStorage.removeItem('newsletterDiscount');
      return false;
    }
  };

  const applyNewsletterDiscountForUser = async (email) => {
    if (!token) {
      toast.info("Login to apply 10% discount.");
      return false;
    }
    if (!email) {
      toast.error("Email is required for discount.");
      return false;
    }

    try {
      const res = await axios.post(
        `${backendURL}/api/newsletter/apply-discount`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setNewsletterDiscount(true);
        localStorage.setItem("newsletterDiscount", true);
        localStorage.setItem("subscribedEmail", email);
        return true;
      } else {
        toast.info(res.data.message || "Cannot apply discount.");
        return false;
      }
    } catch (err) {
      console.error("Failed to apply discount:", err);
      toast.error("Failed to apply discount.");
      return false;
    }
  };

  const autoApplyNewsletterDiscount = async (userEmail, userToken) => {
    if (!userEmail || !userToken) {
      setNewsletterDiscount(false);
      localStorage.removeItem('newsletterDiscount');
      localStorage.removeItem('subscribedEmail');
      return;
    }

    try {
      const checkRes = await axios.get(`${backendURL}/api/newsletter/check`, {
        params: { email: userEmail },
      });

      if (checkRes.data.subscribed) {
        setNewsletterDiscount(true);
        localStorage.setItem('newsletterDiscount', true);
        localStorage.setItem('subscribedEmail', userEmail);
      } else {
        setNewsletterDiscount(false);
        localStorage.removeItem('newsletterDiscount');
        localStorage.removeItem('subscribedEmail');
      }
    } catch (err) {
      console.error("Failed to auto apply discount:", err);
      setNewsletterDiscount(false);
    }
  };

  const removeDiscount = () => {
    setNewsletterDiscount(false);
    localStorage.removeItem('newsletterDiscount');
    localStorage.removeItem('subscribedEmail');
  };

  const unsubscribeNewsletterForUser = async (email) => {
    if (!token) {
      toast.info("Login required to unsubscribe.");
      return false;
    }
    if (!email) {
      toast.error("Email is required.");
      return false;
    }

    try {
      const res = await axios.post(
        `${backendURL}/api/newsletter/unsubscribe`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success(res.data.message || "You have unsubscribed successfully.");
        removeDiscount();
        return true;
      } else {
        toast.error(res.data.message || "Failed to unsubscribe.");
        return false;
      }
    } catch (err) {
      console.error("Failed to unsubscribe:", err);
      toast.error("Failed to unsubscribe.");
      return false;
    }
  };

  // ==================== AUTH FUNCTIONS ====================
  const logout = () => {
    setToken('');
    setUser(null);
    setUserId('');
    setCartItems({});
    setNewsletterDiscount(false);

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('newsletterDiscount');
    localStorage.removeItem('subscribedEmail');

    navigate('/login', { replace: true });
    toast.success("Logged out successfully");
  };

  // ==================== EFFECTS ====================
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    getProductsData();
  }, [backendURL]);

  useEffect(() => {
    if (user?.isAdmin) {
      console.log("Admin user - skipping cart fetch");
      setCartItems({});
      return;
    }

    if (token && userId) {
      getUserCart();
    }
  }, [token, userId, backendURL, user?.isAdmin]);

  // ==================== CONTEXT VALUE ====================
  const value = {
    search,
    setSearch,
    showSearch,
    setShowSearch,

    products,
    getProductsData,

    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    getUserCart,

    user,
    setUser,
    token,
    setToken,
    userId,
    userLoading,
    logout,
    refreshUserProfile, // Add this new function

    newsletterDiscount,
    checkNewsletterEmail,
    applyNewsletterDiscount: applyNewsletterDiscountForUser,
    autoApplyNewsletterDiscount,
    unsubscribeNewsletterForUser,
    removeDiscount,

    currency,
    delivery_fee,
    navigate,
    backendURL,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
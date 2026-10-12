import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// FRONTEND PAGES
import Home from "./Pages/frontend/Home.jsx";
import About from "./Pages/frontend/About.jsx";
import Cart from "./Pages/frontend/Cart.jsx";
import Collection from "./Pages/frontend/Collection.jsx";
import ProductPage from "./Pages/frontend/Product.jsx";
import Contact from "./Pages/frontend/Contact.jsx";

// Login and passwords
import Login from "./Pages/frontend/Login.jsx";
import ForgotPassword from "./Pages/frontend/ForgotPassword.jsx";
import ResetPassword from "./Pages/frontend/ResetPassword.jsx";

import Orders from "./Pages/frontend/Orders.jsx";
import PlaceOrder from "./Pages/frontend/PlaceOrder.jsx";
import Profile from "./Pages/frontend/Profile.jsx";
import RefundPolicy from "./Pages/frontend/RefundPolicy.jsx";
import ReturnPolicy from "./Pages/frontend/ReturnPolicy.jsx";
import WholesalePolicy from "./Pages/frontend/WholesalePolicy.jsx";
import ReturnRequest from './pages/frontend/ReturnRequest.jsx';
import UserReturns from './pages/frontend/UserReturns.jsx';

// ADMIN PAGES
import Add from "./Pages/Admin/Add.jsx";
import List from "./Pages/Admin/List.jsx";
import AdminOrders from "./Pages/Admin/AdminOrders.jsx";
import AdminAnalytics from "./Pages/Admin/AdminAnalytics.jsx";
import AdminReturns from "./pages/Admin/AdminReturns.jsx";

// COMPONENTS
import NavbarFrontend from "./Components/Frontend/Navbar.jsx";
import NavbarAdmin from "./Components/Admin/Navbar.jsx";
import Footer from "./Components/Frontend/Footer.jsx";
import AdminLayout from "./Components/Admin/AdminLayout.jsx";

// CONTEXT
import ShopContextProvider from "./context/ShopContext.jsx";

// ENV
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "$";

// ✅ Scroll to Top ONLY on actual page navigation - NOT on re-renders
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathRef = React.useRef(pathname);

  useEffect(() => {
    // ✅ Only scroll if path actually changed
    if (prevPathRef.current !== pathname) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      prevPathRef.current = pathname;
    }
  }, [pathname]);

  return null;
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Verify admin token on mount
  useEffect(() => {
    const verifyAdmin = async () => {
      if (!token || !isAdmin) {
        setLoading(false);
        return;
      }

      try {
        await axios.get(`${backendUrl}/api/user/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        setToken("");
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [token, isAdmin]);

  // ✅ Admin logout
  const handleAdminLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    setToken("");
    setIsAdmin(false);
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ShopContextProvider>
      {/* ✅ ScrollToTop - only triggers on real route changes */}
      <ScrollToTop />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Routes>
        {/* ================= FRONTEND ROUTES ================= */}
        <Route
          path="/*"
          element={
            <>
              <NavbarFrontend />
              <div className="pt-24 lg:pt-28">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/collection" element={<Collection />} />
                  <Route path="/product/:productId" element={<ProductPage />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route
                    path="/login"
                    element={
                      <Login
                        setAppToken={setToken}
                        setAppIsAdmin={setIsAdmin}
                      />
                    }
                  />
                  <Route path="/verify-email" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route
                    path="/return/:orderId"
                    element={<ReturnRequest />}
                  />
                  <Route path="/returns" element={<UserReturns />} />
                  <Route path="/place-order" element={<PlaceOrder />} />
                  <Route path="/return-policy" element={<ReturnPolicy />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route
                    path="/wholesale-policy"
                    element={<WholesalePolicy />}
                  />
                </Routes>
                <Footer />
              </div>
            </>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin/*"
          element={
            token && isAdmin ? (
              <>
                <NavbarAdmin
                  handleLogout={handleAdminLogout}
                  toggleSidebar={toggleSidebar}
                />
                <AdminLayout
                  sidebarOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                >
                  <Routes>
                    <Route
                      index
                      element={<Navigate to="analytics" replace />}
                    />
                    <Route
                      path="analytics"
                      element={<AdminAnalytics token={token} />}
                    />
                    <Route path="add" element={<Add token={token} />} />
                    <Route path="list" element={<List token={token} />} />
                    <Route
                      path="AdminOrders"
                      element={<AdminOrders token={token} />}
                    />
                    <Route
                      path="returns"
                      element={<AdminReturns token={token} />}
                    />
                  </Routes>
                </AdminLayout>
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </ShopContextProvider>
  );
};

export default App;
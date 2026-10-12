import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AdminLogin = ({ setToken, setIsAdmin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/user/admin`, { email, password });
      if (response.data.success) {
        const token = response.data.token;
        setToken(token);
        setIsAdmin(true);
        localStorage.setItem("token", token);
        localStorage.setItem("isAdmin", "true");
        toast.success("Admin login successful!");
      } else {
        toast.error("Wrong Email or Password Or User Don't exist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while logging in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-100 to-gray-300">
      <div className="bg-white rounded-xl shadow-2xl px-10 py-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Panel Login</h1>
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all font-semibold shadow-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
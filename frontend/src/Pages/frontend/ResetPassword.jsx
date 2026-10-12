import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { backendURL } = useContext(ShopContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link");
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${backendURL}/api/user/reset-password`, {
        token,
        password,
        confirmPassword
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4'>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-5 bg-white shadow-2xl rounded-2xl w-full sm:max-w-md p-8 border border-gray-200'
      >
        <div className='text-center mb-2'>
          <p className='text-3xl font-bold text-gray-800'>Create New Password</p>
          <p className='text-sm text-gray-600 mt-2'>Enter your new password below</p>
          <hr className='mt-4 h-[2px] w-10 mx-auto bg-gradient-to-r from-green-600 to-emerald-600 border-none rounded' />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="border border-gray-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all duration-200"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="border border-gray-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all duration-200"
          required
          disabled={loading}
        />

        <button
          disabled={loading}
          className='bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium py-2 rounded-lg mt-3 hover:from-green-700 hover:to-emerald-700 active:from-green-800 active:to-emerald-800 transition-all duration-200 disabled:opacity-50'
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;

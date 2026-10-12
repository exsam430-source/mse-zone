import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { backendURL } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${backendURL}/api/user/forgot-password`, { email });

      if (response.data.success) {
        toast.success(response.data.message);
        setEmail('');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to send reset email");
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
          <p className='text-3xl font-bold text-gray-800'>Reset Password</p>
          <p className='text-sm text-gray-600 mt-2'>Enter your email to receive a password reset link</p>
          <hr className='mt-4 h-[2px] w-10 mx-auto bg-gradient-to-r from-red-600 to-pink-600 border-none rounded' />
        </div>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all duration-200'
          placeholder='Email Address'
          required
          disabled={loading}
        />

        <button
          disabled={loading}
          className='bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium py-2 rounded-lg mt-3 hover:from-red-700 hover:to-pink-700 active:from-red-800 active:to-pink-800 transition-all duration-200 disabled:opacity-50'
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <p 
          className='text-sm text-center text-gray-600 cursor-pointer hover:text-indigo-600'
          onClick={() => navigate('/login')}
        >
          Back to Login
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;

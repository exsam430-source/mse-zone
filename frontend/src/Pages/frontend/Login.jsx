import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { FaGoogle } from 'react-icons/fa';

const Login = ({ setAppToken, setAppIsAdmin }) => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, setUser, backendURL, autoApplyNewsletterDiscount } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [verifying, setVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const verificationToken = searchParams.get('token');

  // Admin emails for auto-detection
  const ADMIN_EMAILS = [
    'sam@gmail.com',
    import.meta.env.VITE_ADMIN_EMAIL
  ].filter(Boolean).map(e => e.toLowerCase());

  const isAdminEmail = (email) => {
    return ADMIN_EMAILS.includes(email?.toLowerCase());
  };

  // --- Email Verification ---
  useEffect(() => {
    if (verificationToken) {
      verifyEmailToken(verificationToken);
    }
  }, [verificationToken]);

  const verifyEmailToken = async (token) => {
    try {
      setVerifying(true);
      setVerificationMessage('Verifying your email...');
      const response = await axios.post(`${backendURL}/api/user/verify-email`, { token });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user._id);
        setVerificationMessage("✅ Email verified! Redirecting...");
        toast.success("Email verified! You're now logged in");
        setTimeout(() => navigate('/'), 2000);
      } else {
        setVerificationMessage(`❌ ${response.data.message}`);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setVerificationMessage("❌ Email verification failed");
      toast.error("Email verification failed");
    } finally {
      setVerifying(false);
    }
  };

  // --- Redirect if already logged in ---
  useEffect(() => {
    if (token && !verificationToken) {
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      if (isAdmin) {
        navigate('/admin/analytics', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [token, navigate, verificationToken]);

  // --- Handle Admin Login ---
  const handleAdminLogin = async (email, password) => {
    try {
      const response = await axios.post(`${backendURL}/api/user/admin`, { email, password });
      
      if (response.data.success) {
        const adminToken = response.data.token;
        
        localStorage.setItem('token', adminToken);
        localStorage.setItem('isAdmin', 'true');
        
        if (setAppToken) setAppToken(adminToken);
        if (setAppIsAdmin) setAppIsAdmin(true);
        
        setToken(adminToken);
        setUser({
          _id: 'admin',
          name: 'Admin',
          email: email,
          isAdmin: true
        });
        
        toast.success("Admin login successful!");
        navigate('/admin/analytics', { replace: true });
        return true;
      } else {
        toast.error(response.data.message || "Invalid admin credentials");
        return false;
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("Admin login failed");
      return false;
    }
  };

  // --- Handle User Login ---
  const handleUserLogin = async (email, password) => {
    try {
      const res = await axios.post(`${backendURL}/api/user/login`, { email, password });

      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.user._id);
        localStorage.setItem('email', res.data.user.email);
        localStorage.removeItem('isAdmin');
        
        if (setAppToken) setAppToken(res.data.token);
        if (setAppIsAdmin) setAppIsAdmin(false);
        
        toast.success("Login Successful");
        autoApplyNewsletterDiscount(res.data.user.email, res.data.token);
        navigate('/', { replace: true });
        return true;
      } else {
        toast.error(res.data.message);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  // --- Form Submission ---
  const onsubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (currentState === 'Sign Up') {
        if (isAdminEmail(email)) {
          toast.error("This email is reserved for admin.");
          setLoading(false);
          return;
        }

        const response = await axios.post(`${backendURL}/api/user/register`, { 
          name, email, password, phone, address 
        });

        if (response.data.success) {
          toast.success(response.data.message || "Registration successful! Check your email.");
          setCurrentState('Login');
          setName(''); 
          setEmail(''); 
          setPassword(''); 
          setPhone(''); 
          setAddress('');
        } else {
          toast.error(response.data.message);
        }
      } else {
        // Login - auto detect admin or user
        if (isAdminEmail(email)) {
          await handleAdminLogin(email, password);
        } else {
          await handleUserLogin(email, password);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Custom Google Login using useGoogleLogin hook - FIXES 403 ERROR
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        // Get user info from Google using access token
        const googleUserInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        const googleUser = googleUserInfo.data;

        // Check if admin email
        if (isAdminEmail(googleUser.email)) {
          toast.error("Admin accounts must login with email and password");
          setLoading(false);
          return;
        }

        // Send to backend
        const response = await axios.post(`${backendURL}/api/user/google-login`, {
          email: googleUser.email,
          name: googleUser.name,
          profileImage: googleUser.picture,
          googleId: googleUser.sub
        });

        if (response.data.success) {
          setToken(response.data.token);
          setUser(response.data.user);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.user._id);
          localStorage.setItem('email', response.data.user.email);
          localStorage.removeItem('isAdmin');
          
          if (setAppToken) setAppToken(response.data.token);
          if (setAppIsAdmin) setAppIsAdmin(false);
          
          toast.success("Google login successful!");
          
          if (autoApplyNewsletterDiscount) {
            autoApplyNewsletterDiscount(response.data.user.email, response.data.token);
          }
          
          navigate('/', { replace: true });
        } else {
          toast.error(response.data.message || "Google login failed");
        }
      } catch (error) {
        console.error("Google auth error:", error);
        toast.error(error.response?.data?.message || "Google authentication failed");
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
    },
  });

  // --- Render Verification Page ---
  if (verificationToken) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4'>
        <div className='bg-white shadow-2xl rounded-2xl w-full sm:max-w-md p-8 border border-gray-200 text-center'>
          {verifying && (
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}
          <p className='text-lg font-medium text-gray-800'>
            {verificationMessage || "Verifying your email..."}
          </p>
        </div>
      </div>
    );
  }

  // --- Render Login/Signup Form ---
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4'>
      <form 
        onSubmit={onsubmitHandler} 
        className='flex flex-col gap-5 bg-white shadow-2xl rounded-2xl w-full sm:max-w-md p-8 border border-gray-200'
      >
        {/* Header */}
        <div className='text-center mb-2'>
          <p className='text-3xl font-bold text-gray-800'>{currentState}</p>
          <hr className='mt-2 h-[2px] w-10 mx-auto bg-gradient-to-r from-indigo-600 to-blue-600 border-none rounded' />
          <p className='text-sm text-gray-500 mt-2'>
            {currentState === 'Login' 
              ? 'Sign in to your account (Customer or Admin)' 
              : 'Create a new customer account'}
          </p>
        </div>

        {/* Input Fields */}
        {currentState !== 'Login' && (
          <input
            value={name} 
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder='Full Name'
            className='w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none'
            required 
            disabled={loading}
          />
        )}
        
        <input
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder='Email Address'
          className='w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none'
          required 
          disabled={loading}
        />
        
        {/* Admin email indicator */}
        {email && isAdminEmail(email) && currentState === 'Login' && (
          <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 p-3 rounded-lg -mt-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">🔐 Admin account detected</span>
          </div>
        )}
        
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
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
        
        {currentState !== 'Login' && (
          <>
            <input 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              type="number" 
              placeholder='Phone Number' 
              required 
              disabled={loading} 
              className='w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none' 
            />
            <input 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              type="text" 
              placeholder='Address' 
              required 
              disabled={loading} 
              className='w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none' 
            />
          </>
        )}

        {/* Options */}
        <div className='flex justify-between text-sm text-gray-600'>
          <p 
            className='cursor-pointer hover:text-indigo-600 transition-colors' 
            onClick={() => navigate('/forgot-password')}
          >
            Forgot password?
          </p>
          {currentState === 'Login' ? 
            <p 
              className='cursor-pointer hover:text-indigo-600 transition-colors' 
              onClick={() => setCurrentState('Sign Up')}
            >
              Create account
            </p> :
            <p 
              className='cursor-pointer hover:text-indigo-600 transition-colors' 
              onClick={() => setCurrentState('Login')}
            >
              Already have account?
            </p>
          }
        </div>

        {/* Submit Button */}
        <button 
          disabled={loading} 
          className={`text-white font-medium py-3 rounded-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 ${
            isAdminEmail(email) && currentState === 'Login'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
              : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              {isAdminEmail(email) && currentState === 'Login' ? (
                <>🔐 Sign In as Admin</>
              ) : (
                currentState === 'Login' ? 'Sign In' : 'Sign Up'
              )}
            </>
          )}
        </button>

        {/* ✅ Custom Google Button - No 403/COOP Errors */}
        {!isAdminEmail(email) && (
          <>
            <div className='flex items-center gap-3 my-2'>
              <div className='flex-1 h-px bg-gray-300'></div>
              <p className='text-xs text-gray-500'>OR</p>
              <div className='flex-1 h-px bg-gray-300'></div>
            </div>

            <button
              type="button"
              onClick={() => googleLogin()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loading ? "Please wait..." : currentState === 'Login' ? "Sign in with Google" : "Sign up with Google"}
            </button>
          </>
        )}

        {/* Admin redirect note */}
        {isAdminEmail(email) && currentState === 'Login' && (
          <p className='text-xs text-purple-600 text-center bg-purple-50 p-2 rounded-lg'>
            You will be redirected to Admin Panel after login
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
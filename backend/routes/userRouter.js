import express from 'express';
import { 
  loginUser, 
  registerUser, 
  verifyEmail, 
  forgotPassword, 
  resetPassword, 
  googleLogin, 
  adminLogin,
  resendVerificationEmail
} from '../controllers/userController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/verify-email', verifyEmail);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/google-login', googleLogin);
userRouter.post('/admin', adminLogin);
userRouter.post('/resend-verification', resendVerificationEmail);

// Admin verification route
userRouter.get('/verify', adminAuth, (req, res) => {
  res.json({ success: true, message: 'Admin verified' });
});

export default userRouter;
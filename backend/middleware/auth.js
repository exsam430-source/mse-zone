import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const authUser = async (req, res, next) => {
  // Get token from either standard Authorization header
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers.token) {
    token = req.headers.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. Login again.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach full user object (excluding password)
    const user = await userModel.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'User not found.' });

    req.user = user;

    if (!req.body) req.body = {};
    req.body.userId = user._id;

    next();
  } catch (error) {
    console.warn('authUser error:', error.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export default authUser;

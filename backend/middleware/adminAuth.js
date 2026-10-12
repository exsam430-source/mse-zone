import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  try {
    // Get token from multiple possible locations
    const rawToken =
      req.headers.token ||
      req.headers.authorization?.split(' ')[1] ||
      req.body.token;

    if (!rawToken) {
      console.warn('adminAuth: missing token');
      return res.status(401).json({ success: false, message: 'Not authorized - Token required' });
    }

    // Verify and decode token
    const decoded = jwt.verify(rawToken, process.env.JWT_SECRET);

    // Check if it's an admin token
    const isAdmin = decoded.role === 'admin' || decoded.isAdmin === true;

    if (!isAdmin) {
      console.warn('adminAuth: Not an admin user');
      return res.status(401).json({ success: false, message: 'Not authorized - Admin access required' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.warn('adminAuth error:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized - Invalid token' });
  }
};

export default adminAuth;

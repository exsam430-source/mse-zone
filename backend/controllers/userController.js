import validator from 'validator';
import userModel from "../models/userModel.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// ==================== EMAIL SETUP ====================
let transporter;
let emailReady = false;

const initializeEmailTransporter = async () => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.error('❌ SMTP credentials (SMTP_USER/SMTP_PASS) not defined in .env');
    emailReady = false;
    return false;
  }

  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = port === 465;

  console.log(`📧 Trying SMTP config (Hostinger/Custom): ${host}:${port}...`);
  try {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    await transporter.verify();
    console.log(`✅ SMTP transporter ready for email delivery`);
    emailReady = true;
    return true;
  } catch (error) {
    console.error(`❌ SMTP configuration failed: ${error.message}`);
    emailReady = false;
    return false;
  }
};

// Initialize on startup
initializeEmailTransporter();

// ==================== TOKEN CREATION ====================
const createToken = (user) => {
  return jwt.sign({
    id: user._id,
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || ""
  }, process.env.JWT_SECRET, { expiresIn: "30d" })
};

// ==================== SEND VERIFICATION EMAIL ====================
const sendVerificationEmail = async (email, verificationToken) => {
  if (!emailReady) {
    console.error("Email transporter not ready");
    return false;
  }

  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: `"MSE Zone" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '📧 Verify Your Email - Welcome to Our Store!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Welcome! 🎉</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Verify your email to get started</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
              Hello,<br><br>
              Thank you for registering! Please verify your email by clicking the button below.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 13px; margin-top: 20px;">
              Or copy this link: <br>
              <code style="background: #f3f4f6; padding: 10px; border-radius: 5px; display: block; margin-top: 10px; word-break: break-all;">
                ${verificationUrl}
              </code>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            
            <p style="color: #9ca3af; font-size: 12px;">
              This link expires in 24 hours. If you didn't create this account, ignore this email.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending verification email:", error.message);
    return false;
  }
};

// ==================== SEND RESET PASSWORD EMAIL ====================
const sendResetPasswordEmail = async (email, resetToken) => {
  if (!emailReady) {
    console.error("Email transporter not ready");
    return false;
  }

  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"MSE Zone" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '🔐 Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Password Reset 🔐</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Create a new password</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
              Hello,<br><br>
              Click the button below to reset your password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 13px; margin-top: 20px;">
              Or copy this link: <br>
              <code style="background: #f3f4f6; padding: 10px; border-radius: 5px; display: block; margin-top: 10px; word-break: break-all;">
                ${resetUrl}
              </code>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            
            <p style="color: #9ca3af; font-size: 12px;">
              This link expires in 1 hour. If you didn't request this, ignore this email.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Reset password email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending reset email:", error.message);
    return false;
  }
};

// ==================== REGISTER USER ====================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if trying to register with admin email
    if (email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()) {
      return res.json({ success: false, message: "This email is reserved." });
    }

    // Check if user exists
    const exist = await userModel.findOne({ email: email.toLowerCase() });
    if (exist) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    // Validate password
    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');

    // Create new user
    const newUser = new userModel({
      name,
      email: email.toLowerCase(),
      password: hashPassword,
      phone: phone || 0,
      address: address || '',
      isVerified: false,
      verificationToken: verificationTokenHash,
      verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000
    });

    const user = await newUser.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationToken);

    if (emailSent) {
      res.json({
        success: true,
        message: "Registration successful! Check your email to verify your account.",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || ""
        }
      });
    } else {
      // Still successful but email failed
      res.json({
        success: true,
        message: "Account created! Email verification couldn't be sent. Contact support.",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || ""
        }
      });
    }
  } catch (error) {
    console.log('Registration error:', error);
    res.json({ success: false, message: error.message });
  }
};

// ==================== VERIFY EMAIL ====================
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.json({ success: false, message: "Verification token is required" });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await userModel.findOne({
      verificationToken: tokenHash,
      verificationTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.json({ success: false, message: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    const authToken = createToken(user);

    res.json({
      success: true,
      message: "Email verified successfully!",
      token: authToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || ""
      }
    });
  } catch (error) {
    console.log('Email verification error:', error);
    res.json({ success: false, message: error.message });
  }
};

// ==================== LOGIN USER ====================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.json({ success: false, message: "Please verify your email first" });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = createToken(user);

    res.json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || ""
      },
    });
  } catch (error) {
    console.log("Login error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ==================== FORGOT PASSWORD ====================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
    await user.save();

    const emailSent = await sendResetPasswordEmail(email, resetToken);

    if (emailSent) {
      res.json({
        success: true,
        message: "Password reset link sent to your email"
      });
    } else {
      res.json({
        success: false,
        message: "Failed to send reset email. Try again later."
      });
    }
  } catch (error) {
    console.log('Forgot password error:', error);
    res.json({ success: false, message: error.message });
  }
};

// ==================== RESET PASSWORD ====================
const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.json({ success: false, message: "Passwords do not match" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await userModel.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.json({ success: false, message: "Invalid or expired reset token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.passwordUpdatedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully!"
    });
  } catch (error) {
    console.log('Reset password error:', error);
    res.json({ success: false, message: error.message });
  }
};

// ==================== GOOGLE LOGIN ====================
const googleLogin = async (req, res) => {
  try {
    const { email, name, profileImage } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    if (email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()) {
      return res.json({ 
        success: false, 
        message: "Admin cannot use Google Sign-In" 
      });
    }

    let user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = new userModel({
        name: name || "User",
        email: email.toLowerCase(),
        avatar: profileImage || "",
        isVerified: true,
        password: hashedPassword,
        phone: 0,
        address: ""
      });
      await user.save();
    } else {
      if (!user.avatar && profileImage) {
        user.avatar = profileImage;
      }
      user.lastLogin = new Date();
      await user.save();
    }

    const token = createToken(user);

    res.json({
      success: true,
      message: "Google login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || ""
      }
    });
  } catch (error) {
    console.log('Google login error:', error);
    res.json({ success: false, message: error.message });
  }
};

// ==================== ADMIN LOGIN ====================
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Email and password are required" });
    }

    // Find user in database
    const user = await userModel.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    // Verify user role is admin
    if (user.role !== 'admin') {
      return res.json({ success: false, message: 'Not authorized as admin' });
    }

    // Compare provided password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ 
        id: user._id,
        email: user.email, 
        role: 'admin',
        isAdmin: true,
        _id: user._id
      }, process.env.JWT_SECRET, { expiresIn: '7d' });
      
      res.json({ 
        success: true, 
        token,
        message: "Admin login successful"
      });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ==================== RESEND VERIFICATION ====================
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    const user = await userModel.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ success: false, message: "Email already verified" });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');

    user.verificationToken = verificationTokenHash;
    user.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const emailSent = await sendVerificationEmail(email, verificationToken);

    if (emailSent) {
      res.json({
        success: true,
        message: "Verification email sent!"
      });
    } else {
      res.json({
        success: false,
        message: "Failed to send email. Try again."
      });
    }
  } catch (error) {
    console.log('Resend verification error:', error);
    res.json({ success: false, message: error.message });
  }
};

export {
  loginUser,
  registerUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleLogin,
  adminLogin,
  resendVerificationEmail
};
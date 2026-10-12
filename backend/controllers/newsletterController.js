import Newsletter from "../models/Newsletter.js";
import validator from "validator";

// validate email
const validateEmail = (email) => {
  return validator.isEmail(email);
};

// Subscribe
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already subscribed" });
    }

    const newSub = await Newsletter.create({ email: email.toLowerCase() });
    res.status(201).json({ success: true, message: "Subscribed successfully", data: newSub });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Check subscription
export const checkNewsletterEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const exists = await Newsletter.exists({ email: email.toLowerCase() });
    res.status(200).json({ success: true, subscribed: !!exists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Apply discount
export const applyDiscount = async (req, res) => {
  try {
    const { email } = req.body;
    const userEmail = req.user.email;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    // Check subscription
    const exists = await Newsletter.findOne({ email: email.toLowerCase() });
    if (!exists) {
      return res.status(400).json({ success: false, message: "Email not subscribed" });
    }

    // Case-insensitive comparison with logged-in user
    if (userEmail.toLowerCase() !== email.toLowerCase()) {
      return res.status(400).json({ success: false, message: "This email does not belong to your account" });
    }

    // All good → apply discount
    res.status(200).json({ success: true, discount: 10 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Clear discount on logout
export const clearDiscount = async (req, res) => {
  try {
    // if you store discount in user DB
    if (req.user) {
      req.user.discount = 0;
      await req.user.save();
    }
    res.status(200).json({ success: true, message: "Discount removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to clear discount" });
  }
};

// Unsubscribe
export const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    const deleted = await Newsletter.findOneAndDelete({ email: email.toLowerCase() });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Email not found in subscription" });
    }

    res.status(200).json({ success: true, message: "Unsubscribed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


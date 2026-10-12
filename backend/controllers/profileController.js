import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import path from 'path';
import fs from 'fs';

// Get logged-in user profile
export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const user = req.user;

    // Delete old image if exists
    if (user.avatar) {
      const relativePath = user.avatar.startsWith('/') ? user.avatar.slice(1) : user.avatar;
      const oldPath = path.join(process.cwd(), relativePath);

      try {
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      } catch (err) {
        console.error('Failed to delete old avatar:', err);
      }
    }

    user.avatar = `/Images/profileImages/${req.file.filename}`;
    await user.save();

    res.json({ success: true, message: "Profile image uploaded", avatar: user.avatar });
  } catch (err) {
    console.error('Upload image error:', err);
    res.status(500).json({ success: false, message: `Failed to upload image: ${err.message}` });
  }
};

// Update profile info
export const updateProfile = async (req, res) => {
  try {
    const {
      name, email, phone, address, bio,
      linkedin, twitter, instagram,
      notifications
    } = req.body;

    const user = req.user;

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (bio) user.bio = bio;

    // Update social links
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (twitter !== undefined) user.twitter = twitter;
    if (instagram !== undefined) user.instagram = instagram;

    // Update notifications
    if (notifications) {
      user.notifications.email = notifications.email ?? user.notifications.email;
      user.notifications.marketing = notifications.marketing ?? user.notifications.marketing;
      user.notifications.privacy = notifications.privacy ?? user.notifications.privacy;
    }

    // Recalculate profile completion dynamically
    const fields = [user.avatar, user.name, user.email, user.phone, user.address, user.bio, user.linkedin, user.twitter, user.instagram];
    const filled = fields.filter(f => f && f !== "").length;
    user.profileCompletion = Math.round((filled / fields.length) * 100);

    await user.save();
    res.json({ success: true, message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;

    if (!newPassword) {
      return res.status(400).json({ success: false, message: "New password is required" });
    }

    if (user.password) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Old password incorrect" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordUpdatedAt = new Date();
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

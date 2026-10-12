import express from "express";
import auth from "../middleware/auth.js";
import { getProfile, updateProfile, updatePassword, uploadProfileImage } from "../controllers/profileController.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import userModel from "../models/userModel.js";

const router = express.Router();

// Multer storage setup for profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "Images/profileImages");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile_${req.user._id}${ext}`);
  },
});

const upload = multer({ storage });

// Existing profile routes
router.get("/me", auth, getProfile);
router.put("/me", auth, updateProfile);
router.put("/me/password", auth, updatePassword);

// New: Upload profile image
router.post("/me/upload", auth, upload.single("image"), uploadProfileImage);

export default router;

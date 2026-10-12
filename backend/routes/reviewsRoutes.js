import express from "express";
import multer from "multer";
import { addReview, deleteReview, getReviews } from "../controllers/reviewsController.js";
import authUser from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "Images/ReviewImages/"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname)
});

const upload = multer({ storage });

// ADD REVIEW
router.post("/review/:id", upload.array("images", 3), addReview);

// GET REVIEWS
router.get("/:productId", getReviews);


// DELETE REVIEW - only by owner
router.delete("/review/:productId/:reviewId", authUser, deleteReview);

export default router;

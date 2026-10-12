import Review from "../models/Review.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// ADD REVIEW
export const addReview = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { userId, rating, comment, name, email } = req.body;

    const imagePaths = req.files ? req.files.map(f => f.path) : [];

    const newReview = await Review.create({
      productId,
      userId,
      rating,
      comment,
      name,
      email,
      images: imagePaths,
      date: new Date()
    });

    const reviews = await Review.find({ productId })
      .populate("userId", "name email avatar")
      .sort({ date: -1 });

    res.json({ success: true, reviews });
  } catch (err) {
    console.error("Add review error:", err);
    res.status(500).json({ success: false, message: "Failed to add review" });
  }
};


// GET REVIEWS
export const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const skip = parseInt(req.query.skip) ;
    const limit = parseInt(req.query.limit) ;

    // Fetch paginated reviews
    const reviews = await Review.find({ productId })
      .populate("userId", "name email avatar")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    // Fetch all reviews for count and average
    const allReviews = await Review.find({ productId });
    const total = allReviews.length;
    const averageRating =
      total > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / total
        : 0;

    res.json({ success: true, reviews, total, averageRating });
  } catch (err) {
    console.error("Get review error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const userId = req.user.id; // from auth middleware

    const review = await Review.findOne({ _id: reviewId, productId });
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    // Only allow owner to delete
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Delete images
    if (review.images && review.images.length > 0) {
      review.images.forEach(img => {
        const filePath = path.join(process.cwd(), img);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    await Review.deleteOne({ _id: reviewId });

    // Return updated reviews
    const reviews = await Review.find({ productId })
      .populate("userId", "name email avatar")
      .sort({ date: -1 });

    res.json({ success: true, reviews });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


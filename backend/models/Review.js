import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: String,
  email: String,
  rating: { type: Number, required: true },
  comment: String,
  images: [String],
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Review", reviewSchema);

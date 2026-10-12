// models/eventModel.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    type: { type: String, required: true }, // "login"|"view"|"click"|"add_to_cart"|"purchase"
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
    meta: { type: Object, default: {} },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: false, minimize: true }
);

const EventModel = mongoose.models.Event || mongoose.model("Event", eventSchema);
export default EventModel;

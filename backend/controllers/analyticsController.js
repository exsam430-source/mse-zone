import mongoose from "mongoose";
import EventModel from "../models/eventModel.js";
import OrderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// -------------------------
// DATE RANGE HELPER
// -------------------------
const rangeToStartDate = (range) => {
  const now = new Date();
  switch ((range || "1w").toLowerCase()) {
    case "1d": return new Date(now - 24 * 60 * 60 * 1000);
    case "7d": return new Date(now - 7 * 24 * 60 * 60 * 1000);
    case "1w": return new Date(now - 7 * 24 * 60 * 60 * 1000);
    case "30d": return new Date(now - 30 * 24 * 60 * 60 * 1000);
    case "1m": return new Date(now - 30 * 24 * 60 * 60 * 1000);
    case "90d": return new Date(now - 90 * 24 * 60 * 60 * 1000);
    case "3m": return new Date(now - 90 * 24 * 60 * 60 * 1000);
    default: return new Date(now - 7 * 24 * 60 * 60 * 1000);
  }
};

// -------------------------
// CREATE EVENT
// -------------------------
const createEvent = async (req, res) => {
  try {
    const {
      userId = null,
      type,
      productId = null,
      meta = {},
      ip = "",
      userAgent = ""
    } = req.body;

    if (!type) return res.status(400).json({ success: false, message: "type required" });

    const ev = new EventModel({
      userId,
      type,
      productId: productId ? new mongoose.Types.ObjectId(productId) : null,
      meta,
      ip,
      userAgent,
      createdAt: new Date()
    });

    await ev.save();
    res.json({ success: true, event: ev });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------
// TOTAL REGISTERED USERS
// -------------------------
const totalUsers = async (req, res) => {
  try {
    const count = await userModel.countDocuments();
    res.json({ success: true, totalUsers: count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------
// TOTAL ORDERS
// -------------------------
const totalOrders = async (req, res) => {
  try {
    const count = await OrderModel.countDocuments();
    res.json({ success: true, totalOrders: count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------
// UNIQUE VISITORS
// -------------------------
const visitors = async (req, res) => {
  try {
    const { range = "1w" } = req.query;
    const start = rangeToStartDate(range);

    const eventVisitors = await EventModel.aggregate([
      { $match: { createdAt: { $gte: start }, type: { $in: ["view", "click"] } } },
      {
        $project: {
          visitor: {
            $cond: [
              { $ifNull: ["$userId", false] },
              { $toString: "$userId" },
              "$ip"
            ]
          }
        }
      },
      { $group: { _id: "$visitor" } }
    ]);

    const orderVisitors = await OrderModel.aggregate([
      { $group: { _id: "$userId" } }
    ]);

    const unique = new Set([
      ...eventVisitors.map(v => v._id),
      ...orderVisitors.map(o => o._id)
    ]);

    res.json({ success: true, uniqueVisitors: unique.size });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------
// TOP PRODUCTS
// -------------------------
const topProducts = async (req, res) => {
  try {
    const { range = "1m", limit = 10 } = req.query;
    const start = rangeToStartDate(range);

    const agg = await OrderModel.aggregate([
      { $unwind: "$items" },
      { $match: { date: { $gte: start.getTime() } } },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          totalQty: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      { $sort: { totalQty: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({ success: true, results: agg });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------
// OVERALL STATS (views, carts, purchases)
// -------------------------
const overallStats = async (req, res) => {
  try {
    const events = await EventModel.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      }
    ]);

    const orders = await OrderModel.aggregate([
      { $unwind: "$items" },
      { $group: { _id: null, count: { $sum: "$items.quantity" } } }
    ]);

    const fromEvents = events.find(e => e._id === "purchase")?.count || 0;
    const fromOrders = orders[0]?.count || 0;

    res.json({
      success: true,
      views: events.find(e => e._id === "view")?.count || 0,
      addToCarts: events.find(e => e._id === "add_to_cart")?.count || 0,
      purchases: fromEvents + fromOrders
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------
// OVERALL CONVERSION
// -------------------------
const overallConversion = async (req, res) => {
  try {
    const viewersAgg = await EventModel.aggregate([
      { $match: { type: "view" } },
      {
        $project: {
          visitor: {
            $cond: [
              { $ifNull: ["$userId", false] },
              { $toString: "$userId" },
              "$ip"
            ]
          }
        }
      },
      { $group: { _id: "$visitor" } }
    ]);

    const purchasersAgg = await OrderModel.aggregate([
      { $group: { _id: "$userId" } }
    ]);

    const viewers = viewersAgg.length;
    const purchasers = purchasersAgg.length;
    const rate = viewers ? (purchasers / viewers) * 100 : 0;

    res.json({ success: true, viewers, purchasers, conversionRate: rate });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ======================== NEW FUNCTION ========================
// -------------------------
// EVENTS BY DATE (FOR CHARTS)
// -------------------------
const eventsByDate = async (req, res) => {
  try {
    const { range = "7d" } = req.query;
    const start = rangeToStartDate(range);

    // Fetch all events within the date range
    const events = await EventModel.find({ 
      createdAt: { $gte: start } 
    }).sort({ createdAt: 1 });

    if (!events || events.length === 0) {
      return res.json({ 
        success: true, 
        events: [],
        message: "No events found for this date range" 
      });
    }

    res.json({ success: true, events });

  } catch (err) {
    console.error("Error fetching events by date:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ======================== EXPORT ALL FUNCTIONS ========================
export {
  createEvent,
  totalUsers,
  totalOrders,
  visitors,
  topProducts,
  overallStats,
  overallConversion,
  eventsByDate  // ← ADD THIS
};

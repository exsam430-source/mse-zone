import EventModel from "../models/eventModel.js";

const trackEvent = (type) => async (req, res, next) => {
  try {
    const productId = req.params.id || req.body.productId;
    const userId = req.user?._id || null;
    const ip = req.ip || "";
    const userAgent = req.get("user-agent") || "";

    if (!productId) return next();

    if (type === "view") {
      // Check for existing view for same product+user+IP within 5 mins
      const recentView = await EventModel.findOne({
        type: "view",
        productId,
        $or: [
          { userId: userId || null },
          { ip }
        ],
        createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
      });

      if (!recentView) {
        await EventModel.create({ type, productId, userId, ip, userAgent });
      }
    } else {
      // For other events: addToCart, purchase, click
      await EventModel.create({ type, productId, userId, ip, userAgent });
    }

    next();
  } catch (err) {
    console.error("Track event error:", err);
    next();
  }
};

export { trackEvent };

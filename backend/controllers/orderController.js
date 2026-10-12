import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import EventModel from "../models/eventModel.js";

// ✅ Unified Order Placement Endpoint (COD & WhatsApp)
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, paymentMethod } = req.body;

    if (!paymentMethod || !["COD", "WhatsApp"].includes(paymentMethod)) {
      return res.json({ success: false, message: "Invalid payment method selected." });
    }

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod,
      payment: false,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear user's shopping cart upon successful placement
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Track analytics events for purchase
    try {
      for (const item of items) {
        await EventModel.create({
          userId,
          type: 'purchase',
          productId: item._id || item.productId,
          meta: { quantity: item.quantity, price: item.price },
          ip: req.ip || "",
          userAgent: req.get('user-agent') || "",
          createdAt: new Date()
        });
      }
    } catch (err) {
      console.error('Purchase tracking error:', err);
    }

    res.json({
      success: true,
      message: `Order placed via ${paymentMethod}`,
      orderId: newOrder._id
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Fetch orders for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Fetch order history for user profile
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order status (Admin panel feature)
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: 'Status Updated' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModel.findById(id).populate('items.productId');

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  allOrders,
  userOrders,
  updateStatus,
  getOrderById
};
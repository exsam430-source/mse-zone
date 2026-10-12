// controllers/returnController.js
import fs from "fs";
import path from "path";
import returnModel from "../models/returnModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Helper to delete local images
const deleteLocalImages = (images) => {
  if (!images || images.length === 0) return;
  images.forEach((imgPath) => {
    const fullPath = path.join(process.cwd(), imgPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  });
};

// Create Return Request
const createReturn = async (req, res) => {
  try {
    const { orderId, productId, reason, description, returnMethod, productDetails } = req.body;
    const userId = req.user._id;

    // Verify order exists and belongs to user
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

  if (order.userId.toString() !== req.user._id.toString()) {
  return res.status(401).json({ success: false, message: "Unauthorized" });
}

    // Check if return already exists for this product
    const existingReturn = await returnModel.findOne({ 
      orderId, 
      productId,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingReturn) {
      return res.json({ success: false, message: "Return request already exists for this product" });
    }

    // Collect uploaded proof images (stored locally)
    const proofImages = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        proofImages.push(`Images/ReturnProof/${file.filename}`);
      });
    }

    // Parse product details
    const parsedProductDetails = typeof productDetails === 'string' 
      ? JSON.parse(productDetails) 
      : productDetails;

    // Create return request
    const returnData = {
      orderId,
      userId,
      productId,
      productDetails: parsedProductDetails,
      reason,
      description,
      proofImages,
      returnMethod,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newReturn = new returnModel(returnData);
    await newReturn.save();

    res.json({ success: true, message: "Return request submitted successfully", return: newReturn });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get User Returns
const getUserReturns = async (req, res) => {
  try {
    const { userId } = req.body;

    const returns = await returnModel.find({ userId })
      .populate('orderId')
      .sort({ createdAt: -1 });

    res.json({ success: true, returns });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get Single Return by ID
const getReturnById = async (req, res) => {
  try {
    const { id } = req.params;

    const returnData = await returnModel.findById(id)
      .populate('orderId')
      .populate('userId', 'name email avatar');

    if (!returnData) {
      return res.json({ success: false, message: "Return not found" });
    }

    res.json({ success: true, return: returnData });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get All Returns (Admin)
const getAllReturns = async (req, res) => {
  try {
    const returns = await returnModel.find({})
      .populate('orderId')
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, returns });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update Return Status (Admin)
const updateReturnStatus = async (req, res) => {
  try {
    const { returnId, status, adminNote } = req.body;

    const returnData = await returnModel.findByIdAndUpdate(
      returnId,
      { 
        status, 
        adminNote: adminNote || '',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!returnData) {
      return res.json({ success: false, message: "Return not found" });
    }

    res.json({ success: true, message: "Return status updated successfully", return: returnData });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete Return (Admin)
const deleteReturn = async (req, res) => {
  try {
    const { id } = req.params;

    const returnData = await returnModel.findById(id);
    if (!returnData) {
      return res.json({ success: false, message: "Return not found" });
    }

    // Delete local proof images
    deleteLocalImages(returnData.proofImages);

    await returnModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Return deleted successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { 
  createReturn, 
  getUserReturns, 
  getReturnById, 
  getAllReturns, 
  updateReturnStatus, 
  deleteReturn 
};

import express from 'express';
import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  getLatestImages,
  getCategories, // ✅ NEW
} from '../controllers/productController.js';
import upload from '../middleware/upload.js';
import adminAuth from '../middleware/adminAuth.js';
import { trackEvent } from '../middleware/trackEvent.js';

const productRouter = express.Router();

// ✅ Add product
productRouter.post(
  '/add',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  addProduct
);

// ✅ List all products
productRouter.get('/list', listProducts);

// ✅ Remove product
productRouter.post('/remove', adminAuth, removeProduct);

// ✅ Single product by ID
productRouter.get('/single/:id', trackEvent('view'), singleProduct);

// ✅ Latest images
productRouter.get('/latest-images', getLatestImages);

// ✅ NEW: Get all dynamic categories from DB
productRouter.get('/categories', getCategories);

export default productRouter;
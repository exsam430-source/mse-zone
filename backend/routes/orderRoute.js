import express from 'express';
import { placeOrder, allOrders, userOrders, updateStatus, getOrderById } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin routes
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// User checkout routes (COD & WhatsApp use the unified placing point)
orderRouter.post('/place', authUser, placeOrder);

// User order profile features
orderRouter.post('/userorders', authUser, userOrders);
orderRouter.get('/:id', authUser, getOrderById);

export default orderRouter;
import express from 'express';
import { addToCart, updateCart, getUserCart } from '../controllers/cartController.js';
import authUser from '../middleware/auth.js';
import { trackEvent } from '../middleware/trackEvent.js';

const cartRouter = express.Router()

cartRouter.post('/get',authUser ,getUserCart)
cartRouter.post('/add',authUser, trackEvent('addToCart'), addToCart)
cartRouter.post('/update',authUser, updateCart)

export default cartRouter;
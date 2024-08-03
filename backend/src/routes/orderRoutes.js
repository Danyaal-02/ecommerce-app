import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

router.post('/', isAuthenticated, orderController.createOrder);
router.get('/', isAuthenticated, orderController.getOrders);

export default router;
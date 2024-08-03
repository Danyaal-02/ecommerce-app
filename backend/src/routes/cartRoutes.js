import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import * as cartController from '../controllers/cartController.js';

const router = express.Router();

router.post('/', isAuthenticated, cartController.addToCart);
router.get('/', isAuthenticated, cartController.getCart);
router.put('/:productId', isAuthenticated, cartController.updateCartItem);
router.delete('/:productId', isAuthenticated, cartController.removeCartItem);

export default router;
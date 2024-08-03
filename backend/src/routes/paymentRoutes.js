import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import * as paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-payment-intent', isAuthenticated, paymentController.createPaymentIntent);

export default router;
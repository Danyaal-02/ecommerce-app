import { createPaymentIntent as createStripePaymentIntent } from '../services/stripeService.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, cartItems, paySessionId } = req.body;

    if (!amount || !Array.isArray(cartItems) || !paySessionId) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    let clientSecret;
    try {
      clientSecret = await createStripePaymentIntent(amount);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return res.status(500).json({ error: 'Failed to create payment intent' });
    }

    res.json({ clientSecret });

  } catch (error) {
    console.error('Error in create-payment-intent route:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { paymentIntentId } = req.body;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        const cart = await Cart.findOne({ userId: userId }).populate('items.productId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const totalAmount = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        const order = new Order({
            user: userId,
            products: cart.items.map(item => ({
                product: item.productId._id,
                quantity: item.quantity,
            })),
            totalAmount,
            status: paymentIntent.status === 'succeeded' ? 'paid' : 'pending',
            paymentIntentId: paymentIntent.id,
        });

        await order.save();

        if (paymentIntent.status === 'succeeded') {
            await Cart.findOneAndUpdate({ userId: userId }, { $set: { items: [] } });
        }

        res.status(201).json({ order, paymentStatus: paymentIntent.status });
    } catch (error) {
        console.error('Error creating order:', error.message);
        res.status(500).json({ error: 'Failed to create order', details: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId })
            .populate('products.product')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};
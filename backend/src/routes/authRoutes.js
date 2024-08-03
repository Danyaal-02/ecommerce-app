import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', isAuthenticated, authController.logout);

export default router;
import express from 'express';
import { isAdmin, isAuthenticated } from '../middlewares/auth.js';
import * as sessionController from '../controllers/sessionController.js';

const router = express.Router();

router.get('/', isAdmin, sessionController.getAllSessions);
router.get('/user', isAuthenticated, sessionController.getUserSessions);

export default router;
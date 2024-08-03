import express from 'express';
import { isAdmin } from '../middlewares/auth.js';
import * as productController from '../controllers/productController.js';

const router = express.Router();

router.post('/', isAdmin, productController.createProduct);
router.get('/', productController.getProducts);
router.put('/:id', isAdmin, productController.updateProduct);
router.delete('/:id', isAdmin, productController.deleteProduct);

export default router;
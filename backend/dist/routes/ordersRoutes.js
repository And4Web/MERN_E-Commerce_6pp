import express from 'express';
import { createOrder } from '../controllers/orders.js';
const router = express.Router();
// place new order
router.post("/new", createOrder);
export default router;

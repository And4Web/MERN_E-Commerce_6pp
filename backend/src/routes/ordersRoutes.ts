import express from 'express';
import { createOrder, deleteOrder, getAllOrders, getAllOrdersAdmin, getSingleOrder, processOrder } from '../controllers/orders.js';
import { adminOnly } from '../middlewares/auth.js';

const router = express.Router();

// place new order
router.post("/new", createOrder)

// get all orders - for user
router.get("/my-orders", getAllOrders);

// get all orders - for admins
router.get("/all-orders",adminOnly, getAllOrdersAdmin)

// get single order details, update an order or delete order
router.route("/:orderId").get(getSingleOrder).put(adminOnly, processOrder).delete(adminOnly, deleteOrder);
// 

export default router;
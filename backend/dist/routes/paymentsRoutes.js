import express from "express";
import { newCoupon } from "../controllers/payments.js";
const router = express.Router();
// route - /api/v1/payments/coupon/new
router.post("/coupon/new", newCoupon);
export default router;

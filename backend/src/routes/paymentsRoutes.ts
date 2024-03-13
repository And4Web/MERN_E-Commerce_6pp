import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { allCoupons, applyDiscount, createPaymentIntent, deleteCoupon, newCoupon } from "../controllers/payments.js";

const router = express.Router();

// route - /api/v1/payments/create
router.post("/create", createPaymentIntent)

// route - /api/v1/payments/coupon/new
router.post("/coupon/new", newCoupon)

// route - /api/v1/payments/all-coupons
router.get("/all-coupons",adminOnly, allCoupons)

// route - api/v1/payments/coupon/:couponId
router.delete("/coupon/:couponId",adminOnly, deleteCoupon) 

// route - /api/v1/payments/discount
router.get("/discount", applyDiscount);


export default router;
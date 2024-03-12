import { TryCatch } from "../middlewares/error.js";
import Coupon from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";


// route - /api/v1/payments/coupon/new
export const newCoupon = TryCatch(async (req, res, next)=>{
  const {couponCode, amount} = req.body;

  if(!couponCode || !amount) return next(new ErrorHandler("Enter both coupon code and amount", 404));

  await Coupon.create({
    couponCode, amount
  })

  return res.status(201).json({success: true, message: "Coupon created successfully.", couponCode, amount});
})
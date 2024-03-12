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

// route - /api/v1/payments/discount
export const applyDiscount = TryCatch(async (req, res, next) => {
  const {couponCode} = req.query;

  const coupon = await Coupon.findOne({couponCode});

  if(!coupon) return next(new ErrorHandler("Invalid coupon", 404));

  const discountAmount = coupon.amount;

  return res.status(200).json({success: true, discountAmount});

})

export const allCoupons = TryCatch(async (req, res, next) => {
  const allCoupons = await Coupon.find({}, {__v:0});
  let message = "";

  if(!allCoupons) message = "No active coupons at this moment.";
  else message = `${allCoupons.length} active coupons at this moment.`

  return res.status(200).json({success: true, message, allCoupons});
})

// route - api/v1/payments/coupon/:couponId
export const deleteCoupon = TryCatch(async (req, res, next) => {
  const id = req.params.couponId;

  if(!id) return next(new ErrorHandler("Invalid coupon Id", 404));

  const coupon = await Coupon.findById(id);
  if(!coupon) return next(new ErrorHandler("No coupon with such Id found.", 404));

  await coupon.deleteOne();

  return res.status(200).json({success: true, message: "Coupon deleted successfully.", coupon})
})
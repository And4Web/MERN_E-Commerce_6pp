import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    required: [true, "Please enter the coupon code."],
    unique: true,
  },
  amount: {
    type: Number,
    required: [true, "Please enter the Discount amount on the coupon code."]
  }
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
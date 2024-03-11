import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    shippingInfo: {
        name: { type: String, required: true },
        house: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: Number, required: true },
        country: { type: String, required: true }
    },
    user: {
        type: String,
        ref: "User",
        required: true,
    },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shippingCharges: { type: Number, required: true },
    discount: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Processing", "Shipped", "Delivered"],
        default: "Processing"
    },
    orderItems: [
        {
            name: String,
            photo: String,
            price: Number,
            quantity: Number,
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "Product",
            }
        }
    ]
}, { timestamps: true });
const Order = mongoose.model("Order", orderSchema);
export default Order;

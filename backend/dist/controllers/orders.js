import { TryCatch } from "../middlewares/error.js";
import Order from "../models/order.js";
import { invalidatesCache, reduceStockOnOrder } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { nodeCache } from "../app.js";
// create an order
export const createOrder = TryCatch(async (req, res, next) => {
    const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total, } = req.body;
    if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total)
        return next(new ErrorHandler("Please enter all fields", 404));
    // create order
    await Order.create({
        shippingInfo,
        orderItems,
        user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total,
    });
    // reduce stock once the order is placed
    await reduceStockOnOrder(orderItems);
    // refresh cache
    await invalidatesCache({ product: true, order: true, admin: true });
    return res.status(201).json({ success: true, message: "Order placed successfully.", orderItems, shippingInfo });
});
// get all orders - user
export const getAllOrders = TryCatch(async (req, res, next) => {
    const { id: user } = req.query;
    if (!user)
        return next(new ErrorHandler("Invalid userId.", 404));
    let orders = [];
    const cacheKey = `${user}-orders`;
    if (nodeCache.has(cacheKey)) {
        orders = JSON.parse(nodeCache.get(cacheKey));
    }
    else {
        orders = await Order.find({ user }).populate("user", "name");
        if (!orders)
            return res.status(200).json({ success: true, message: "You have ordered nothing yet." });
        nodeCache.set(cacheKey, JSON.stringify(orders));
    }
    return res.status(200).json({ success: true, message: "All orders.", orders });
});
// get all orders - admin
export const getAllOrdersAdmin = TryCatch(async (req, res, next) => {
    let orders = [];
    const cacheKey = `all-orders`;
    if (nodeCache.has(cacheKey)) {
        orders = JSON.parse(nodeCache.get(cacheKey));
    }
    else {
        orders = await Order.find({}).populate("user", "name");
        if (!orders)
            return res.status(200).json({ success: true, message: "You have no orders yet." });
        nodeCache.set(cacheKey, JSON.stringify(orders));
    }
    return res.status(200).json({ success: true, message: "All orders.", totalOrders: orders.length, orders });
});
// get order details
export const getSingleOrder = TryCatch(async (req, res, next) => {
    const { orderId: id } = req.params;
    const key = `${id}-order`;
    let order;
    if (nodeCache.has(key)) {
        order = JSON.parse(nodeCache.get(key));
    }
    else {
        order = await Order.findById(id).populate("user", "name");
        if (!order)
            return next(new ErrorHandler("Order not found.", 404));
        nodeCache.set(key, JSON.stringify(order));
    }
    return res.status(200).json({ success: true, message: "Single order deatails", order });
});
// update an order
export const processOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order)
        return next(new ErrorHandler("Order not found.", 404));
    switch (order.status) {
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "Delivered";
            break;
        default:
            order.status = "Delivered";
            break;
    }
    await order.save();
    await invalidatesCache({ order: true, product: true, admin: true });
    return res.status(200).json({ success: true, message: "Processed order success" });
});
// delete an order
export const deleteOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order)
        return next(new ErrorHandler("Order not found.", 404));
    await order.deleteOne();
    await invalidatesCache({ order: true, product: true, admin: true });
    return res.status(200).json({ success: true, message: "Order deleted successfully" });
});

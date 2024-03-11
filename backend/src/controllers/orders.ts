import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import Order from "../models/order.js";
import { invalidatesCache, reduceStockOnOrder } from "../utils/features.js";

export const createOrder = TryCatch(
  async (
    req: Request<{}, {}, NewOrderRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    } = req.body;

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
    await invalidatesCache({product: true, order: true, admin: true});

    return res.status(200).json({success: true, message: "Order placed successfully.", orderItems, shippingInfo})
  }
);

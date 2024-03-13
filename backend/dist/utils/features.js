import mongoose from "mongoose";
import { nodeCache } from "../app.js";
import Product from "../models/product.js";
// const uri = "mongodb://localhost:27017"
export const connectDB = (uri) => {
    mongoose
        .connect(uri, { dbName: "e-commerce-6pp" })
        .then((c) => {
        console.log(`MongoDB connection to HOST: ${c.connection.host} successful.`);
    })
        .catch((e) => console.log(`MongoDB connection failed >>> ${e}`));
};
export const invalidatesCache = async ({ product, order, admin, userId, orderId, productId }) => {
    if (product) {
        const productKeys = [
            "latest-products", "categories", "all-products-admin"
        ];
        if (typeof productId === "string") {
            productKeys.push(`product-${productId}`);
            console.log("productKeys in cache... string");
        }
        if (typeof productId === "object") {
            productId.forEach(i => productKeys.push(`product-${i}`));
            console.log("productKeys in cache... array");
        }
        nodeCache.del(productKeys);
    }
    if (order) {
        const orderKeys = ["all-orders", `${userId}-orders`, `${orderId}-order`];
        nodeCache.del(orderKeys);
    }
    if (admin) { }
};
export const reduceStockOnOrder = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new Error("Product not found in database");
        product.stock -= order.quantity;
        await product.save();
    }
};
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    // const percent = ((thisMonth - lastMonth)/lastMonth) * 100;
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
};
export const getInventories = async ({ categories, productsCount }) => {
    const categoriesCountPromise = categories.map((category) => Product.countDocuments({ category }));
    const categoriesCount = await Promise.all(categoriesCountPromise);
    const categoryCount = [];
    categories.forEach((c, i) => {
        categoryCount.push({
            [c]: Math.round((categoriesCount[i] / productsCount) * 100),
        });
    });
    return categoryCount;
};
export const getChartData = ({ length, documentArray, today }) => {
    const data = new Array(length).fill(0);
    documentArray.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            data[length - monthDiff - 1] += 1;
        }
    });
    return data;
};

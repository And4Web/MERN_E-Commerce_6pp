import { TryCatch } from "../middlewares/error.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
export const createProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("Please add a photo.", 400));
    if (!name || !price || !stock || !category) {
        rm(photo.path, () => console.log("deleted."));
        return next(new ErrorHandler("Enter all fields.", 400));
    }
    await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo.path,
    });
    return res
        .status(201)
        .json({ success: true, message: "new Product created successfully" });
});
export const getLatestProducts = TryCatch(async (req, res, next) => {
    const latestProducts = await Product.find({})
        .sort({ createdAt: -1 })
        .limit(5);
    return res
        .status(200)
        .json({ success: true, total: latestProducts.length, message: "Get Latest Products", latestProducts });
});
export const getCategories = TryCatch(async (req, res, next) => {
    const categories = await Product.distinct("category");
    return res
        .status(200)
        .json({ success: true, categories, message: "get all categories" });
});
export const getAdminProducts = TryCatch(async (req, res, next) => {
    const latestProducts = await Product.find({})
        .sort({ createdAt: -1 })
        .limit(5);
    return res
        .status(200)
        .json({ success: true, total: latestProducts.length, message: "Get Latest Products - Admin", latestProducts });
});
export const getSingleProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Invalid Product Id.", 404));
    return res
        .status(200)
        .json({ success: true, message: "get single product", product });
});
export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Invalid Product Id.", 404));
    if (photo) {
        rm(product.photo, () => console.log("old photo deleted."));
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    await product.save();
    return res
        .status(200)
        .json({ success: true, message: "Product updated successfully" });
});
export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Invalid Product Id.", 404));
    rm(product.photo, () => {
        console.log("product photo deleted.");
    });
    await product.deleteOne();
    return res
        .status(200)
        .json({ success: true, message: "Product deleted successfully." });
});

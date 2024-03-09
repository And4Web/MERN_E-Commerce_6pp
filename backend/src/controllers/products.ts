import express, { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewProductRequestBody } from "../types/types.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";

export const createProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    if(!photo) return next(new ErrorHandler("Please add a photo.", 400))

    if(!name || !price || !stock || !category) {
      rm(photo.path, ()=>console.log("deleted."));    
      return next(new ErrorHandler("Enter all fields.", 400))
    }

    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo.path,
    });

    return res.status(201).json({success: true, message: "new Product created successfully"})
  }
);

export const getLatestProducts = TryCatch(async (req, res, next)=>{
  const latestProducts = await Product.find({}).sort({createdAt: -1}).limit(5);

  return res.status(200).json({success: true, message: "Get Latest Products", latestProducts})
})

export const getCategories = TryCatch(async(req, res, next)=>{
  const categories = await Product.distinct("category");

  return res.status(200).json({success: true, categories, message: "get all categories"});
})

export const getAdminProducts = TryCatch(async (req, res, next)=>{
  const latestProducts = await Product.find({}).sort({createdAt: -1}).limit(5);

  return res.status(200).json({success: true, message: "Get Latest Products", latestProducts})
})
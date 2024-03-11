import express, { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { BaseQueryType, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import {faker} from '@faker-js/faker';

export const createProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please add a photo.", 400));

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
  }
);

export const getLatestProducts = TryCatch(async (req, res, next) => {
  const latestProducts = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(5);

  return res
    .status(200)
    .json({
      success: true,
      total: latestProducts.length,
      message: "Get Latest Products",
      latestProducts,
    });
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
    .json({
      success: true,
      total: latestProducts.length,
      message: "Get Latest Products - Admin",
      latestProducts,
    });
});

export const getSingleProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Invalid Product Id.", 404));

  return res
    .status(200)
    .json({ success: true, message: "get single product", product });
});

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;
  const photo = req.file;

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Invalid Product Id.", 404));

  if (photo) {
    rm(product.photo, () => console.log("old photo deleted."));
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  await product.save();

  return res
    .status(200)
    .json({ success: true, message: "Product updated successfully" });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Invalid Product Id.", 404));

  rm(product.photo, () => {
    console.log("product photo deleted.");
  });

  await product.deleteOne();

  return res
    .status(200)
    .json({ success: true, message: "Product deleted successfully." });
});

export const getAllProducts = TryCatch(async(req, res, next)=>{
  const allProducts = await Product.find({}, {__v:0});
  const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
  const pages = Math.ceil(allProducts.length / limit);

  return res.status(200).json({success: true, totalProducts: allProducts.length, totalPages: pages, message: "All Products", allProducts});
})

export const searchAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;
    console.log({search, sort, category, price});
    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = limit * (page - 1);

    const baseQuery:BaseQueryType = {}

    if(search) baseQuery.name = {
      $regex: search,
      $options: "i",
    };

    if(price) baseQuery.price = {$lte: Number(price)};

    if(category) baseQuery.category = category;

    const searchedProductPromise = Product.find(baseQuery).sort(sort && {price: sort === "asc" ? 1 : -1}).limit(limit).skip(skip)

    const filteredProductsPromise = Product.find(baseQuery)

    const [searchedProducts, filteredProducts] = await Promise.all([searchedProductPromise, filteredProductsPromise])

    const totalPages = Math.ceil(filteredProducts.length / limit);


    return res.status(200).json({ success: true, totalproducts: filteredProducts.length, totalPages, messages: "Search results", searchedProducts });
  }
);

const generateRandomProducts = async (count: number = 10 ) => {
  const products = [];

  for(let i=0; i<count; i++){
    const product = {
      name: faker.commerce.productName(),
      photo: "uploads\\fa69337d-5cd5-49aa-ad96-bc0c3b9fc696.jpeg",
      price: faker.commerce.price({min: 1500, max: 80000}),
      stock: faker.commerce.price({min: 0, max: 1000}),
      category: faker.commerce.department(),
      createdAt: new Date(faker.date.past()),
      updatedAt: new Date(faker.date.recent()),
      __v: 0,
    }
    products.push(product);
  }

  await Product.create(products);
  console.log({success: true});
}

// generateRandomProducts(50);
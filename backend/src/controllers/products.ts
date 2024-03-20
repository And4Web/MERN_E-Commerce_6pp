import express, { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { BaseQueryType, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { nodeCache } from "../app.js";
import { invalidatesCache } from "../utils/features.js";
// import {faker} from '@faker-js/faker';

// revalidate cache on new product creation, updation or deletion & new order

// get latest products
export const getLatestProducts = TryCatch(async (req, res, next) => {
  let latestProducts = [];
  
  if(nodeCache.has("latest-products")){
  // get data from cache
    // JSON.parse(nodeCache.get("latest-products")!);
    latestProducts = JSON.parse(nodeCache.get("latest-products") as string);
  }else{
    // get data from database
    latestProducts = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(5);
  // store fetched data in cache memory
  nodeCache.set("latest-products", JSON.stringify(latestProducts));
  }
  
  return res
    .status(200)
    .json({
      success: true,
      total: latestProducts.length,
      message: "Get Latest Products",
      latestProducts,
    });
});

// revalidate cache on new product creation, updation or deletion & new order
export const getCategories = TryCatch(async (req, res, next) => {
  let categories;
  if(nodeCache.has("categories")){
    categories = JSON.parse(nodeCache.get("categories") as string);
  }else{
    categories = await Product.distinct("category");
    nodeCache.set("categories", JSON.stringify(categories));
  }  

  return res
    .status(200)
    .json({ success: true, categories, message: "get all categories" });
});

// revalidate cache on new product creation, updation or deletion & new order
export const getAdminProducts = TryCatch(async (req, res, next) => {
  let latestProducts;

  if(nodeCache.has("all-products-admin")){
    latestProducts = JSON.parse(nodeCache.get("all-products-admin") as string);
  }else{
    latestProducts = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    nodeCache.set("all-products-admin", JSON.stringify(latestProducts));
  }

  return res
    .status(200)
    .json({
      success: true,
      total: latestProducts.length,
      message: "Get all Products - Admin",
      latestProducts,
    });
});

// revalidate cache on new product creation, updation or deletion & new order
export const getSingleProduct = TryCatch(async (req, res, next) => {
  let product;
  let id = req.params.id;

  if(nodeCache.has(`product-${id}`)){
    product = JSON.parse(nodeCache.get(`product-${id}`) as string);
  }else{
    product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("Invalid Product Id.", 404));
    nodeCache.set(`product-${id}`, JSON.stringify(product));
  }

  return res
    .status(200)
    .json({ success: true, message: "get single product", product });
});

// create new product - admin only
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

    const newProduct = await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo.path,
    });

    await invalidatesCache({product: true, admin: true, productId: String(newProduct._id)}); 

    return res
      .status(201)
      .json({ success: true, message: "new Product created successfully" });
  }
);


// update product
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

  await invalidatesCache({product: true, productId: id, admin: true}); 

  return res
    .status(200)
    .json({ success: true, message: "Product updated successfully" });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const id = req.params.id;

  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("Invalid Product Id.", 404));

  rm(product.photo, () => {
    console.log("product photo deleted.");
  });

  await product.deleteOne();

  await invalidatesCache({product: true, admin: true, productId: id}); 

  return res
    .status(200)
    .json({ success: true, message: "Product deleted successfully." });
});

export const getAllProducts = TryCatch(async(req, res, next)=>{
  const currentPage = Number(req.query.page) || 1;  
  
  const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
  const skip = limit * (currentPage - 1);

  let allProducts = await Product.find({}, {__v:0});
  let filteredProducts = await Product.find({}, {__v:0}).skip(skip).limit(limit);

  const pages = Math.ceil(allProducts.length / limit);

  return res.status(200).json({success: true, totalProducts: allProducts.length, totalPages: pages, currentPage, message: "All Products", filteredProducts});
})

export const searchAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    console.log({search, sort, category, price, page}); 

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


    return res.status(200).json({ success: true, totalproducts: filteredProducts.length, totalPages, currentPage: page, messages: "Search results", searchedProducts });
  }
);































//faker-js function to create fake products: 

// const generateRandomProducts = async (count: number = 10 ) => {
//   const products = [];

//   for(let i=0; i<count; i++){
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\\fa69337d-5cd5-49aa-ad96-bc0c3b9fc696.jpeg",
//       price: faker.commerce.price({min: 1500, max: 80000}),
//       stock: faker.commerce.price({min: 0, max: 1000}),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     }
//     products.push(product);
//   }

//   await Product.create(products);
//   console.log({success: true, message: `${count} random products created.`});
// }

// generateRandomProducts(50);

// function to delete all random products

// const deleteRandomProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);

//   for(let i=0; i<products.length; i++){
//     const product = products[i];
//     await product.deleteOne();
//   }

//   console.log({success: true, message: "all products deleted."})
// }
// deleteRandomProducts(50);
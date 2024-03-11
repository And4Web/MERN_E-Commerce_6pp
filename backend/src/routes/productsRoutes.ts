import {Router} from "express";
import Product from "../models/product.js";
import { createProduct, deleteProduct, getAdminProducts, getAllProducts, getCategories, getLatestProducts, getSingleProduct, searchAllProducts, updateProduct } from "../controllers/products.js";
import { adminOnly } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
// 
const router = Router();

// create product route - /api/v1/products/new
router.post("/new", adminOnly, singleUpload, createProduct);

// return all products
router.get("/all", getAllProducts);

// to get all products with filters applied
router.get("/search", searchAllProducts);

// latest products
router.get("/latest", getLatestProducts)

// categories
router.get("/categories", getCategories);

// admin specific route to find products
router.get("/admin-products", getAdminProducts);

// product specific route
router.route("/:id").get(getSingleProduct).put(adminOnly, singleUpload, updateProduct).delete(adminOnly, deleteProduct)

export default router;

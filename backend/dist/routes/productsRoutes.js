import { Router } from "express";
import { createProduct, getAdminProducts, getCategories, getLatestProducts } from "../controllers/products.js";
import { adminOnly } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
const router = Router();
// create product route - /api/v1/products/new
router.post("/new", adminOnly, singleUpload, createProduct);
// latest products
router.get("/latest", getLatestProducts);
// categories
router.get("/categories", getCategories);
// admin specific route to find products
router.get("/admin-products", getAdminProducts);
export default router;

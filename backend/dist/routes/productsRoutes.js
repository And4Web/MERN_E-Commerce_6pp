import { Router } from "express";
import { createProduct } from "../controllers/products.js";
import { singleUpload } from "../middlewares/multer.js";
const router = Router();
router.post("/new", singleUpload, createProduct);
export default router;

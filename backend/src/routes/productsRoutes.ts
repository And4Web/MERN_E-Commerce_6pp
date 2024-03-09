import {Router} from "express";
import Product from "../models/product.js";
import { createProduct } from "../controllers/products.js";
import { adminOnly } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const router = Router();

router.post("/new", singleUpload, createProduct);


export default router;

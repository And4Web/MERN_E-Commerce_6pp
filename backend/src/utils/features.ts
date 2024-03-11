import mongoose from "mongoose";
import { InvalidateCacheProps } from "../types/types.js";
import { nodeCache } from "../app.js";
import Product from "../models/product.js";

export const connectDB = () => {
  mongoose
    .connect("mongodb://localhost:27017", { dbName: "e-commerce-6pp" })
    .then((c) => {
      console.log(
        `MongoDB connection to HOST: ${c.connection.host} successful.`
      );
    })
    .catch((e) => console.log(`MongoDB connection failed >>> ${e}`));
};


export const invalidatesCache = async ({product, order, admin}: InvalidateCacheProps) => {
  if(product){
    const productKeys: string[] = [
      "latest-products", "categories", "all-products-admin"
    ];
    // `product-${id}`
    const productIds = await Product.find({}).select("_id");

    productIds.forEach(i=>productKeys.push(`product-${i._id}`))

    nodeCache.del(productKeys);
  }
  if(order){}
  if(admin){}
}
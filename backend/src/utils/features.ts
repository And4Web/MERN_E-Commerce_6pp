import mongoose from "mongoose";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
import { nodeCache } from "../app.js";
import Product from "../models/product.js";

// const uri = "mongodb://localhost:27017"
export const connectDB = (uri: string) => {
  mongoose
    .connect(uri, { dbName: "e-commerce-6pp" })
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

export const reduceStockOnOrder = async (orderItems: OrderItemType[]) => {

  for(let i=0; i<orderItems.length; i++){
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if(!product) throw new Error("Product not found in database");

    product.stock -= order.quantity;

    await product.save();
  }
}
import mongoose, { Document } from "mongoose";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
import { nodeCache } from "../app.js";
import Product from "../models/product.js";
import Order from "../models/order.js";

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


export const invalidatesCache = async ({product, order, admin, userId, orderId, productId}: InvalidateCacheProps) => {
  if(product){
    const productKeys: string[] = [
      "latest-products", "categories", "all-products-admin"
    ];

    if(typeof productId === "string") {
      productKeys.push(`product-${productId}`);
      console.log("productKeys in cache... string")
    }

    if(typeof productId === "object") {
      productId.forEach(i=>productKeys.push(`product-${i}`));
      console.log("productKeys in cache... array")
    }

    nodeCache.del(productKeys);
  }

  if(order){
    const orderKeys: string[] = ["all-orders", `${userId}-orders`,`${orderId}-order`];

    nodeCache.del(orderKeys);
  }
  
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


export const calculatePercentage = (thisMonth: number, lastMonth: number) => {

  if(lastMonth === 0) return thisMonth * 100; 

  // const percent = ((thisMonth - lastMonth)/lastMonth) * 100;
  const percent = (thisMonth/lastMonth) * 100;

  return Number(percent.toFixed(0));
}

export const getInventories = async ({categories, productsCount}: {categories: string[]; productsCount: number}) => {
  const categoriesCountPromise = categories.map((category) =>
      Product.countDocuments({ category })
    );

    const categoriesCount = await Promise.all(categoriesCountPromise);

    const categoryCount: Record<string, number>[] = [];

    categories.forEach((c, i) => {
      categoryCount.push({
        [c]: Math.round((categoriesCount[i] / productsCount) * 100),
      });
    });


    return categoryCount;
}


interface MyDocument extends Document {
  createdAt: Date;
}

export const func1 = ({length, documentArray}: {length: number; documentArray: MyDocument[]}) => {
  const data: number[] = new Array(length).fill(0);
  const today = new Date();

  documentArray.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
  
    if (monthDiff < length) {
      data[length - monthDiff - 1] += 1;      
    }
  });  

  return data;
}
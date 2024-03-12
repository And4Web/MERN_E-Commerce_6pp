import { nodeCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import { calculatePercentage } from "../utils/features.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats = {};

  if (nodeCache.has("admin-stats"))
    stats = JSON.parse(nodeCache.get("admin-stats")!);
  else {
    const today = new Date();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 2),
      end: today,
    };
    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 2),
      end: new Date(today.getFullYear(), today.getMonth(), 1),
    };

    const thisMonthProductsPromise = Product.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthProductsPromise = Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthUsersPromise = User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthUsersPromise = User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });


    const lastSixMonthsOrdersPromise = Order.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      }
    })

    const [
      thisMonthOrders,
      thisMonthProducts,
      thisMonthUsers,
      lastMonthOrders,
      lastMonthProducts,
      lastMonthUsers,
      productsCount, 
      allOrders,
      usersCount,
      lastSixMonthsOrders
    ] = await Promise.all([
      thisMonthOrdersPromise,
      thisMonthProductsPromise,
      thisMonthUsersPromise,
      lastMonthOrdersPromise,
      lastMonthProductsPromise,
      lastMonthUsersPromise,
      Product.countDocuments(),
      Order.find({}).select("total"),
      User.countDocuments(),
      lastSixMonthsOrdersPromise
    ]);

    const thisMonthRevenue = thisMonthOrders.reduce((total, order)=>total+order.total || 0, 0);

    const lastMonthRevenue = lastMonthOrders.reduce((total, order)=>total+order.total || 0, 0);

    const percentChange = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      products: calculatePercentage(thisMonthProducts.length, lastMonthProducts.length),
      users: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
      orders: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length),
    }

    const revenue = allOrders.reduce((total, order)=>total + order.total || 0, 0)

    const count = {
      revenue,
      users: usersCount,
      products: productsCount,
      orders: allOrders.length
    }

    const ordersMonthCounts = new Array(6).fill(0);
    const ordersMonthlyRevenue = new Array(6).fill(0);

    lastSixMonthsOrders.forEach(order=>{
      const creationDate = order.createdAt;
      const monthDiff = today.getMonth() - creationDate.getMonth();

      if(monthDiff < 6){
        ordersMonthCounts[6 - monthDiff - 1] += 1;
        ordersMonthlyRevenue[6 - monthDiff - 1] += order.total; 
      }
    })

    
    stats = {
      percentChange,
      count,
      chart: {
        order: ordersMonthCounts,
        revenue: ordersMonthlyRevenue
      }
    }



    nodeCache.set("admin-stats", JSON.stringify(stats));
  }

  return res.status(200).json({ success: true, stats });
});

export const getPieChartStats = TryCatch(async (req, res, next) => {});

export const getBarChartStats = TryCatch(async (req, res, next) => {});

export const getLineChartStats = TryCatch(async (req, res, next) => {});

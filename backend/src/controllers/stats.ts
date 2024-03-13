import { json } from "stream/consumers";
import { nodeCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import { calculatePercentage, getInventories } from "../utils/features.js";

// Dashboard
export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats = {};

  const key = "admin-stats"

  if (nodeCache.has(key))
    stats = JSON.parse(nodeCache.get(key)!);
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
      },
    });

    const latestTransactionsPromise = Order.find({})
      .select(["orderItems", "discount", "total", "status"])
      .limit(4);

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
      lastSixMonthsOrders,
      categories,
      femaleUsersCount,
      maleUsersCount,
      latestTransactions,
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
      lastSixMonthsOrdersPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "female" }),
      User.countDocuments({ gender: "male" }),
      latestTransactionsPromise,
    ]);

    const thisMonthRevenue = thisMonthOrders.reduce(
      (total, order) => total + order.total || 0,
      0
    );

    const lastMonthRevenue = lastMonthOrders.reduce(
      (total, order) => total + order.total || 0,
      0
    );

    const percentChange = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      products: calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
      users: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
      orders: calculatePercentage(
        thisMonthOrders.length,
        lastMonthOrders.length
      ),
    };

    const revenue = allOrders.reduce(
      (total, order) => total + order.total || 0,
      0
    );

    const count = {
      revenue,
      users: usersCount,
      products: productsCount,
      orders: allOrders.length,
    };

    const ordersMonthCounts = new Array(6).fill(0);
    const ordersMonthlyRevenue = new Array(6).fill(0);

    lastSixMonthsOrders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff < 6) {
        ordersMonthCounts[6 - monthDiff - 1] += 1;
        ordersMonthlyRevenue[6 - monthDiff - 1] += order.total;
      }
    });

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

    const usersGenderRatio = {
      male: maleUsersCount,
      female: femaleUsersCount,
    };

    const modifiedLatestTransactions = latestTransactions.map((i) => ({
      _id: i._id,
      discount: i.discount,
      amount: i.total,
      quantity: i.orderItems.length,
      status: i.status,
    }));

    stats = {
      categories,
      categoriesCount,
      categoryCount,
      percentChange,
      count,
      chart: {
        order: ordersMonthCounts,
        revenue: ordersMonthlyRevenue,
      },
      usersGenderRatio,
      modifiedLatestTransactions,
    };

    nodeCache.set(key, JSON.stringify(stats));
  }

  return res.status(200).json({ success: true, stats });
});

// Pie chart
export const getPieChartStats = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-pie-charts";

  if (nodeCache.has(key))
    charts = JSON.parse(nodeCache.get(key) as string);
  else {

    const allOrdersPromise = Order.find({}).select(["total","discount", "subtotal", "tax", "shippingCharges"])

    const [processingOrders, shippedOrders, deliveredOrders, categories, productsCount, productsOutOfStock, allOrders, allUsersDOB, allAdminUsers, allCustomerUsers] =
      await Promise.all([
        Order.countDocuments({ status: "Processing" }),
        Order.countDocuments({ status: "Shipped" }),
        Order.countDocuments({ status: "Delivered" }),
        Product.distinct("category"),
        Product.countDocuments(),
        Product.countDocuments({stock: 0}),
        allOrdersPromise,
        User.find({}).select("dob"),
        User.countDocuments({role: "admin"}),
        User.countDocuments({role: "user"}),
      ]);

    const orderFullfillment = {
      processing: processingOrders,
      shipped: shippedOrders,
      delivered: deliveredOrders
    }
    
    const productCategories = await getInventories({categories, productsCount});

    const stockAvailability = {
      inStock: productsCount - productsOutOfStock,
      outOfStock: productsOutOfStock
    };

    const totalGrossIncome = allOrders.reduce((prev, order)=>prev+(order.total || 0),  0);

    const discount = allOrders.reduce((prev, order)=>prev+(order.discount || 0),  0);

    const productionCost = allOrders.reduce((prev, order)=>prev+(order.shippingCharges || 0),  0);

    const burnt = allOrders.reduce((prev, order)=>prev+(order.tax || 0),  0);

    const marketingCost = Math.round(totalGrossIncome * (30/100));

    const netMargin = totalGrossIncome - discount - productionCost - burnt - marketingCost;

    const revenueDistribution = {
      netMargin,
      discount,
      productionCost,
      burnt,
      marketingCost,

    }

    const adminCustomers = {
      admin: allAdminUsers,
      customer: allCustomerUsers
    }

    const usersAgeGroup = {
      teen: allUsersDOB.filter(i => i.age < 20).length,
      adult: allUsersDOB.filter(i => i.age > 20 && i.age < 60).length,
      old: allUsersDOB.filter(i => i.age > 60).length
    }


    charts = {
      orderFullfillment,
      productCategories,
      stockAvailability,
      revenueDistribution,
      adminCustomers,
      usersAgeGroup,
      allUsersDOB,
      allAdminUsers,
      allCustomerUsers
    }

    nodeCache.set(key, JSON.stringify(charts));
  }

  return res.status(200).json({ success: true, charts });
});

// Bar chart
export const getBarChartStats = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-bar-charts";

  if(nodeCache.has(key)) charts = JSON.parse(nodeCache.get(key) as string);
  else{

    const today = new Date();
    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 12);

    const sixMonthsProductsPromise = Product.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      }
    })
    const sixMonthsUsersPromise = User.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      }
    })
    const twelveMonthsOrdersPromise = Order.find({
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      }
    })

    const [sixMonthsProducts, sixMonthsUsers, twelveMonthsOrders] = await Promise.all([sixMonthsProductsPromise, sixMonthsUsersPromise, twelveMonthsOrdersPromise])


    
    charts = {}


    nodeCache.set(key, JSON.stringify(charts));
  }

  return res.status(200).json({success: true, charts});
});

// Line chart
export const getLineChartStats = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-bar-charts"

  if(nodeCache.has(key)) charts = JSON.parse(nodeCache.get(key) as string);
  else{


    
    charts = {}


    nodeCache.set(key, JSON.stringify(charts));
  }

  return res.status(200).json({success: true, charts});
});

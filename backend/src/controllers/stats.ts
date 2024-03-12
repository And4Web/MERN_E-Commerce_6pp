import { nodeCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import Product from "../models/product.js";

export const getDashboardStats = TryCatch(async(req, res, next)=>{

  let stats = {};

  if(nodeCache.has("admin-stats")) stats = JSON.parse(nodeCache.get("admin-stats")!);
  else {
    const today = new Date();
    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 2),
      end: today
    }
    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth()-1, 2),
      end: new Date(today.getFullYear(), today.getMonth(), 1)
    }

    const thisMonthProducts = await Product.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      }
    })

    const lastMonthProducts = await Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      }
    })

    nodeCache.set("admin-stats", JSON.stringify(thisMonth.start));
  }

  return res.status(200).json({success: true, stats});

})

export const getPieChartStats = TryCatch(async(req, res, next)=>{})

export const getBarChartStats = TryCatch(async(req, res, next)=>{})

export const getLineChartStats = TryCatch(async(req, res, next)=>{})


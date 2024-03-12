import express from 'express';
import { getBarChartStats, getDashboardStats, getLineChartStats, getPieChartStats } from '../controllers/stats.js';
import { adminOnly } from '../middlewares/auth.js';

const router = express.Router();

// route - /api/v1/dashboard/stats
router.get("/stats", adminOnly, getDashboardStats)

// route - /api/v1/dashboard/pie
router.get("/pie", adminOnly, getPieChartStats)

// route - /api/v1/dashboard/bar
router.get("/bar", adminOnly, getBarChartStats)

// route - /api/v1/dashboard/line
router.get("/line", adminOnly, getLineChartStats)


export default router;
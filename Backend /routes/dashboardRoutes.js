import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route to get monthly totals and chart data for the dashboard
router.get("/", protect, getDashboardData);

export default router;

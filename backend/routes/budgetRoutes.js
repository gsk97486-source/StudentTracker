import express from "express";
import { getBudgetsByMonth, setBudget, deleteBudget } from "../controllers/budgetController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All budget routes require a valid JWT token
router.use(protect);

router.get("/", getBudgetsByMonth);
router.post("/", setBudget);
router.delete("/:id", deleteBudget);

export default router;

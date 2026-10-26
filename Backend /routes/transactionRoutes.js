import express from "express";
import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All transaction routes require a valid JWT token
router.use(protect);

router.get("/", getAllTransactions);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;

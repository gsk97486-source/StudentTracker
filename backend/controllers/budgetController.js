import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import { CATEGORIES } from "../utils/categories.js";

// Fetches all budgets for a given month and year and calculates how much the user spent in each category
export const getBudgetsByMonth = async (req, res) => {
  try {
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const year = Number(req.query.year) || new Date().getFullYear();

    const budgets = await Budget.find({
      user: req.user._id,
      month,
      year,
    }).sort({ category: 1 });

    // Calculate start and end dates for the selected month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    // Get all expense transactions for the user in that month
    const expenses = await Transaction.find({
      user: req.user._id,
      type: "expense",
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Attach spentAmount and percentage to each budget so the UI can show 80% and 100% warnings
    const budgetsWithSpending = budgets.map((budget) => {
      const spentAmount = expenses
        .filter((tx) => tx.category === budget.category)
        .reduce((sum, tx) => sum + tx.amount, 0);

      const percentage = Math.round((spentAmount / budget.limitAmount) * 100);

      return {
        _id: budget._id,
        category: budget.category,
        month: budget.month,
        year: budget.year,
        limitAmount: budget.limitAmount,
        spentAmount,
        percentage,
      };
    });

    return res.status(200).json(budgetsWithSpending);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch budgets" });
  }
};

// Creates a new monthly category budget or updates the limit if one already exists for that month/year
export const setBudget = async (req, res) => {
  try {
    const { category, month, year, limitAmount } = req.body;

    if (!category || !month || !year || !limitAmount) {
      return res.status(400).json({ message: "Please provide category, month, year, and limitAmount" });
    }

    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    if (Number(limitAmount) <= 0) {
      return res.status(400).json({ message: "Budget limit must be greater than zero" });
    }

    const savedBudget = await Budget.findOneAndUpdate(
      {
        user: req.user._id,
        category,
        month: Number(month),
        year: Number(year),
      },
      {
        limitAmount: Number(limitAmount),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json(savedBudget);
  } catch (error) {
    return res.status(500).json({ message: "Failed to save budget" });
  }
};

// Deletes a budget entry by ID
export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Budget.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Budget not found" });
    }

    return res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete budget" });
  }
};

import Transaction from "../models/Transaction.js";
import { CATEGORIES, PAYMENT_METHODS } from "../utils/categories.js";

// Gets all transactions for the logged-in user with optional filters for type, category, date range, and note search
export const getAllTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, search } = req.query;

    const filter = { user: req.user._id };

    if (type && (type === "income" || type === "expense")) {
      filter.type = type;
    }

    if (category && CATEGORIES.includes(category)) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    if (search && search.trim() !== "") {
      filter.note = { $regex: search.trim(), $options: "i" };
    }

    const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

// Validates input fields and creates a new transaction for the logged-in user
export const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, date, note, paymentMethod } = req.body;

    if (!type || !amount || !category || !date || !paymentMethod) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    if (!PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount: Number(amount),
      category,
      date: new Date(date),
      note: note || "",
      paymentMethod,
    });

    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create transaction" });
  }
};

// Updates an existing transaction if it belongs to the logged-in user
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, category, date, note, paymentMethod } = req.body;

    const transaction = await Transaction.findOne({ _id: id, user: req.user._id });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (!type || !amount || !category || !date || !paymentMethod) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    transaction.type = type;
    transaction.amount = Number(amount);
    transaction.category = category;
    transaction.date = new Date(date);
    transaction.note = note || "";
    transaction.paymentMethod = paymentMethod;

    const updated = await transaction.save();
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update transaction" });
  }
};

// Deletes a transaction by ID if it belongs to the logged-in user
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete transaction" });
  }
};

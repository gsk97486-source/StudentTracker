import mongoose from "mongoose";
import { CATEGORIES, PAYMENT_METHODS } from "../utils/categories.js";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;

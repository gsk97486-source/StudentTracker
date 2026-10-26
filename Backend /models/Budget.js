import mongoose from "mongoose";
import { CATEGORIES } from "../utils/categories.js";

// Defines the monthly category Budget schema for a specific User
const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    limitAmount: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Ensures a user can only have one budget per category in a given month and year
budgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;

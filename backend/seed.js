import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Transaction from "./models/Transaction.js";
import Budget from "./models/Budget.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    const existingDemo = await User.findOne({ email: "demo@example.com" });
    if (existingDemo) {
      await Transaction.deleteMany({ user: existingDemo._id });
      await Budget.deleteMany({ user: existingDemo._id });
      await User.deleteOne({ _id: existingDemo._id });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("demo1234", salt);

    const demoUser = await User.create({
      name: "Demo Student",
      email: "demo@example.com",
      password: hashedPassword,
    });

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const transactionsToInsert = [];
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentYear, currentMonth - 1 - i, 1);
      const y = targetDate.getFullYear();
      const m = targetDate.getMonth();

      transactionsToInsert.push(
        {
          user: demoUser._id,
          type: "income",
          amount: 45000,
          category: "Salary",
          date: new Date(y, m, 1),
          note: "Monthly salary",
          paymentMethod: "Bank",
        },
        {
          user: demoUser._id,
          type: "expense",
          amount: 12000,
          category: "Rent",
          date: new Date(y, m, 3),
          note: "Rent",
          paymentMethod: "Bank",
        },
        {
          user: demoUser._id,
          type: "expense",
          amount: 4500,
          category: "Food",
          date: new Date(y, m, 7),
          note: "Groceries",
          paymentMethod: "UPI",
        },
        {
          user: demoUser._id,
          type: "expense",
          amount: 2200,
          category: "Travel",
          date: new Date(y, m, 11),
          note: "Metro pass",
          paymentMethod: "UPI",
        },
        {
          user: demoUser._id,
          type: "expense",
          amount: 2800,
          category: "Bills",
          date: new Date(y, m, 15),
          note: "Electricity",
          paymentMethod: "Card",
        },
        {
          user: demoUser._id,
          type: "expense",
          amount: 3200,
          category: "Shopping",
          date: new Date(y, m, 19),
          note: "Clothes",
          paymentMethod: "Card",
        },
        {
          user: demoUser._id,
          type: "expense",
          amount: 1500,
          category: "Entertainment",
          date: new Date(y, m, 24),
          note: "Movies",
          paymentMethod: "Cash",
        }
      );
    }
    await Transaction.insertMany(transactionsToInsert);

    const budgetsToInsert = [
      {
        user: demoUser._id,
        category: "Food",
        month: currentMonth,
        year: currentYear,
        limitAmount: 5000,
      },
      {
        user: demoUser._id,
        category: "Bills",
        month: currentMonth,
        year: currentYear,
        limitAmount: 2500,
      },
      {
        user: demoUser._id,
        category: "Travel",
        month: currentMonth,
        year: currentYear,
        limitAmount: 4000,
      },
      {
        user: demoUser._id,
        category: "Rent",
        month: currentMonth,
        year: currentYear,
        limitAmount: 12000,
      },
    ];
    await Budget.insertMany(budgetsToInsert);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();

import Transaction from "../models/Transaction.js";

// Calculates monthly summary totals, category pie chart data, and 6-month bar chart data
export const getDashboardData = async (req, res) => {
  try {
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const year = Number(req.query.year) || new Date().getFullYear();

    // 1. Get transactions for the selected month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const monthlyTransactions = await Transaction.find({
      user: req.user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals = {};

    monthlyTransactions.forEach((tx) => {
      if (tx.type === "income") {
        totalIncome += tx.amount;
      } else {
        totalExpenses += tx.amount;
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
      }
    });

    const balance = totalIncome - totalExpenses;

    // Format category totals into an array for the Recharts PieChart
    const expensesByCategory = Object.keys(categoryTotals).map((category) => ({
      name: category,
      value: categoryTotals[category],
    }));

    // 2. Calculate income vs expenses for each of the last 6 months ending at the selected month
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const last6Months = [];

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(year, month - 1 - i, 1);
      const m = targetDate.getMonth();
      const y = targetDate.getFullYear();

      const start = new Date(y, m, 1);
      const end = new Date(y, m + 1, 0, 23, 59, 59, 999);

      const txs = await Transaction.find({
        user: req.user._id,
        date: { $gte: start, $lte: end },
      });

      let monthIncome = 0;
      let monthExpense = 0;

      txs.forEach((tx) => {
        if (tx.type === "income") {
          monthIncome += tx.amount;
        } else {
          monthExpense += tx.amount;
        }
      });

      last6Months.push({
        month: `${monthNames[m]} ${y}`,
        income: monthIncome,
        expense: monthExpense,
      });
    }

    return res.status(200).json({
      totalIncome,
      totalExpenses,
      balance,
      expensesByCategory,
      last6Months,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load dashboard data" });
  }
};

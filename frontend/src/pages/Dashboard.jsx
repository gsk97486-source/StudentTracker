import React, { useState, useEffect } from "react";
import api from "../api/axios.js";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const PIE_COLORS = ["#1d4ed8", "#15803d", "#b91c1c", "#d97706", "#7c3aed", "#0d9488", "#db2777", "#4b5563"];

// Displays monthly summary cards, budget alerts, category expense PieChart, and 6-month BarChart
const Dashboard = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    expensesByCategory: [],
    last6Months: [],
  });
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetches dashboard summary and budget warnings whenever the selected month or year changes
  useEffect(() => {
    const loadDashboardAndBudgets = async () => {
      setLoading(true);
      setError("");
      try {
        const [dashRes, budgetRes] = await Promise.all([
          api.get(`/dashboard?month=${month}&year=${year}`),
          api.get(`/budgets?month=${month}&year=${year}`),
        ]);
        setDashboardData(dashRes.data);
        setBudgets(budgetRes.data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardAndBudgets();
  }, [month, year]);

  // Filter budgets that have reached 80% or 100% to display a warning banner on the dashboard
  const activeAlerts = budgets.filter((b) => b.percentage >= 80);

  return (
    <div className="container">
      <div className="page-header">
        <h2>Dashboard</h2>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} style={{ padding: "8px" }}>
            <option value={1}>January</option>
            <option value={2}>February</option>
            <option value={3}>March</option>
            <option value={4}>April</option>
            <option value={5}>May</option>
            <option value={6}>June</option>
            <option value={7}>July</option>
            <option value={8}>August</option>
            <option value={9}>September</option>
            <option value={10}>October</option>
            <option value={11}>November</option>
            <option value={12}>December</option>
          </select>

          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{ width: "90px", padding: "8px" }}
          />
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          {/* Summary Cards for Total Income, Total Expenses, and Balance */}
          <div className="summary-grid">
            <div className="summary-card">
              <h4>Total Income</h4>
              <p className="text-income">₹{dashboardData.totalIncome.toLocaleString()}</p>
            </div>
            <div className="summary-card">
              <h4>Total Expenses</h4>
              <p className="text-expense">₹{dashboardData.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="summary-card">
              <h4>Monthly Balance</h4>
              <p className="text-balance">₹{dashboardData.balance.toLocaleString()}</p>
            </div>
          </div>

          {/* Budget Warnings Section if any category reaches 80% or 100% */}
          {activeAlerts.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: "12px" }}>Budget Warnings</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {activeAlerts.map((b) => (
                  <div key={b._id} className={b.percentage >= 100 ? "warning-100" : "warning-80"}>
                    {b.percentage >= 100
                      ? `ALERT: You have reached/exceeded 100% of your ${b.category} budget! (Spent ₹${b.spentAmount} of ₹${b.limitAmount} — ${b.percentage}%)`
                      : `WARNING: You have used ${b.percentage}% (80%+ threshold) of your ${b.category} budget (Spent ₹${b.spentAmount} of ₹${b.limitAmount}).`}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Charts Section */}
          <div className="charts-grid">
            {/* Pie Chart: Expenses by Category */}
            <div className="card">
              <h3 style={{ marginBottom: "12px" }}>Expenses by Category</h3>
              {dashboardData.expensesByCategory.length === 0 ? (
                <p style={{ color: "#666666" }}>No expenses recorded for this month.</p>
              ) : (
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={dashboardData.expensesByCategory}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        label
                      >
                        {dashboardData.expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Bar Chart: Last 6 Months Income vs Expenses */}
            <div className="card">
              <h3 style={{ marginBottom: "12px" }}>Last 6 Months: Income vs Expenses</h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={dashboardData.last6Months}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#15803d" />
                    <Bar dataKey="expense" name="Expense" fill="#b91c1c" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
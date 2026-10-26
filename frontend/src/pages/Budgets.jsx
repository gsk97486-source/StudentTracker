import React, { useState, useEffect } from "react";
import api from "../api/axios.js";

const EXPENSE_CATEGORIES = [
  "Food",
  "Travel",
  "Rent",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Other",
];

// Allows the user to set monthly category budgets and displays 80% and 100% spending warnings
const Budgets = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [category, setCategory] = useState("Food");
  const [limitAmount, setLimitAmount] = useState("");

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Loads budgets and current spending for the selected month and year
  const fetchBudgets = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/budgets?month=${month}&year=${year}`);
      setBudgets(response.data);
    } catch (err) {
      setError("Failed to fetch budgets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

  // Saves or updates a monthly budget limit for the chosen category
  const handleSaveBudget = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/budgets", {
        category,
        month,
        year,
        limitAmount: Number(limitAmount),
      });
      setLimitAmount("");
      fetchBudgets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save budget.");
    }
  };

  // Deletes a budget by ID
  const handleDeleteBudget = async (id) => {
    try {
      await api.delete(`/budgets/${id}`);
      fetchBudgets();
    } catch (err) {
      setError("Failed to delete budget.");
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>Monthly Budgets</h2>

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

      {/* Form to Set Monthly Category Budget */}
      <div className="card">
        <h3 style={{ marginBottom: "12px" }}>Set Category Budget for Selected Month</h3>
        <form onSubmit={handleSaveBudget} className="form-grid">
          <div className="form-group">
            <label>Expense Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Monthly Limit (₹)</label>
            <input
              type="number"
              min="1"
              value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
              placeholder="e.g. 5000"
              required
            />
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Save Budget
            </button>
          </div>
        </form>
      </div>

      {/* Budgets List with 80% and 100% Warnings */}
      <div className="card">
        <h3 style={{ marginBottom: "12px" }}>Budget Status & Warnings</h3>
        {loading ? (
          <p>Loading budgets...</p>
        ) : budgets.length === 0 ? (
          <p style={{ color: "#666666" }}>No budgets set for this month yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Spent / Limit</th>
                  <th>Usage</th>
                  <th>Warning Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((b) => {
                  const barColor =
                    b.percentage >= 100 ? "#dc2626" : b.percentage >= 80 ? "#f59e0b" : "#16a34a";

                  return (
                    <tr key={b._id}>
                      <td style={{ fontWeight: "bold" }}>{b.category}</td>
                      <td>
                        ₹{b.spentAmount.toLocaleString()} / ₹{b.limitAmount.toLocaleString()}
                      </td>
                      <td style={{ minWidth: "160px" }}>
                        <div>{b.percentage}% used</div>
                        <div className="progress-bar-bg">
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${Math.min(b.percentage, 100)}%`,
                              backgroundColor: barColor,
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        {b.percentage >= 100 ? (
                          <span className="warning-100">
                            100% Limit Reached / Exceeded!
                          </span>
                        ) : b.percentage >= 80 ? (
                          <span className="warning-80">
                            Warning: Over 80% of Budget Used
                          </span>
                        ) : (
                          <span className="status-ok">Within Budget</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteBudget(b._id)}
                          className="btn btn-danger btn-small"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budgets;
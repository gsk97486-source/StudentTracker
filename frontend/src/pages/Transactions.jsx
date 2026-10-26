import React, { useState, useEffect } from "react";
import api from "../api/axios.js";

const CATEGORIES = [
  "Food",
  "Travel",
  "Rent",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Salary",
  "Other",
];

const PAYMENT_METHODS = ["Cash", "UPI", "Card", "Bank"];

// Manages adding, editing, deleting, searching, and filtering transactions
const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form states for adding or editing a transaction
  const [editingId, setEditingId] = useState(null);
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [note, setNote] = useState("");

  // Filter states
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchNote, setSearchNote] = useState("");

  // Fetches transactions from the backend using the active filter states
  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filterType) params.append("type", filterType);
      if (filterCategory) params.append("category", filterCategory);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (searchNote) params.append("search", searchNote);

      const response = await api.get(`/transactions?${params.toString()}`);
      setTransactions(response.data);
    } catch (err) {
      setError("Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filterType, filterCategory, startDate, endDate, searchNote]);

  // Resets the transaction form back to default values
  const resetForm = () => {
    setEditingId(null);
    setType("expense");
    setAmount("");
    setCategory("Food");
    setDate(new Date().toISOString().split("T")[0]);
    setPaymentMethod("UPI");
    setNote("");
  };

  // Handles creating a new transaction or updating an existing one
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      type,
      amount: Number(amount),
      category,
      date,
      paymentMethod,
      note,
    };

    try {
      if (editingId) {
        await api.put(`/transactions/${editingId}`, payload);
      } else {
        await api.post("/transactions", payload);
      }
      resetForm();
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save transaction.");
    }
  };

  // Loads a transaction's details into the form for editing
  const handleEdit = (tx) => {
    setEditingId(tx._id);
    setType(tx.type);
    setAmount(tx.amount);
    setCategory(tx.category);
    setDate(tx.date.split("T")[0]);
    setPaymentMethod(tx.paymentMethod);
    setNote(tx.note || "");
  };

  // Deletes a transaction by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      setError("Failed to delete transaction.");
    }
  };

  // Clears all filter inputs
  const clearFilters = () => {
    setFilterType("");
    setFilterCategory("");
    setStartDate("");
    setEndDate("");
    setSearchNote("");
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>Transactions</h2>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {/* Add / Edit Transaction Form */}
      <div className="card">
        <h3 style={{ marginBottom: "12px" }}>
          {editingId ? "Edit Transaction" : "Add New Transaction"}
        </h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              min="1"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 500"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div className="form-group" style={{ flexDirection: "row", gap: "8px" }}>
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filters Bar */}
      <div className="card">
        <h3 style={{ marginBottom: "12px" }}>Filter & Search Transactions</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Type</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Search Note</label>
            <input
              type="text"
              value={searchNote}
              onChange={(e) => setSearchNote(e.target.value)}
              placeholder="Search note keyword..."
            />
          </div>

          <div className="form-group">
            <button type="button" onClick={clearFilters} className="btn btn-secondary">
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <h3 style={{ marginBottom: "12px" }}>Transaction List ({transactions.length})</h3>
        {loading ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p style={{ color: "#666666" }}>No transactions match your filters.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Payment</th>
                  <th>Note</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td style={{ textTransform: "capitalize" }}>{tx.type}</td>
                    <td>{tx.category}</td>
                    <td>{tx.paymentMethod}</td>
                    <td>{tx.note || "-"}</td>
                    <td className={tx.type === "income" ? "text-income" : "text-expense"} style={{ fontWeight: "bold" }}>
                      {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                    </td>
                    <td>
                      <button onClick={() => handleEdit(tx)} className="btn btn-secondary btn-small">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(tx._id)} className="btn btn-danger btn-small">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
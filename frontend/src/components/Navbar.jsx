import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

// Displays the top navigation bar with links to Dashboard, Transactions, and Budgets
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Expense Tracker
      </Link>

      {user ? (
        <div className="navbar-links">
          <Link to="/">Dashboard</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/budgets">Budgets</Link>
          <span className="user-label">Hi, {user.name}</span>
          <button onClick={handleLogout} className="btn btn-secondary btn-small">
            Logout
          </button>
        </div>
      ) : (
        <div className="navbar-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
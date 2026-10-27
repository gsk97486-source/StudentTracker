# Expense Tracker (MERN)

A full-stack Expense Tracker web application built with Express, MongoDB, and React (Vite).

## Project Structure

```
Expense_Tracter/
├── backend/            # Express REST API & MongoDB models
│   ├── config/         # Database connection (Mongoose)
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth & validation middleware
│   ├── models/         # Mongoose models (User, Budget, Transaction)
│   ├── routes/         # Express routes
│   ├── utils/          # Helpers & constants
│   ├── .env            # Environment configuration
│   ├── package.json
│   ├── seed.js         # Optional database seeder
│   └── server.js       # Backend entrypoint
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── api/        # Axios API client
│   │   ├── components/ # UI components (Navbar, ProtectedRoute)
│   │   ├── context/    # Auth context & state
│   │   ├── pages/      # Views (Login, Register, Dashboard, Budgets, Transactions)
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## How to Run

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

*Runs on [http://localhost:5001](http://localhost:5001).*

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

*Runs on [http://localhost:5173](http://localhost:5173).*
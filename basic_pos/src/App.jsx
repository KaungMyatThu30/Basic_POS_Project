import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SalesJournal from "./pages/SalesJournal.jsx";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("pos_transactions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("pos_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={<Dashboard transactions={transactions} />}
            />
            <Route
              path="/journal"
              element={
                <SalesJournal
                  transactions={transactions}
                  onAddTransaction={handleAddTransaction}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

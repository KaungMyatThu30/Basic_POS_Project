import React, { useState } from "react";
import productData from "../product-item.json";

const SalesJournal = ({ transactions, onAddTransaction }) => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const currentProduct = productData.find(
    (p) => p.itemName === selectedProduct
  );
  const total = currentProduct ? currentProduct.unitPrice * quantity : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentProduct || quantity <= 0) return;

    const newTransaction = {
      id: Date.now(),
      date,
      itemName: currentProduct.itemName,
      category: currentProduct.category,
      unitPrice: currentProduct.unitPrice,
      quantity: parseInt(quantity),
      totalPrice: total,
    };

    onAddTransaction(newTransaction);
    setQuantity(1);
    setSelectedProduct("");
  };

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <h1>Sales Journal</h1>
        <p className="subtitle">Enter new transactions below.</p>
      </header>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label className="input-label">Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                required
                className="modern-input"
              >
                <option value="">Select an item...</option>
                {productData.map((p, idx) => (
                  <option key={idx} value={p.itemName}>
                    {p.itemName} (${p.unitPrice})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="modern-input"
              />
            </div>

            <div>
              <label className="input-label">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="modern-input"
              />
            </div>

            <button type="submit" className="btn-primary">
              <svg className="svg-icon" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Record Sale
            </button>
          </div>
          {total > 0 && (
            <div
              style={{
                marginTop: "1rem",
                color: "#4f46e5",
                fontWeight: "700",
                fontSize: "1.1rem",
                textAlign: "right",
              }}
            >
              Total: ${total.toLocaleString()}
            </div>
          )}
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "1rem" }}>Transactions</h3>
        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Category</th>
                <th>Qty</th>
                <th style={{ textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {[...transactions].reverse().map((t) => (
                <tr key={t.id}>
                  <td style={{ color: "#64748b" }}>{t.date}</td>
                  <td style={{ fontWeight: 500 }}>{t.itemName}</td>
                  <td>
                    <span className="pill">{t.category}</span>
                  </td>
                  <td>{t.quantity}</td>
                  <td style={{ textAlign: "right", fontWeight: 700 }}>
                    ${t.totalPrice}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "#94a3b8",
                    }}
                  >
                    No history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesJournal;

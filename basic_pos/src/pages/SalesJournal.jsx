import React, { useState } from "react";
import productData from "../product-item.json";

const SalesJournal = ({ transactions, onAddTransaction }) => {
  const [isCustom, setIsCustom] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [quantity, setQuantity] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState("");

  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [customPrice, setCustomPrice] = useState("");

  const getPreviewTotal = () => {
    if (isCustom) {
      return (parseFloat(customPrice) || 0) * quantity;
    } else {
      const prod = productData.find((p) => p.itemName === selectedProduct);
      return prod ? prod.unitPrice * quantity : 0;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newItem = {};

    if (isCustom) {
      if (!customName || !customCategory || !customPrice) {
        alert("Please fill in all custom fields");
        return;
      }
      newItem = {
        itemName: customName,
        category: customCategory,
        unitPrice: parseFloat(customPrice),
      };
    } else {
      const prod = productData.find((p) => p.itemName === selectedProduct);
      if (!prod) {
        alert("Please select a product");
        return;
      }
      newItem = {
        itemName: prod.itemName,
        category: prod.category,
        unitPrice: prod.unitPrice,
      };
    }

    if (quantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      date,
      itemName: newItem.itemName,
      category: newItem.category,
      unitPrice: newItem.unitPrice,
      quantity: parseInt(quantity),
      totalPrice: newItem.unitPrice * parseInt(quantity),
    };

    onAddTransaction(newTransaction);

    setQuantity(1);
    if (isCustom) {
      setCustomName("");
      setCustomCategory("");
      setCustomPrice("");
    } else {
      setSelectedProduct("");
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <h1>Sales Journal</h1>
      </header>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsCustom(!isCustom);
              }}
              style={{
                backgroundColor: "#111827",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                transition: "opacity 0.2s",
              }}
            >
              {isCustom ? (
                <svg
                  className="svg-icon"
                  viewBox="0 0 24 24"
                  style={{ stroke: "white" }}
                >
                  <path d="M19 12H5" />
                  <path d="M12 19l-7-7 7-7" />
                </svg>
              ) : (
                <svg
                  className="svg-icon"
                  viewBox="0 0 24 24"
                  style={{ stroke: "white" }}
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              )}

              {isCustom ? "Back to Product List" : "Extra Spending Category"}
            </button>
          </div>

          <div className="form-grid">
            {isCustom ? (
              <>
                <div>
                  <label className="input-label">Item Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Special Delivery"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    required={isCustom}
                    className="modern-input"
                  />
                </div>
                <div>
                  <label className="input-label">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Service"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    required={isCustom}
                    className="modern-input"
                  />
                </div>
                <div>
                  <label className="input-label">Unit Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    required={isCustom}
                    className="modern-input"
                  />
                </div>
              </>
            ) : (
              <div style={{ gridColumn: "span 3" }}>
                <label className="input-label">Select Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  required={!isCustom}
                  className="modern-input"
                >
                  <option value="">-- Choose Item --</option>
                  {productData.map((p, idx) => (
                    <option key={idx} value={p.itemName}>
                      {p.itemName} ({p.category}) - ${p.unitPrice}
                    </option>
                  ))}
                </select>
              </div>
            )}

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

            <button
              type="submit"
              className="btn-primary"
              style={{ height: "46px", marginTop: "auto" }}
            >
              <svg className="svg-icon" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Record Sale
            </button>
          </div>

          <div
            style={{
              marginTop: "1rem",
              textAlign: "right",
              fontSize: "1.1rem",
              fontWeight: "700",
              color: "#4f46e5",
            }}
          >
            Total: ${getPreviewTotal().toLocaleString()}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Transactions</h3>
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
              {transactions
                .slice()
                .reverse()
                .map((t) => (
                  <tr key={t.id}>
                    <td style={{ color: "#64748b" }}>{t.date}</td>
                    <td style={{ fontWeight: 500 }}>{t.itemName}</td>
                    <td>
                      <span className="pill">{t.category}</span>
                    </td>
                    <td>{t.quantity}</td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>
                      ${t.totalPrice.toLocaleString()}
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

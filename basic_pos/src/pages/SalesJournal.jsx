import React, { useMemo, useState } from "react";
import productData from "../data/pos_item.json";

const PRODUCT_STORE_KEY = "pos_products_runtime";

const SalesJournal = ({
  transactions = [],
  onAddTransaction,
  onDeleteTransaction,
  onClearTransactions,
}) => {
  const [isCustom, setIsCustom] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState("");

  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [customPrice, setCustomPrice] = useState("");

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem(PRODUCT_STORE_KEY);
    return saved ? JSON.parse(saved) : productData;
  });

  const allProducts = useMemo(() => products, [products]);

  const saveProducts = (updated) => {
    setProducts(updated);
    localStorage.setItem(PRODUCT_STORE_KEY, JSON.stringify(updated));
  };

  const getPreviewTotal = () => {
    const qty = Number(quantity) || 0;

    if (isCustom) return (Number(customPrice) || 0) * qty;

    const prod = allProducts.find((p) => p.itemName === selectedProduct);
    return prod ? Number(prod.unitPrice || 0) * qty : 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    if (isCustom) {
      if (!customName || !customCategory || !customPrice) {
        alert("Please fill in all custom fields");
        return;
      }

      const priceNum = Number(customPrice);
      if (!priceNum || priceNum <= 0) {
        alert("Unit Price must be greater than 0");
        return;
      }

      const newExtraItem = {
        itemName: customName.trim(),
        category: customCategory.trim(),
        description: "Extra spending item",
        unitPrice: priceNum,
        inventory: qty, 
      };

      const exists = allProducts.some(
        (p) => p.itemName.toLowerCase() === newExtraItem.itemName.toLowerCase()
      );
      if (exists) {
        alert("This item name already exists. Please use a different name.");
        return;
      }

      const updatedProducts = [...allProducts, newExtraItem];
      saveProducts(updatedProducts);

      setQuantity(1);
      setCustomName("");
      setCustomCategory("");
      setCustomPrice("");
      setIsCustom(false);

      alert("Saved to POS Items list. No transaction recorded.");
      return;
    }

    const productIndex = allProducts.findIndex(
      (p) => p.itemName === selectedProduct
    );
    if (productIndex === -1) {
      alert("Please select a product");
      return;
    }

    const prod = allProducts[productIndex];
    const currentStock = Number(prod.inventory ?? 0);

    if (qty > currentStock) {
      alert(`Not enough stock. Available: ${currentStock}`);
      return;
    }


    const updatedProducts = [...allProducts];
    updatedProducts[productIndex] = {
      ...prod,
      inventory: currentStock - qty,
    };
    saveProducts(updatedProducts);


    const unitPrice = Number(prod.unitPrice || 0);
    const newTransaction = {
      id: Date.now(), 
      date,
      itemName: prod.itemName,
      category: prod.category,
      unitPrice,
      quantity: qty,
      totalPrice: unitPrice * qty,
    };

    onAddTransaction?.(newTransaction);

    setQuantity(1);
    setSelectedProduct("");
  };

  const handleDelete = (id) => {
    onDeleteTransaction?.(id);
  };

  const handleClearAll = () => {
    const ok = confirm("Clear all transactions?");
    if (!ok) return;
    onClearTransactions?.();
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
                setIsCustom((prev) => !prev);
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
              }}
            >
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
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    required
                    className="modern-input"
                    placeholder=""
                  />
                </div>

                <div>
                  <label className="input-label">Category</label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    required
                    className="modern-input"
                    placeholder="e.g. Service"
                  />
                </div>

                <div>
                  <label className="input-label">Unit Price (฿)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    required
                    className="modern-input"
                    placeholder="0.00"
                  />
                </div>
              </>
            ) : (
              <div style={{ gridColumn: "span 3" }}>
                <label className="input-label">Select Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  required
                  className="modern-input"
                >
                  <option value="">Choose Item</option>
                  {allProducts.map((p, idx) => (
                    <option
                      key={`${p.itemName}-${idx}`}
                      value={p.itemName}
                      disabled={Number(p.inventory || 0) <= 0}
                    >
                      {p.itemName} ({p.category})| Stock:{" "}
                      {p.inventory}
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
                onChange={(e) => setQuantity(Number(e.target.value))}
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
              {isCustom ? "Save Item" : "Record Sale"}
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
            Total: ฿{getPreviewTotal().toLocaleString()}
          </div>
        </form>
      </div>
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <h3 style={{ margin: 0 }}>Transactions</h3>

          {transactions.length > 0 && (
            <button
              onClick={handleClearAll}
              style={{
                background: "#111827",
                color: "white",
                border: "none",
                padding: "10px 14px",
                borderRadius: "10px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Clear All
            </button>
          )}
        </div>

        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Category</th>
                <th>Qty</th>
                <th style={{ textAlign: "right" }}>Total</th>
                <th width="90" style={{ textAlign: "center" }}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions
                .slice()
                .reverse()
                .map((t, idx) => (
                  <tr key={t.id ?? `${t.date}-${t.itemName}-${idx}`}>
                    <td style={{ color: "#64748b" }}>{t.date}</td>
                    <td style={{ fontWeight: 500 }}>{t.itemName}</td>
                    <td>
                      <span className="pill">{t.category}</span>
                    </td>
                    <td>{t.quantity}</td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>
                      ฿{Number(t.totalPrice || 0).toLocaleString()}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        onClick={() => handleDelete(t.id)}
                        style={{
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          fontSize: "0.8rem",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                        title="Delete this transaction"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

              {transactions.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
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

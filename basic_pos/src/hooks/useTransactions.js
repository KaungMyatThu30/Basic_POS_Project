import { useState, useEffect } from "react";
export const useTransactions = () => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("pos_data");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("pos_data", JSON.stringify(transactions));
  }, [transactions]);
  const addTransaction = (txn) => {
    setTransactions([...transactions, { ...txn, id: Date.now() }]);
  };
  return { transactions, addTransaction };
};
 
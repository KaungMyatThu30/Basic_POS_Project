import React, { useMemo, useState } from "react";
 
const CustomLineChart = ({ data }) => {
  if (!data || data.length === 0)
    return (
      <div
        style={{
          height: 250,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#aaa",
        }}
      >
        No data for this period
      </div>
    );
 
  const isSinglePoint = data.length === 1;
  const height = 250;
  const width = 800;
  const paddingX = 50;
  const paddingY = 30;
 
  const maxY = Math.max(...data.map((d) => d.value), 10) * 1.2;
 
  const getX = (index) =>
    (index / (data.length - 1 || 1)) * (width - paddingX * 2) + paddingX;
  const getY = (value) =>
    height - paddingY - (value / maxY) * (height - paddingY * 2);
 
  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(" ");
 
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    y: height - paddingY - pct * (height - paddingY * 2),
    label: Math.round(pct * maxY),
  }));
 
  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: "auto" }}
      >
        {gridLines.map((line, i) => (
          <g key={i}>
            <line
              x1={paddingX}
              y1={line.y}
              x2={width}
              y2={line.y}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
            <text
              x={0}
              y={line.y + 4}
              fill="#94a3b8"
              fontSize="12"
              fontFamily="sans-serif"
            >
              {line.label}
            </text>
          </g>
        ))}
 
        {!isSinglePoint && (
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
 
        {data.map((d, i) => (
          <g key={i}>
            <circle
              cx={getX(i)}
              cy={getY(d.value)}
              r="5"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
            >
              <title>
                {d.label}: ${d.value}
              </title>
            </circle>
            <text
              x={getX(i)}
              y={height - 5}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="11"
              style={{
                display: data.length > 12 && i % 2 !== 0 ? "none" : "block",
              }}
            >
              {d.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
 
const CustomDoughnut = ({ data, colors }) => {
  if (!data || data.length === 0)
    return (
      <div
        style={{
          height: 250,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#aaa",
        }}
      >
        No data for this period
      </div>
    );
 
const total = data.reduce((sum, item) => sum + item.value, 0);

const gradient = data
  .reduce((acc, item, index) => {
    const pct = (item.value / total) * 100;
    const currentAngle = (acc.angle || 0) + pct;
    const color = colors[index % colors.length];
    acc.stops.push(`${color} 0 ${currentAngle}%`);
    acc.angle = currentAngle;
    return acc;
  }, { stops: [], angle: 0 })
  .stops.join(", ");
 
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ position: "relative", width: "180px", height: "180px" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: `conic-gradient(${gradient})`,
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "15%",
            width: "70%",
            height: "70%",
            borderRadius: "50%",
            background: "white",
          }}
        ></div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginTop: "20px",
          justifyContent: "center",
        }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.85rem",
              color: "#64748b",
            }}
          >
            <span
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: colors[index % colors.length],
                borderRadius: "2px",
              }}
            ></span>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};
 
const Dashboard = ({ transactions = [] }) => {
  const [filter, setFilter] = useState("daily");
 
  const stats = useMemo(() => {
    const safeTransactions = transactions || [];
 
    const now = new Date();
    const todayStr = now.toLocaleDateString("en-CA");
 
    const filteredTransactions = safeTransactions.filter((t) => {
      if (filter === "Daily") return t.date === todayStr;
 
      if (filter === "Weekly") {
        const txDate = new Date(t.date);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate - txDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && txDate <= todayDate;
      }
 
      if (filter === "Monthly")
        return t.date.slice(0, 7) === todayStr.slice(0, 7);
 
      return true;
    });
 
    let lineChartData = [];
 
    if (filter === "daily") {
      lineChartData = filteredTransactions.map((t) => {
        const timeLabel = new Date(t.id).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return { label: timeLabel, value: t.totalPrice };
      });
    } else {
      const salesByDate = filteredTransactions.reduce((acc, t) => {
        acc[t.date] = (acc[t.date] || 0) + t.totalPrice;
        return acc;
      }, {});
      lineChartData = Object.keys(salesByDate)
        .sort()
        .map((date) => ({ label: date, value: salesByDate[date] }));
    }
 
    const totalSales = filteredTransactions.reduce(
      (sum, t) => sum + t.totalPrice,
      0
    );
 
    const totalProducts = filteredTransactions.reduce(
      (sum, t) => sum + t.quantity,
      0
    );
 
    const salesByCategory = filteredTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.totalPrice;
      return acc;
    }, {});
    const pieChartData = Object.keys(salesByCategory).map((cat) => ({
      name: cat,
      value: salesByCategory[cat],
    }));
 
    const salesByProduct = filteredTransactions.reduce((acc, t) => {
      acc[t.itemName] = (acc[t.itemName] || 0) + t.quantity;
      return acc;
    }, {});
    const topProducts = Object.entries(salesByProduct)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, qty]) => ({ name, qty }));
 
    return {
      totalSales,
      totalProducts,
      lineChartData,
      pieChartData,
      topProducts,
    };
  }, [transactions, filter]);
 
  const CATEGORY_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];
 
  return (
    <div className="animate-fade-in">
      <header
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1>Dashboard</h1>
        </div>
 
        <div
          style={{
            display: "flex",
            gap: "8px",
            background: "#ffffff",
            padding: "4px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          }}
        >
          {["daily", "weekly", "monthly"].map((period) => (
            <button
              key={period}
              onClick={() => setFilter(period)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: "600",
                textTransform: "capitalize",
                transition: "all 0.2s",
                backgroundColor: filter === period ? "#4f46e5" : "transparent",
                color: filter === period ? "#ffffff" : "#64748b",
                boxShadow:
                  filter === period ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {period}
            </button>
          ))}
        </div>
      </header>
 
      <div className="stats-grid">
        <div className="stat-card">
          <div className="icon-box blue">
            <svg className="svg-icon" viewBox="0 0 24 24">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div className="stat-info">
            <h3 style={{ textTransform: "capitalize" }}>
              Total Sales ({filter})
            </h3>
            <div className="stat-value">
              ${stats.totalSales.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="icon-box green">
            <svg className="svg-icon" viewBox="0 0 24 24">
              <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
          </div>
          <div className="stat-info">
            <h3 style={{ textTransform: "capitalize" }}>
              Total Products ({filter})
            </h3>
            <div className="stat-value">{stats.totalProducts}</div>
          </div>
        </div>
      </div>
 
      <div className="charts-grid">
        <div className="card">
          <h3>
            {filter === "Daily"
              ? "Daily's Hourly Trends"
              : `${
                  filter.charAt(0).toUpperCase() + filter.slice(1)
                } Sales Trends`}
          </h3>
          <CustomLineChart data={stats.lineChartData} />
        </div>
        <div className="card">
          <h3>Sales by Category</h3>
          <CustomDoughnut data={stats.pieChartData} colors={CATEGORY_COLORS} />
        </div>
      </div>
 
      <div className="card">
        <h3>Top Selling Products ({filter})</h3>
        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th width="80">Rank</th>
                <th>Product Name</th>
                <th width="150" style={{ textAlign: "right" }}>
                  Units Sold
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map((prod, index) => (
                <tr key={index}>
                  <td>
                    <span className="pill">#{index + 1}</span>
                  </td>
                  <td>
                    <b>{prod.name}</b>
                  </td>
                  <td style={{ textAlign: "right" }}>{prod.qty}</td>
                </tr>
              ))}
              {stats.topProducts.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "#94a3b8",
                    }}
                  >
                    No sales found for this period
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
 
export default Dashboard;
 
 
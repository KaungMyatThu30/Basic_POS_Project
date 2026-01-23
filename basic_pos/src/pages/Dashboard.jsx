import React, { useMemo } from "react";
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
        No data
      </div>
    );
 
  const height = 250;
  const width = 800;
  const paddingX = 40;
  const paddingY = 30;
 
  
  const maxY = Math.max(...data.map((d) => d.value), 10) * 1.2;
 
  const getX = (index) =>
    (index / (data.length - 1)) * (width - paddingX * 2) + paddingX;
  const getY = (value) =>
    height - paddingY - (value / maxY) * (height - paddingY * 2);
 
  
  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(" ");
 
  
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((pct) => {
    const yVal = height - paddingY - pct * (height - paddingY * 2);
    const labelVal = Math.round(pct * maxY);
    return { y: yVal, label: labelVal };
  });
 
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
 
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
 
        {data.map((d, i) => (
          <circle
            key={i}
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
        ))}
      </svg>
 
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: "40px",
          marginTop: "-10px",
          color: "#94a3b8",
          fontSize: "0.75rem",
        }}
      >
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
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
        No data
      </div>
    );
 
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
 
  // Build the gradient string
  const gradient = data
    .map((item, index) => {
      const pct = (item.value / total) * 100;
      const start = currentAngle;
      currentAngle += pct;
      const color = colors[index % colors.length];
      return `${color} 0 ${currentAngle}%`;
    })
    .join(", ");
 
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
  const stats = useMemo(() => {
    const safeTransactions = transactions || [];
    const totalSales = safeTransactions.reduce(
      (sum, t) => sum + t.totalPrice,
      0
    );
 
    const salesByDate = safeTransactions.reduce((acc, t) => {
      acc[t.date] = (acc[t.date] || 0) + t.totalPrice;
      return acc;
    }, {});
    const lineChartData = Object.keys(salesByDate)
      .sort()
      .map((date) => ({ label: date, value: salesByDate[date] }));
 
    const salesByCategory = safeTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.totalPrice;
      return acc;
    }, {});
    const pieChartData = Object.keys(salesByCategory).map((cat) => ({
      name: cat,
      value: salesByCategory[cat],
    }));
 
    const salesByProduct = safeTransactions.reduce((acc, t) => {
      acc[t.itemName] = (acc[t.itemName] || 0) + t.quantity;
      return acc;
    }, {});
    const topProducts = Object.entries(salesByProduct)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, qty]) => ({ name, qty }));
 
    return { totalSales, lineChartData, pieChartData, topProducts };
  }, [transactions]);
 
  const CATEGORY_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];
 
  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <h1>Dashboard Overview</h1>
        <p className="subtitle">Real-time sales insights</p>
      </header>
 
      <div className="stats-grid">
        <div className="stat-card">
          <div className="icon-box blue">
            <svg className="svg-icon" viewBox="0 0 24 24">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
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
            <h3>Total Orders</h3>
            <div className="stat-value">{transactions.length}</div>
          </div>
        </div>
      </div>
 
      <div className="charts-grid">
        
        <div className="card">
          <h3>Daily Sales Trends</h3>
          <CustomLineChart data={stats.lineChartData} />
        </div>
 
        
        <div className="card">
          <h3>Sales by Category</h3>
          <CustomDoughnut data={stats.pieChartData} colors={CATEGORY_COLORS} />
        </div>
      </div>
 
      <div className="card">
        <h3>🏆 Top Selling Products</h3>
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
                    No sales yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>7
    </div>
  );
};
 
export default Dashboard;
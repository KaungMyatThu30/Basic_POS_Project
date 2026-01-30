import React, { useMemo, useState, useEffect } from "react";
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
                {d.label}: ฿{Number(d.value || 0).toLocaleString()}
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
  let currentAngle = 0;

  const gradient = data
    .map((item, index) => {
      const pct = total > 0 ? (item.value / total) * 100 : 0;
      currentAngle += pct;
      const color = colors[index % colors.length];
      return `${color} 0 ${currentAngle}%`;
    })
    .join(", ");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: "180px", height: "180px" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: total > 0 ? `conic-gradient(${gradient})` : "#e2e8f0",
          }}
        />
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
        />
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
            />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};
const pad2 = (n) => String(n).padStart(2, "0");

const formatDateISO = (d) => {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

const toMidnight = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const safeISO = (s) => {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
};

const startOfWeekMon = (dateObj) => {
  const d = toMidnight(dateObj);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d;
};

const endOfWeekMon = (dateObj) => {
  const start = startOfWeekMon(dateObj);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
};

const formatRangeLabel = (startISO, endISO) => {
  if (!startISO && !endISO) return "";
  return `${startISO || "—"} → ${endISO || "—"}`;
};
const Dashboard = ({ transactions = [] }) => {
  const [filter, setFilter] = useState("daily");
  const [singleDay, setSingleDay] = useState("");
  const [weekAnchor, setWeekAnchor] = useState("");
  const [monthAnchor, setMonthAnchor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  useEffect(() => {
    const today = formatDateISO(toMidnight(new Date()));
    setSingleDay(today);
    setWeekAnchor(today);
    setMonthAnchor(`${new Date().getFullYear()}-${pad2(new Date().getMonth() + 1)}`);
    setStartDate(today);
    setEndDate(today);
  }, []);
  useEffect(() => {
    if (filter === "daily") {
      const d = safeISO(singleDay) || toMidnight(new Date());
      const iso = formatDateISO(d);
      setStartDate(iso);
      setEndDate(iso);
    }

    if (filter === "weekly") {
      const d = safeISO(weekAnchor) || toMidnight(new Date());
      const from = startOfWeekMon(d);
      const to = endOfWeekMon(d);
      setStartDate(formatDateISO(from));
      setEndDate(formatDateISO(to));
    }

    if (filter === "monthly") {
      const [yy, mm] = (monthAnchor || "").split("-");
      const y = Number(yy) || new Date().getFullYear();
      const m = (Number(mm) || new Date().getMonth() + 1) - 1;

      const from = new Date(y, m, 1);
      const to = new Date(y, m + 1, 0);
      setStartDate(formatDateISO(from));
      setEndDate(formatDateISO(to));
    }
  }, [filter, singleDay, weekAnchor, monthAnchor]);

  const quickToday = () => {
    const today = formatDateISO(toMidnight(new Date()));
    setFilter("daily");
    setSingleDay(today);
  };

  const quickLast7 = () => {
    const today = toMidnight(new Date());
    setFilter("weekly");
    setWeekAnchor(formatDateISO(today));
  };

  const quickThisMonth = () => {
    const now = new Date();
    setFilter("monthly");
    setMonthAnchor(`${now.getFullYear()}-${pad2(now.getMonth() + 1)}`);
  };

  const stats = useMemo(() => {
    const safeTransactions = Array.isArray(transactions) ? transactions : [];

    const fromDate = safeISO(startDate);
    const toDate = safeISO(endDate);

    const filteredTransactions = safeTransactions.filter((t) => {
      const tx = safeISO(t.date);
      if (!tx) return false;

      const txMid = toMidnight(tx).getTime();

      if (fromDate) {
        const fromMid = toMidnight(fromDate).getTime();
        if (txMid < fromMid) return false;
      }

      if (toDate) {
        const toEnd = new Date(toDate);
        toEnd.setHours(23, 59, 59, 999);
        if (tx.getTime() > toEnd.getTime()) return false;
      }

      return true;
    });

    const salesByDate = filteredTransactions.reduce((acc, t) => {
      const key = t.date;
      acc[key] = (acc[key] || 0) + Number(t.totalPrice || 0);
      return acc;
    }, {});

    const lineChartData = Object.keys(salesByDate)
      .sort()
      .map((date) => ({ label: date, value: salesByDate[date] }));

    const totalSales = filteredTransactions.reduce(
      (sum, t) => sum + Number(t.totalPrice || 0),
      0
    );

    const totalProducts = filteredTransactions.reduce(
      (sum, t) => sum + Number(t.quantity || 0),
      0
    );

    const salesByCategory = filteredTransactions.reduce((acc, t) => {
      const cat = t.category || "unknown";
      acc[cat] = (acc[cat] || 0) + Number(t.totalPrice || 0);
      return acc;
    }, {});

    const pieChartData = Object.keys(salesByCategory).map((cat) => ({
      name: cat,
      value: salesByCategory[cat],
    }));

    const salesByProduct = filteredTransactions.reduce((acc, t) => {
      const name = t.itemName || "unknown";
      acc[name] = (acc[name] || 0) + Number(t.quantity || 0);
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
  }, [transactions, startDate, endDate]);

  const CATEGORY_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];

  return (
    <div className="animate-fade-in">
      <header className="page-header dashboard-header">
        <div className="dashboard-title">
          <h1>Dashboard</h1>
          <p className="range-text">
            Range: <b>{formatRangeLabel(startDate, endDate) || "—"}</b>
          </p>
        </div>

        <div className="dashboard-controls">
          <div className="date-card">
            <div className="date-card-top">
              <span className="date-card-label">DATE PICKER</span>

              <div className="quick-chips">
                <button type="button" className="chip" onClick={quickToday}>
                  Today
                </button>
                <button type="button" className="chip" onClick={quickLast7}>
                  Week
                </button>
                <button type="button" className="chip" onClick={quickThisMonth}>
                  Month
                </button>
              </div>
            </div>

            {filter === "daily" && (
              <div className="date-row">
                <label className="date-input-label">Select a day</label>
                <input
                  type="date"
                  value={singleDay}
                  onChange={(e) => setSingleDay(e.target.value)}
                  className="date-input"
                />
              </div>
            )}

            {filter === "weekly" && (
              <div className="date-row">
                <label className="date-input-label">Select any day (auto week)</label>
                <input
                  type="date"
                  value={weekAnchor}
                  onChange={(e) => setWeekAnchor(e.target.value)}
                  className="date-input"
                />
              </div>
            )}

            {filter === "monthly" && (
              <div className="date-row">
                <label className="date-input-label">Select a month</label>
                <input
                  type="month"
                  value={monthAnchor}
                  onChange={(e) => setMonthAnchor(e.target.value)}
                  className="date-input"
                />
              </div>
            )}

            <div className="date-helper">
              <span className="date-helper-muted">
                {filter === "daily" && "Day:"}
                {filter === "weekly" && "Week:"}
                {filter === "monthly" && "Month:"}
              </span>
              <b>{formatRangeLabel(startDate, endDate)}</b>
            </div>
          </div>

          <div className="segment">
            {["daily", "weekly", "monthly"].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setFilter(period)}
                className={`segment-btn ${filter === period ? "active" : ""}`}
              >
                {period}
              </button>
            ))}
          </div>
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
            <h3>TOTAL SALES</h3>
            <div className="stat-value">฿{Number(stats.totalSales || 0).toLocaleString()}</div>
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
            <h3>TOTAL PRODUCTS</h3>
            <div className="stat-value">{Number(stats.totalProducts || 0).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card">
          <h3>Sales Trends</h3>
          <CustomLineChart data={stats.lineChartData} />
        </div>
        <div className="card">
          <h3>Sales by Category</h3>
          <CustomDoughnut data={stats.pieChartData} colors={CATEGORY_COLORS} />
        </div>
      </div>

      <div className="card">
        <h3>Top 5 Selling Products</h3>
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

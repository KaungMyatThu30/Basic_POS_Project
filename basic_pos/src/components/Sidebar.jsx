import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => (
  <aside className="sidebar">
    <div className="brand">
      <svg
        className="svg-icon"
        style={{ width: 28, height: 28 }}
        viewBox="0 0 24 24"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
      POS
    </div>

    <nav className="nav-menu">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        <svg className="svg-icon" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        Overview
      </NavLink>

      <NavLink
        to="/journal"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        <svg className="svg-icon" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        Sales Journal
      </NavLink>
    </nav>
  </aside>
);

export default Sidebar;

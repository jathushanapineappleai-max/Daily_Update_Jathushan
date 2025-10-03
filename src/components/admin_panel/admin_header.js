import React from "react";
import { useMediaQuery } from "react-responsive";
import "../../styles/admin_panel/admin_header.css";

// Logo import
import pineappleLogo from "../../assets/images/pineappleAI_logo.png";

export default function AdminHeader({ onToggleSidebar }) {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className={`ap-header ${isMobile ? "mobile" : ""}`}>
      {isMobile ? (
        <div className="ap-header-mobile-row">
          {/* Hamburger toggle */}
          <button
            className="sidebar-toggle"
            onClick={onToggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>

          {/* Logo next to hamburger */}
          <div className="ap-header-logo">
            <img src={pineappleLogo} alt="Logo" />
            <h1 className="ap-header-logo-text">PineappleAI</h1>
          </div>

          {/* Header text pushed to right */}
          <div className="ap-header-text">
            <h1 className="ap-header-title">Welcome back, Admin</h1>
            <p className="ap-header-subtitle">Start your work with PineappleAI</p>
          </div>
        </div>
      ) : (
        <>
          <h1 className="ap-header-title">Welcome back, Admin</h1>
          <p className="ap-header-subtitle">Start your work with PineappleAI</p>
        </>
      )}
    </div>
  );
}
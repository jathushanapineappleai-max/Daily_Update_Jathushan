// AdminHeader.jsx
import React from "react";
import "../../styles/admin_panel/admin_header.css";

export default function AdminHeader() {
  return (
    <div className="ap-header">
      <h1 className="ap-header-title">Welcome back, Admin</h1>
      <p className="ap-header-subtitle">Start your work with PineappleAI</p>
    </div>
  );
}

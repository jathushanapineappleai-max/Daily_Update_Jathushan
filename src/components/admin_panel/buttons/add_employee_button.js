// AddEmployeeButton.jsx
import React from "react";
import "../../../styles/admin_panel/add_employee_button.css";

export default function AddEmployeeButton({ label, onClick }) {
  return (
    <button className="add_employee_button-btn" onClick={onClick}>
      {label}
    </button>
  );
}

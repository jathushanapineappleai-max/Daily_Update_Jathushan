import React from "react";
import "../../../styles/admin_panel/update_button.css";

export default function UpdateButton({ label = "Update", onClick }) {
  return (
    <button className="update_button-btn" onClick={onClick}>
      {label}
    </button>
  );
}

import React from "react";
import "../../../styles/admin_panel/summit_button.css";

export default function SummitButton({ label = "Submit", onClick }) {
  return (
    <button className="summit_button-btn" onClick={onClick}>
      {label}
    </button>
  );
}

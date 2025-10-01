import React from "react";
import "../../../styles/admin_panel/success.css";
import checkIcon from "../../../assets/icons/check_circle.png"; // ✅ PNG with check mark

export default function Popup({ title = "Success!", message = "Your action was successful." }) {
  return (
    <div className="popup">
      <div className="popup-icon">
        <img src={checkIcon} alt="success" className="check-circle-icon" />
      </div>

      <div className="popup-text">
        <div className="title">{title}</div>
        <div className="message">{message}</div>
      </div>

      <div className="popup-controls">
        {/* Optional buttons can go here */}
      </div>
    </div>
  );
}

import React from "react";
import "../../../styles/admin_panel/delete.css";
import cancelIcon from "../../../assets/icons/cancel.png"; // ✅ your red trash/cancel PNG

export default function DeletePopup({ title = "Deleted!", message = "The item has been deleted successfully." }) {
  return (
    <div className="popup delete">
      <div className="popup-icon">
        <img src={cancelIcon} alt="Delete Icon" className="delete-icon" />
      </div>
      <div className="popup-text">
        <div className="title">{title}</div>
        <div className="message">{message}</div>
      </div>
    </div>
  );
}

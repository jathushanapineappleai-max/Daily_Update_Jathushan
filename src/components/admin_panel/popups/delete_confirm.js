import React from "react";
import "../../../styles/admin_panel/delete_confirm.css";
import closeIcon from "../../../assets/icons/close.png"; // ✅ Make sure path is correct

export default function DeleteConfirmPopup({ onClose, onConfirm }) {
  return (
    <div className="delete-confirm-overlay">
      <div className="delete-confirm-popup">
        {/* ❌ Close Button */}
        <button className="delete-close-btn" onClick={onClose}>
          <img src={closeIcon} alt="Close" />
        </button>

        {/* 🧾 Text Section */}
        <div className="delete-text-container">
          <h2 className="delete-title">Do you want to delete?</h2>
          <p className="delete-desc">
            It permanently delete your record.
          </p>
        </div>

        {/* 🔘 Buttons */}
        <div className="delete-btn-group">
          <button className="cancel-btn" onClick={onClose}>
            No
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

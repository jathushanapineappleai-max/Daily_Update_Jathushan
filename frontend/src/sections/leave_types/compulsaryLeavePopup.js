import React, { useState } from "react";
import closeIcon from "../../assets/icons/Close.png";
import profile from "../../assets/icons/profile.png";
import proofIcon from "../../assets/icons/proof.png";
import "../../styles/compulsory_leave_popup.css";

export default function CompulsoryLeavePopup({ data, onClose }) {
  const [status, setStatus] = useState(data.status || "Pending");

  return (
    <div className="cl-popup-overlay">
      <div className="cl-popup-box">

        {/* Close Button */}
        <button className="cl-close-btn" onClick={onClose}>
          <img src={closeIcon} alt="close" />
        </button>

        {/* Profile */}
        <img src={profile} className="cl-profile-img" alt="profile" />
        <h2 className="cl-username">{data.employee}</h2>
        <p className="cl-role">UI/UX Engineer</p>

        {/* Content */}
        <div className="cl-content-box">

          {/* Leave Type + Date */}
          <div className="cl-row">
            <div>
              <label>Leave Type</label>
              <p className="cl-value">{data.type}</p>
            </div>

            <div>
              <label>Extended Working Date</label>
              <p className="cl-value">{data.extendedDate}</p>
            </div>
          </div>

          {/* Description */}
          <div className="cl-description-block">
            <label>Description</label>
            <p>{data.reason}</p>
          </div>

          {/* Proof Button – moved UP */}
          <div className="cl-proof-section">
            <button className="cl-proof-btn">
              <img src={proofIcon} alt="proof" />
              Proof Document
            </button>
          </div>

          {/* Status */}
          <label className="cl-status-title">Status</label>

          <div className="cl-status-box">

            <div className="cl-status-option" onClick={() => setStatus("Pending")}>
              Pending
              <span className={`cl-radio ${status === "Pending" ? "active pending" : ""}`}></span>
            </div>

            <div className="cl-status-divider"></div>

            <div className="cl-status-option" onClick={() => setStatus("Rejected")}>
              Rejected
              <span className={`cl-radio ${status === "Rejected" ? "active rejected" : ""}`}></span>
            </div>

            <div className="cl-status-divider"></div>

            <div className="cl-status-option" onClick={() => setStatus("Approved")}>
              Approved
              <span className={`cl-radio ${status === "Approved" ? "active approved" : ""}`}></span>
            </div>

          </div>
        </div>

        {/* Update Button */}
        <button className="cl-update-btn">Update</button>
      </div>
    </div>
  );
}
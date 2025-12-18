import React, { useState } from "react";
import closeIcon from "../../assets/icons/Close.png";
import profile from "../../assets/icons/profile.png";
import proofIcon from "../../assets/icons/proof.png";
import "../../styles/hour_permission_leave_popup.css";

export default function HourPermissionLeavePopup({ data, onClose }) {
  const [status, setStatus] = useState(data.status || "Pending");

  if (!data) return null;

  return (
    <div className="hp-popup-overlay">
      <div className="hp-popup-box">

        {/* Close */}
        <button className="hp-close-btn" onClick={onClose}>
          <img src={closeIcon} alt="close" />
        </button>

        {/* Profile */}
        <img src={data.image || profile} className="hp-profile-img" alt="profile" />

        <h2 className="hp-username">{data.employee}</h2>
        <p className="hp-role">UI/UX Engineer</p>

        {/* CONTENT BOX */}
        <div className="hp-content-box">

          {/* Leave Type + Date */}
          <div className="hp-row">
            <div>
              <label>Leave Type</label>
              <p className="hp-value">{data.type}</p>
            </div>

            <div>
              <label>Date</label>
              <p className="hp-value">{data.date}</p>
            </div>
          </div>

          {/* Start Time + End Time + Small Proof Button */}
          <div className="hp-row">
            <div>
              <label>Start Time</label>
              <p className="hp-value">{data.from}</p>
            </div>

            <div>
              <label>End Time</label>
              <p className="hp-value">{data.to}</p>
            </div>

            <button className="hp-proof-btn">
              <img src={proofIcon} alt="proof" />
              Proof Document
            </button>
          </div>

          {/* Description */}
          <div className="hp-description-block">
            <label>Description</label>
            <p>{data.reason}</p>
          </div>

          {/* Status */}
          <label className="hp-status-title">Status</label>

          <div className="hp-status-box">

            <div className="hp-status-option" onClick={() => setStatus("Pending")}>
              <span>Pending</span>
              <span className={`hp-radio pending ${status === "Pending" ? "active" : ""}`}></span>
            </div>

            <div className="hp-status-divider"></div>

            <div className="hp-status-option" onClick={() => setStatus("Rejected")}>
              <span>Rejected</span>
              <span className={`hp-radio rejected ${status === "Rejected" ? "active" : ""}`}></span>
            </div>

            <div className="hp-status-divider"></div>

            <div className="hp-status-option" onClick={() => setStatus("Approved")}>
              <span>Approved</span>
              <span className={`hp-radio approved ${status === "Approved" ? "active" : ""}`}></span>
            </div>

          </div>

        </div>

        {/* Update Button */}
        <button className="hp-update-btn">Update</button>
      </div>
    </div>
  );
}
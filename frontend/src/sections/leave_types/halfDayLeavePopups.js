import React, { useState } from "react";
import closeIcon from "../../assets/icons/Close.png";
import profile from "../../assets/icons/profile.png";
import proofIcon from "../../assets/icons/proof.png";
import "../../styles/halfDay_leave_popup.css";

export default function HalfDayLeavePopup({ data, onClose }) {
  const [status, setStatus] = useState(data.status || "Pending");

  if (!data) return null;

  return (
    <div className="hd-popup-overlay">
      <div className="hd-popup-box">

        <button className="hd-close-btn" onClick={onClose}>
          <img src={closeIcon} alt="close" />
        </button>

        <img src={profile} className="hd-profile-img" alt="profile" />

        <h2 className="hd-username">{data.employee}</h2>
        <p className="hd-role">UI/UX Engineer</p>

        <div className="hd-content-box">

          <div className="hd-row">
            <div>
              <label>Leave Type</label>
              <p className="hd-value">{data.type}</p>
            </div>

            <div>
              <label>Date</label>
              <p className="hd-value">{data.date}</p>
            </div>
          </div>

          <div className="hd-row">
            <div>
              <label>Start Time</label>
              <p className="hd-value">{data.from}</p>
            </div>

            <div className="hd-proof-section-inline">
              <button className="hd-proof-btn">
                <img src={proofIcon} alt="proof" />
                Proof Document
              </button>
            </div>
          </div>

          <div className="hd-description-block">
            <label>Description</label>
            <p>{data.reason}</p>
          </div>

          <label className="hd-status-title">Status</label>

          <div className="hd-status-box">

            <div className="hd-status-option" onClick={() => setStatus("Pending")}>
              Pending
              <span className={`hd-radio pending ${status === "Pending" ? "active" : ""}`}></span>
            </div>

            <div className="hd-status-divider"></div>

            <div className="hd-status-option" onClick={() => setStatus("Rejected")}>
              Rejected
              <span className={`hd-radio rejected ${status === "Rejected" ? "active" : ""}`}></span>
            </div>

            <div className="hd-status-divider"></div>

            <div className="hd-status-option" onClick={() => setStatus("Approved")}>
              Approved
              <span className={`hd-radio approved ${status === "Approved" ? "active" : ""}`}></span>
            </div>

          </div>
        </div>

        <button className="hd-update-btn">Update</button>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import closeIcon from "../../assets/icons/Close.png";
import profile from "../../assets/icons/profile.png";
import proofIcon from "../../assets/icons/proof.png";
import "../../styles/fullDay_leave_popup.css";

export default function FullDayLeavePopup({ data, onClose }) {
  const [selectedStatus, setSelectedStatus] = useState(data?.status || "Pending");

  if (!data) return null;

  return (
    <div className="fd-popup-overlay">
      <div className="fd-popup-box">

        {/* Close Button */}
        <button className="fd-close-btn" onClick={onClose}>
          <img src={closeIcon} alt="close" />
        </button>

        {/* Profile */}
        <img
          src={data.image || profile}
          alt="profile"
          className="fd-profile-img"
        />

        <h2 className="fd-username">{data.employee}</h2>
        <p className="fd-role">UI/UX Engineer</p>

        {/* CONTENT */}
        <div className="fd-content-box">

          <div className="fd-row">
            <div>
              <label>Leave Type</label>
              <p className="fd-value">{data.type}</p>
            </div>

            <div>
              <label>Date</label>
              <p className="fd-value">{data.from}</p>
            </div>
          </div>

          <div className="fd-row">
            <div>
              <label>Description</label>
              <p className="fd-value">{data.reason}</p>
            </div>

            <button className="fd-proof-btn">
              <img src={proofIcon} alt="" />
              Proof Document
            </button>
          </div>

          {/* STATUS */}
          <label className="fd-status-label">Status</label>

          <div className="fd-status-box">

            {/* PENDING */}
            <div className="fd-status-option">
              <span>Pending</span>

              <span
                className={`fd-radio pending ${
                  selectedStatus === "Pending" ? "active" : ""
                }`}
                onClick={() => setSelectedStatus("Pending")}
              ></span>
            </div>

            <div className="fd-status-divider"></div>

            {/* REJECTED */}
            <div className="fd-status-option">
              <span>Rejected</span>

              <span
                className={`fd-radio rejected ${
                  selectedStatus === "Rejected" ? "active" : ""
                }`}
                onClick={() => setSelectedStatus("Rejected")}
              ></span>
            </div>

            <div className="fd-status-divider"></div>

            {/* APPROVED */}
            <div className="fd-status-option">
              <span>Approved</span>

              <span
                className={`fd-radio approved ${
                  selectedStatus === "Approved" ? "active" : ""
                }`}
                onClick={() => setSelectedStatus("Approved")}
              ></span>
            </div>

          </div>
        </div>

        {/* Update Button */}
        <button className="fd-update-btn">Update</button>

      </div>
    </div>
  );
}
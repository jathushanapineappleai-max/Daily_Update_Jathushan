import React, { useState } from "react";
import closeIcon from "../../assets/icons/Close.png";
import profile from "../../assets/icons/profile.png";
import proofIcon from "../../assets/icons/proof.png";
import "../../styles/extended_leave_popup.css";

export default function ExtendedLeavePopup({ data, onClose }) {
  const [status, setStatus] = useState(data.status || "Pending");

  return (
    <div className="el-popup-overlay">
      <div className="el-popup-box">

        {/* CLOSE BUTTON */}
        <button className="el-close-btn" onClick={onClose}>
          <img src={closeIcon} alt="close" />
        </button>

        {/* PROFILE */}
        <img src={profile} className="el-profile-img" alt="profile" />
        <h2 className="el-username">{data.employee}</h2>
        <p className="el-role">UI/UX Engineer</p>

        {/* CARD */}
        <div className="el-content-box">

          <div className="el-row">
            <div>
              <label>Leave Type</label>
              <p className="el-value">{data.type}</p>
            </div>

            <div>
              <label>Start Date</label>
              <p className="el-value">{data.startDate}</p>
            </div>
          </div>

          <div className="el-row">
            <div>
              <label>End Date</label>
              <p className="el-value">{data.endDate}</p>
            </div>

            <button className="el-proof-btn">
              <img src={proofIcon} alt="proof" />
              Proof Document
            </button>
          </div>

          <div className="el-description-block">
            <label>Description</label>
            <p>{data.reason}</p>
          </div>

          {/* STATUS */}
          <label className="el-status-title">Status</label>
          <div className="el-status-box">

            {/* Pending */}
            <div className="el-status-option" onClick={() => setStatus("Pending")}>
              <span>Pending</span>
              <span
                className={`el-radio pending ${status === "Pending" ? "active" : ""}`}
              ></span>
            </div>

            <div className="el-status-divider"></div>

            {/* Rejected */}
            <div className="el-status-option" onClick={() => setStatus("Rejected")}>
              <span>Rejected</span>
              <span
                className={`el-radio rejected ${status === "Rejected" ? "active" : ""}`}
              ></span>
            </div>

            <div className="el-status-divider"></div>

            {/* Approved */}
            <div className="el-status-option" onClick={() => setStatus("Approved")}>
              <span>Approved</span>
              <span
                className={`el-radio approved ${status === "Approved" ? "active" : ""}`}
              ></span>
            </div>

          </div>
        </div>

        {/* UPDATE BUTTON */}
        <button className="el-update-btn">Update</button>
      </div>
    </div>
  );
}
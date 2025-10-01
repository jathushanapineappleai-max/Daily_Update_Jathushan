import React from "react";
import "../../../styles/admin_panel/download_cv.css";
import downloadIcon from "../../../assets/icons/download_fill.png"; // Make sure this path is correct

export default function DownloadCVButton({ label = "Download CV", onClick }) {
  return (
    <button className="download_cv-btn" onClick={onClick}>
      <span className="download_cv-text">{label}</span>
      <img src={downloadIcon} alt="download icon" className="download_cv-icon" />
    </button>
  );
}

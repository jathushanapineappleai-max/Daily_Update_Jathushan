
import React from "react";
import pplus from '../assets/icons/+icon.png';
import LeaveStats from '../sections/leaves/LeaveStats';
import LeaveCalendar from '../sections/leaves/LeaveCalendar';
import HolidayList from '../sections/leaves/HolidayList';
import "../styles/leaves.css";

/**
 * Small reusable Apply button component.
 * - label: button text
 * - onClick: handler
 */
const Apply = ({ onClick, label = "Apply" }) => {
  return (
    <button
      type="button"
      className="apply-btn"
      onClick={onClick}
      aria-label={label}
    >
      <span className="apply-icon">
        {/* alt="" because icon is decorative */}
        <img src={pplus} alt="" className="plus-icon" />
      </span>

      <span className="apply-btn-text">{label}</span>
    </button>
  );
};

export default function LeavesPage() {
  const handleApply = () => {
    alert("Apply button clicked");
  };

  return (
    <div className="page-container">
      <div className="leaves-top-section">
        <h1>Leaves</h1>
        <div className="leaves-actions">
          <Apply onClick={handleApply} label="Apply Leave" />
        </div>
      </div>

      <div className="leaves-content">
        <div className="leaves-left-section">
          <LeaveStats />
          <LeaveCalendar />
        </div>
        <HolidayList />
      </div>
    </div>
  );
}
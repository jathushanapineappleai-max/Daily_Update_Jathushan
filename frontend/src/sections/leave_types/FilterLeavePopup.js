import React, { useEffect, useRef } from "react";
import "../../styles/filter_leave_popup.css";

export default function FilterLeavePopup({ onClose }) {
  const boxRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div ref={boxRef} className="flt-card">

      {/* Leave Type */}
      <div className="flt-section">
        <p className="flt-title">Leave Type</p>

        <label className="flt-row">
          <input type="checkbox" /> <span>Full Day</span>
        </label>

        <label className="flt-row">
          <input type="checkbox" /> <span>Half Day</span>
        </label>

        <label className="flt-row">
          <input type="checkbox" /> <span>Hour Permission</span>
        </label>

        <label className="flt-row">
          <input type="checkbox" /> <span>Extended Leave</span>
        </label>

        <label className="flt-row">
          <input type="checkbox" /> <span>Compulsory Leave</span>
        </label>
      </div>

      {/* Status */}
      <div className="flt-section">
        <p className="flt-title">Status</p>

        <label className="flt-row">
          <input type="checkbox" /> <span>Pending</span>
        </label>

        <label className="flt-row">
          <input type="checkbox" /> <span>Approved</span>
        </label>

        <label className="flt-row">
          <input type="checkbox" /> <span>Rejected</span>
        </label>
      </div>

    </div>
  );
}
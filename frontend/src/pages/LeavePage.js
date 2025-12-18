import React, { useState, useEffect } from "react";
import "../styles/leave_management.css";

import actionIcon from "../assets/icons/action.png";
import searchIcon from "../assets/icons/search.png";
import mainfilterIcon from "../assets/icons/main_filter.png";
import subFilterIcon from "../assets/icons/subFilter.png";

/* POPUPS */
import FullDayLeavePopup from "../sections/leave_types/fullDayLeavePopups";
import HalfDayLeavePopup from "../sections/leave_types/halfDayLeavePopups";
import HoursPermissionLeavePopup from "../sections/leave_types/hourPermissionPopup";
import ExtendedLeavePopup from "../sections/leave_types/extendedLeavePopup";
import CompulsoryLeavePopup from "../sections/leave_types/compulsaryLeavePopup";

/* Filter dropdown */
import FilterLeavePopup from "../sections/leave_types/FilterLeavePopup";

/* Pagination (reusable component) */
import Pagination from "../components/Pagination";

export default function LeaveManagement() {
  const [activePeriod, setActivePeriod] = useState("today");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedLeave, setSelectedLeave] = useState(null);
  const [popupType, setPopupType] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  /* Pagination state */
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // adjust page size here if desired

  const leaves = [
    {
      id: 1,
      employee: "S. Sanjeevan",
      type: "Half Day",
      reason: "Casual",
      from: "7.00 A.M",
      to: "11.00 A.M",
      status: "Approved",
    },
    {
      id: 2,
      employee: "R. Ajay",
      type: "Hours Permission",
      reason: "Personal Work",
      from: "8.00 A.M",
      to: "10.00 A.M",
      status: "Approved",
    },
    {
      id: 3,
      employee: "V. Magesh",
      type: "Full Day",
      reason: "Casual",
      from: "01 Jan 2025",
      to: "01 Jan 2025",
      status: "Pending",
    },
    {
      id: 4,
      employee: "H. Vinoth",
      type: "Full Day",
      reason: "Sick",
      from: "21 Dec 2024",
      to: "21 Dec 2024",
      status: "Approved",
    },
    {
      id: 5,
      employee: "D. Divakar",
      type: "Half Day",
      reason: "Personal work",
      from: "12.00 P.M",
      to: "4.00 P.M",
      status: "Approved",
    },
    {
      id: 6,
      employee: "K. Keerthana",
      type: "Full Day",
      reason: "Sick",
      from: "01 Oct 2024",
      to: "01 Oct 2024",
      status: "Approved",
    },
    {
      id: 7,
      employee: "N. Nigarika",
      type: "Extended Leave",
      reason: "Wedding",
      from: "14 Aug 2024",
      to: "19 Aug 2024",
      status: "Rejected",
    },
    {
      id: 8,
      employee: "K. Kamal",
      type: "Half Day",
      reason: "Hospital",
      from: "7.00 A.M",
      to: "11.00 P.M",
      status: "Rejected",
    },
    {
      id: 9,
      employee: "M. Saravanan",
      type: "Hours Permission",
      reason: "Exam",
      from: "10.00 A.M",
      to: "11.00 A.M",
      status: "Rejected",
    },
  ];

  const handleActionClick = (leave) => {
    setSelectedLeave(leave);

    switch (leave.type) {
      case "Full Day":
        setPopupType("fullDay");
        break;
      case "Half Day":
        setPopupType("halfDay");
        break;
      case "Hours Permission":
        setPopupType("hours");
        break;
      case "Extended Leave":
        setPopupType("extended");
        break;
      case "Compulsory Leave":
        setPopupType("compulsory");
        break;
      default:
        setPopupType(null);
    }
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupType(null);
    setSelectedLeave(null);
  };

  const filteredLeaves = leaves.filter((l) => {
    const t = searchTerm.toLowerCase();
    return (
      l.employee.toLowerCase().includes(t) ||
      l.type.toLowerCase().includes(t) ||
      l.reason.toLowerCase().includes(t)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredLeaves.length / pageSize));

  // If the filter/search changes, reset current page to 1 to avoid empty page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activePeriod, /* add other filters when added */]);

  const onPageChange = (page) => {
    // clamp page into valid range
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
    // optionally scroll into view or do other UX touches here
  };

  // slice data for current page
  const startIdx = (currentPage - 1) * pageSize;
  const paginatedLeaves = filteredLeaves.slice(startIdx, startIdx + pageSize);

  return (
    <>
      {/* Main content is wrapped and blurred when showPopup === true */}
      <div className={`leave-wrapper ${showPopup ? "blurred" : ""}`}>
        {/* PERIOD TOGGLE */}
        <div className="leave-period-toggle">
          <button
            className={`period-btn ${
              activePeriod === "today" ? "active" : ""
            }`}
            onClick={() => setActivePeriod("today")}
          >
            Today
          </button>
          <button
            className={`period-btn ${
              activePeriod === "week" ? "active" : ""
            }`}
            onClick={() => setActivePeriod("week")}
          >
            Week
          </button>
        </div>

        {/* LEAVE REQUESTS HEADER */}
        <div className="leave-header">
          <h3>Leave Requests</h3>

          <div className="leave-tools">
            <div className="filter-wrapper">
              <button
                className="main-filter-btn"
                onClick={() => setShowFilterPopup(!showFilterPopup)}
              >
                <img src={mainfilterIcon} alt="Filter" />
              </button>
              {showFilterPopup && (
                <FilterLeavePopup onClose={() => setShowFilterPopup(false)} />
              )}
            </div>

            <div className="search-box">
              <img src={searchIcon} className="search-icon" alt="Search" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* DESKTOP TABLE + pagination wrapper */}
        <div className="leave-table-container">
          <div className="leave-table">
            <table>
              <thead>
                <tr>
                  <th>Employee Name</th>

                  <th>
                    <div className="header-with-icon">
                      Leave Type
                      <img src={subFilterIcon} alt="sort" />
                    </div>
                  </th>

                  <th>Reason</th>

                  <th>
                    <div className="header-with-icon">
                      Leave From
                      <img src={subFilterIcon} alt="sort" />
                    </div>
                  </th>

                  <th>
                    <div className="header-with-icon">
                      Leave To
                      <img src={subFilterIcon} alt="sort" />
                    </div>
                  </th>

                  <th>
                    <div className="header-with-icon">
                      Status
                      <img src={subFilterIcon} alt="sort" />
                    </div>
                  </th>

                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedLeaves.map((item) => (
                  <tr key={item.id}>
                    <td>{item.employee}</td>
                    <td>{item.type}</td>
                    <td>{item.reason}</td>
                    <td>{item.from}</td>
                    <td>{item.to}</td>
                    <td>
                      <span className={`status-tag ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => handleActionClick(item)}
                      >
                        <img src={actionIcon} alt="View" />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* show "no results" row if nothing to display */}
                {paginatedLeaves.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "24px" }}>
                      No leave requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination (bottom-right under the table) */}
          <div className="pagination-container">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>

        {/* MOBILE CARDS */}
        <div className="leave-cards">
          {paginatedLeaves.map((item) => (
            <div className="leave-card" key={item.id}>
              <div className="card-top">
                <h4>{item.employee}</h4>
                <button
                  className="card-action-btn"
                  onClick={() => handleActionClick(item)}
                >
                  <img src={actionIcon} alt="View" />
                </button>
              </div>

              <div className="card-row">
                <span>Type</span>
                <p>{item.type}</p>
              </div>
              <div className="card-row">
                <span>Reason</span>
                <p>{item.reason}</p>
              </div>
              <div className="card-row">
                <span>From</span>
                <p>{item.from}</p>
              </div>
              <div className="card-row">
                <span>To</span>
                <p>{item.to}</p>
              </div>

              <div className="card-row">
                <span>Status</span>
                <p className={`status-badge ${item.status.toLowerCase()}`}>
                  {item.status}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination for cards on mobile (kept the same pagination component) */}
        <div className="pagination-container pagination-container--mobile">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>

      {/* BACKDROP (covers viewport; click to close popup) */}
      <div
        className={`lmodal-backdrop ${showPopup ? "visible" : ""}`}
        onClick={closePopup}
      />

      {/* MODAL WRAPPER (popup is rendered here so it is not blurred) */}
      {showPopup && (
        <div className="lmodal" role="dialog" aria-modal="true">
          {popupType === "fullDay" && (
            <FullDayLeavePopup data={selectedLeave} onClose={closePopup} />
          )}
          {popupType === "halfDay" && (
            <HalfDayLeavePopup data={selectedLeave} onClose={closePopup} />
          )}
          {popupType === "hours" && (
            <HoursPermissionLeavePopup data={selectedLeave} onClose={closePopup} />
          )}
          {popupType === "extended" && (
            <ExtendedLeavePopup data={selectedLeave} onClose={closePopup} />
          )}
          {popupType === "compulsory" && (
            <CompulsoryLeavePopup data={selectedLeave} onClose={closePopup} />
          )}
        </div>
      )}
    </>
  );
}

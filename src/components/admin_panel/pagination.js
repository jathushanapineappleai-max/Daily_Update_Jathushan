import React from "react";
import "../../styles/admin_panel/pagination.css";

export default function Pagination({ currentStart, currentEnd, total, rowsPerPage }) {
  return (
    <div className="pagination-container">
      {/* Left info */}
      <div className="pagination-info">
        {currentStart} - {currentEnd} of {total}
      </div>

      {/* Rows per page */}
      <div className="pagination-rows">
        Rows per page: {rowsPerPage}
      </div>

      {/* Navigation arrows */}
      <div className="pagination-arrows">
        <button className="arrow-btn">&lt;</button>
        <button className="arrow-btn">&gt;</button>
      </div>
    </div>
  );
}

// pagination.js
import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import "../../styles/admin_panel/pagination.css";

// default icons (you already have these paths)
import defaultRight from "../../../src/assets/icons/rightArrow.png";
import defaultLeft from "../../../src/assets/icons/leftArrow.png";
import smallicon from "../../../src/assets/icons/Chevron Down.png";

function Pagination({
  currentPage,
  total,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100],
  leftIcon = defaultLeft,
  rightIcon = defaultRight,
  resetPageOnRowsChange = true,
  showRowsPerPage = true,
  showArrows = true,
  className = "",
  ariaLabel = "Pagination",
}) {
  // guard values
  const safeRowsPerPage = Math.max(1, Number(rowsPerPage) || rowsPerPageOptions[0]);
  const totalPages = Math.max(1, Math.ceil((Number(total) || 0) / safeRowsPerPage));

  // clamp current page when total or rowsPerPage changes
  useEffect(() => {
    if (typeof onPageChange !== "function") return;
    if (Number(total) === 0 && currentPage !== 1) {
      onPageChange(1);
      return;
    }
    if (currentPage > totalPages) {
      onPageChange(totalPages);
    }
    if (currentPage < 1) {
      onPageChange(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages, total, safeRowsPerPage]);

  const currentStart = useMemo(() => {
    if (!total || total === 0) return 0;
    return (currentPage - 1) * safeRowsPerPage + 1;
  }, [currentPage, safeRowsPerPage, total]);

  const currentEnd = useMemo(() => {
    if (!total || total === 0) return 0;
    return Math.min(currentPage * safeRowsPerPage, total);
  }, [currentPage, safeRowsPerPage, total]);

  const handlePrev = () => {
    if (currentPage > 1 && typeof onPageChange === "function") onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages && typeof onPageChange === "function") onPageChange(currentPage + 1);
  };

  const handleRowsChange = (e) => {
    const newSize = Number(e.target.value);
    if (typeof onRowsPerPageChange === "function") onRowsPerPageChange(newSize);
    if (resetPageOnRowsChange && typeof onPageChange === "function") onPageChange(1);
  };

  return (
    <div className={`pagination-container ${className}`} role="group" aria-label={ariaLabel}>
      <div className="pagination-info">
        {currentStart} - {currentEnd} of {total || 0}
      </div>

      <div className="pagination-controls">
        {showRowsPerPage && (
          <div className="pagination-rows">
            <span className="rows-label">Rows per page:</span>
            <select
              className="rows-select"
              value={safeRowsPerPage}
              onChange={handleRowsChange}
              aria-label="Rows per page"
              style={{
                backgroundImage: `url(${smallicon})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
                backgroundSize: "12px",
                paddingRight: "28px",
              }}
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {showArrows && (
          <div className="pagination-arrows">
            <button
              className="arrow-btn"
              onClick={handlePrev}
              disabled={currentPage === 1}
              aria-label="Previous page"
              type="button"
              onKeyDown={(e) => { if (e.key === "Enter") handlePrev(); }}
            >
              <img src={leftIcon} alt="Previous" className="arrow-icon" />
            </button>

            <button
              className="arrow-btn"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              type="button"
              onKeyDown={(e) => { if (e.key === "Enter") handleNext(); }}
            >
              <img src={rightIcon} alt="Next" className="arrow-icon" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  leftIcon: PropTypes.string,
  rightIcon: PropTypes.string,
  resetPageOnRowsChange: PropTypes.bool,
  showRowsPerPage: PropTypes.bool,
  showArrows: PropTypes.bool,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default React.memo(Pagination);
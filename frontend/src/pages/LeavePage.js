import React, { useState } from 'react';
import './Pages.css';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import SuccessModal from '../modals/SuccessModal';
import ErrorModal from '../modals/ErrorModal';

const LeavePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // placeholder total pages
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  return (
    <div className="page-container">
      <h1 className="page-title">Leave Management</h1>

      {/* Temporary: trigger success & error modals for testing */}
      <div className="d-flex align-items-center gap-2" style={{ marginBottom: 12 }}>
        <button type="button" className="btn btn-success" onClick={() => setShowSuccess(true)}>
          Test Success Modal
        </button>
        <button type="button" className="btn btn-outline-danger" onClick={() => setShowError(true)}>
          Test Error Modal
        </button>
      </div>

      <div className="placeholder-content">
        <SearchBar />
        <p>Leave requests and approvals will be displayed here</p>
      </div>

      {/* Pagination control */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        message="Leave request was submitted successfully."
        onClose={() => setShowSuccess(false)}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showError}
        message="Something went wrong while submitting leave request."
        onClose={() => setShowError(false)}
      />

      {/* The following SearchBar was previously placed; leaving it as-is for now */}
      <>
        <SearchBar />
      </>
    </div>
  );
};

export default LeavePage;

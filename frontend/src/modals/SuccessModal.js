import React from 'react';
import './SuccessModal.css';

const SuccessModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="success-modal-content">
        <div className="success-icon">✓</div>
        <h3>Success!</h3>
        <p>{message}</p>
        <button className="btn-ok" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default SuccessModal;


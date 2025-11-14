import React from 'react';
import './CheckoutConfirmModal.css';
import checkoutIcon from '../assets/icons/checkout_red.png';

const CheckoutConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="checkout-modal-overlay">
      <div className="checkout-modal">
        {/* Icon - PNG with circle already included */}
        <div className="checkout-modal-icon-group">
          <img src={checkoutIcon} alt="Checkout" className="checkout-modal-symbol" />
        </div>

        {/* Title */}
        <h2 className="checkout-modal-title">Are you sure you want to check out?</h2>

        {/* Confirm Button */}
        <button className="checkout-modal-btn checkout-modal-btn-confirm" onClick={onConfirm}>
          Yes
        </button>

        {/* Cancel Button */}
        <button className="checkout-modal-btn checkout-modal-btn-cancel" onClick={onCancel}>
          No
        </button>
      </div>
    </div>
  );
};

export default CheckoutConfirmModal;


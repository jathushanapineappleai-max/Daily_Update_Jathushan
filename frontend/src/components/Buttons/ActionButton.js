import React from 'react';
import './ActionButton.css';

const ActionButton = ({ children, onClick, variant = 'primary' }) => {
  return (
    <button className={`action-button ${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default ActionButton;


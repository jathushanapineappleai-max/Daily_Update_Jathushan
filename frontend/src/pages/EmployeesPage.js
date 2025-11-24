import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

const EmployeesPage = () => {
  const navigate = useNavigate();

  const handleAttendanceClick = () => {
    navigate('/attendance');
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Employees Management</h1>
      <div className="placeholder-content">
        <p>Employees list and management will be displayed here</p>
        <button className="page-link-button" onClick={handleAttendanceClick}>
          Attendance
        </button>
      </div>
    </div>
  );
};

export default EmployeesPage;


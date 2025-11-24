import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Pages.css';
import './EmployeesPage.css';

const EmployeesPage = () => {
  const navigate = useNavigate();

  const handleAttendanceClick = () => {
    navigate('/attendance');
  };

  return (
    <div className="page-container employees-page">
      <h1 className="page-title">Employees Management</h1>
      <div className="placeholder-content employees-page__card">
        <p>Employees list and management will be displayed here</p>
        <button className="employees-page__cta" onClick={handleAttendanceClick}>
          Attendance
        </button>
      </div>
    </div>
  );
};

export default EmployeesPage;


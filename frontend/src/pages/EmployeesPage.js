import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Pages.css';
import './EmployeesPage.css';

const EmployeesPage = () => {
  const navigate = useNavigate();

  const handleAttendanceClick = () => {
    navigate('/attendance');
  };

  // Temporary button → remove or replace later
  const handleOrgHierarchyClick = () => {
    navigate('/org-hierarchy');
  };

  return (
    <div className="page-container employees-page">
      <h1 className="page-title">Employees Management</h1>
      
      <div className="placeholder-content employees-page__card">
        <p>Employees list and management will be displayed here</p>
        
        {/* Existing button */}
        <button className="employees-page__cta" onClick={handleAttendanceClick}>
          Attendance
        </button>

        {/* Temporary button for Organizational Hierarchy */}
        <button
          className="employees-page__cta employees-page__cta--temp"
          onClick={handleOrgHierarchyClick}
          style={{ marginLeft: '10px', backgroundColor: '#6c757d' }} // optional visual distinction
        >
          Organizational Hierarchy (temp)
        </button>
      </div>
    </div>
  );
};

export default EmployeesPage;
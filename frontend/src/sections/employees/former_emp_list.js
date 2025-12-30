import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/former_emp_list.css";
import employeeAPI from "../../integration/employeeAPI"; // Import the employee API

import filter from "../../assets/icons/filterricon.png";
import search from "../../assets/icons/searchicon.png";
import greenicon from "../../assets/icons/editicon.png"; // Overview
import blueicon from "../../assets/icons/editblueicon.png"; // Edit
import tempp from "../../assets/icons/img.png";

const FormerEmpList = ({ page = 1, setTotalPages }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch terminated employees from the backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        // Fetch only terminated employees
        const response = await employeeAPI.getAllEmployees(
          page,
          10,
          "terminated"
        ); // 10 employees per page, only terminated

        if (response.success) {
          // Transform the backend response to match the frontend format
          const transformedEmployees = response.data.employees.map((emp) => ({
            id: emp.id, // Use the actual database user ID
            empId: emp.emp_id, // Store emp_id separately
            name: `${emp.first_name} ${emp.last_name || ""}`.trim(),
            designation: emp.designation || "-",
            role: emp.role || "-",
            mgmtRole: emp.management_role || "-",
            avatar: emp.EmployeeDetail?.image_path
              ? `${process.env.REACT_APP_API_BASE_URL?.replace("/api", "")}${
                  emp.EmployeeDetail.image_path
                }`
              : tempp,
          }));

          setEmployees(transformedEmployees);

          // Update total pages if provided
          if (setTotalPages && response.data.pagination) {
            setTotalPages(response.data.pagination.pages);
          }
        } else {
          setError(response.message || "Failed to fetch employees");
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("An error occurred while fetching employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [page, setTotalPages, location.state?.refresh]); // Add location.state.refresh as a dependency

  // 🔥 Navigate to Employee Overview (GREEN button)
  const openOverview = (empId) => {
    navigate(`/employees/${empId}/overview`);
  };

  // 🔥 Navigate to Edit Employee (BLUE button)
  const openEdit = (empId) => {
    navigate(`/employees/${empId}/edit`);
  };

  if (loading) {
    return (
      <div className="fsection">
        <div className="header-box">
          <div className="title-section">
            <h2>Former Employee</h2>
          </div>
          <div className="controls">
            <img src={filter} alt="Filter" className="filter-icon" />
            <div className="search-bar">
              <img src={search} alt="Search" className="search-icon" />
              <input type="text" placeholder="Search" disabled />
            </div>
          </div>
        </div>
        <div className="loading">Loading former employees...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fsection">
        <div className="header-box">
          <div className="title-section">
            <h2>Former Employee</h2>
          </div>
        </div>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="fsection">
      <div className="header-box">
        <div className="title-section">
          <h2>Former Employee</h2>
        </div>
        <div className="controls">
          <img src={filter} alt="Filter" className="filter-icon" />
          <div className="search-bar">
            <img src={search} alt="Search" className="search-icon" />
            <input type="text" placeholder="Search" />
          </div>
        </div>
      </div>
      <table className="form-table">
        <thead>
          <tr>
            <th>Emp ID</th>
            <th>Employee Name</th>
            <th>Designation</th>
            <th>Role</th>
            <th>Management Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>
                <span
                  className="id-circle"
                  style={{ backgroundColor: emp.idColor }}
                >
                  {emp.empId}
                </span>
              </td>
              <td>
                <img src={emp.avatar} alt={emp.name} className="avatar" />
                {emp.name}
              </td>
              <td>{emp.designation}</td>
              <td>{emp.role}</td>
              <td>{emp.mgmtRole}</td>
              <td>
                {/* 🟢 GREEN button = Overview */}
                <button
                  className="action-btn"
                  onClick={() => openOverview(emp.id)}
                >
                  <img src={greenicon} alt="View Overview" />
                </button>
                {/* 🔵 BLUE button = Edit Employee */}
                <button className="action-btn" onClick={() => openEdit(emp.id)}>
                  <img src={blueicon} alt="Edit Employee" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormerEmpList;
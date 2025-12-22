import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/former_emp_list.css";
import filter from "../../assets/icons/filterricon.png";
import search from "../../assets/icons/searchicon.png";
import greenicon from "../../assets/icons/editicon.png";       // Overview
import blueicon from "../../assets/icons/editblueicon.png";   // Edit
import tempp from "../../assets/icons/img.png";

const FormerEmpList = () => {
  const navigate = useNavigate();
  
  const employees = [
    {
      id: "01",
      name: "Y. Kishana",
      designation: "Full Stack Engineer",
      role: "Team Lead",
      mgmtRole: "Software Development",
      avatar: tempp, // Placeholder for female avatar; replace with actual path
      
    },
    {
      id: "02",
      name: "Y. Kishana",
      designation: "UI/UX Engineer",
      role: "Team Lead",
      mgmtRole: "UI/UX Design",
      avatar: tempp,
      
    },
    {
      id: "03",
      name: "Y. Kishana",
      designation: "QA Engineer",
      role: "Associate",
      mgmtRole: "Quality Assurance (QA)",
      avatar: tempp,
      
    },
    {
      id: "04",
      name: "S. Sanjeevan",
      designation: "Mobile App Developer",
      role: "Intern",
      mgmtRole: "Software Development",
      avatar: tempp,
     
    },
    {
      id: "05",
      name: "S. Sanjeevan",
      designation: "Back end Developer",
      role: "Senior",
      mgmtRole: "Software Development",
      avatar: tempp,
      
    },
    {
      id: "06",
      name: "S. Sanjeevan",
      designation: "UI/UX Engineer",
      role: "Intern",
      mgmtRole: "UI/UX Design",
      avatar: tempp,
      
    },
  ];

  // 🔥 Navigate to Employee Overview (GREEN button)
  const openOverview = (empId) => {
    navigate(`/employees/${empId}/overview`);
  };

  // 🔥 Navigate to Edit Employee (BLUE button)
  const openEdit = (empId) => {
    navigate(`/employees/${empId}/edit`);
  };

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
                <span className="id-circle" style={{ backgroundColor: emp.idColor }}>
                  {emp.id}
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
                <button className="action-btn" onClick={() => openOverview(emp.id)}>
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
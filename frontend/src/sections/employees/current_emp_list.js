// // current_emp_list.js (updated: unique class names prefixed with cemp-)
// import React from "react";
// import "../../styles/current_emp_list.css";
// import filter from "../../assets/icons/filterricon.png";
// import search from "../../assets/icons/searchicon.png";
// import greenicon from "../../assets/icons/editicon.png"; // green icon
// import blueicon from "../../assets/icons/editblueicon.png"; // blue icon
// import tempimg from "../../assets/icons/img.png";

// const CurrentEmpList = () => {
//   const employees = [
//     {
//       id: "01",
//       name: "Y. Kishana",
//       designation: "Full Stack Engineer",
//       role: "Team Lead",
//       mgmtRole: "-",
//       manager: "S. Sanjeevan",
//       avatar: tempimg,
//       managerAvatar: tempimg,
//     },
//     {
//       id: "02",
//       name: "A. Nimal",
//       designation: "UI/UX Engineer",
//       role: "Team Lead",
//       mgmtRole: "-",
//       manager: "S. Sanjeevan",
//       avatar: tempimg,
//       managerAvatar: tempimg,
//     },
//     {
//       id: "03",
//       name: "B. Perera",
//       designation: "QA Engineer",
//       role: "Associate",
//       mgmtRole: "COO",
//       manager: "S. Sanjeevan",
//       avatar: tempimg,
//       managerAvatar: tempimg,
//     },
//     {
//       id: "04",
//       name: "S. Sanjeevan",
//       designation: "Mobile App Developer",
//       role: "Intern",
//       mgmtRole: "CHRO",
//       manager: "S. Sanjeevan",
//       avatar: tempimg,
//       managerAvatar: tempimg,
//     },
//     {
//       id: "05",
//       name: "R. Fernando",
//       designation: "Back end Developer",
//       role: "Senior",
//       mgmtRole: "-",
//       manager: "S. Sanjeevan",
//       avatar: tempimg,
//       managerAvatar: tempimg,
//     },
//     {
//       id: "06",
//       name: "K. Silva",
//       designation: "UI/UX Engineer",
//       role: "Intern",
//       mgmtRole: "-",
//       manager: "S. Sanjeevan",
//       avatar: tempimg,
//       managerAvatar: tempimg,
//     },
//   ];

//   return (
//     <div className="cemp-section">
//       <div className="cemp-header-box">
//         <div className="cemp-title-section">
//           <h2>Current Employee</h2>
//           {/* show count dynamically so it's always correct */}
//           <p>{employees.length} of 30 employees available</p>
//         </div>

//         <div className="cemp-controls">
//           <img src={filter} alt="Filter" className="cemp-filter-icon" />
//           <div className="cemp-search-bar">
//             <img src={search} alt="Search" className="cemp-search-icon" />
//             <input type="text" placeholder="Search" />
//           </div>
//         </div>
//       </div>

//       <table className="cemp-form-table">
//         <thead>
//           <tr>
//             <th>Emp ID</th>
//             <th>Employee Name</th>
//             <th>Designation</th>
//             <th>Role</th>
//             <th>Management Role</th>
//             <th>Reporting Manager</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {employees.map((emp) => (
//             <tr key={emp.id}>
//               <td>
//                 <span
//                  // className="cemp-id-circle"
//                 //  style={{ backgroundColor: emp.idColor || "#777" }}
//                 >
//                   {emp.id}
//                 </span>
//               </td>

//               <td>
//                 {/* avatar is decorative because name text is shown next to it;
//                     so make alt="" and aria-hidden so screen readers do not double announce */}
//                 <span className="cemp-name-cell">
//                   <img
//                     src={emp.avatar}
//                     alt=""
//                     aria-hidden="true"
//                     className="cemp-avatar"
//                   />
//                   <span className="cemp-name-text">{emp.name}</span>
//                 </span>
//               </td>

//               <td>{emp.designation}</td>
//               <td>{emp.role}</td>
//               <td>{emp.mgmtRole}</td>

//               <td>
//                 <span className="cemp-manager-cell">
//                   <img
//                     src={emp.managerAvatar}
//                     alt=""
//                     aria-hidden="true"
//                     className="cemp-avatar"
//                   />
//                   <span className="cemp-manager-text">{emp.manager}</span>
//                 </span>
//               </td>

//               <td>
//                 <button className="cemp-action-btn" aria-label="green action">
//                   <img src={greenicon} alt="Green Action" />
//                 </button>

//                 <button className="cemp-action-btn" aria-label="blue action">
//                   <img src={blueicon} alt="Blue Action" />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // export default CurrentEmpList;
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "../../styles/current_emp_list.css";

// import filter from "../../assets/icons/filterricon.png";
// import search from "../../assets/icons/searchicon.png";
// import greenicon from "../../assets/icons/editicon.png";
// import blueicon from "../../assets/icons/editblueicon.png";
// import tempimg from "../../assets/icons/img.png";

// const CurrentEmpList = () => {
//   const navigate = useNavigate();

//   const employees = [
//     {
//       id: "01",
//       name: "Y. Kishana",
//       designation: "Full Stack Engineer",
//       role: "Team Lead",
//       mgmtRole: "-",
//       manager: "S. Sanjeevan",
//       avatar: tempimg,
//       managerAvatar: tempimg,
//     },
//     {
//       id: "02",
//       name: "A. Nimal",
//       designation: "UI/UX Engineer",
//       role: "Team Lead",
//       mgmtRole: "-",
//       manager: "S. Sanjeevan",
//       avatar: tempimg,
//       managerAvatar: tempimg,
//     },
//     {
//       id: "03",
//       name: "B. Perera",
//       designation: "QA Engineer",
//       role: "Associate",
//       mgmtRole: "COO",
//       manager: "S. Sanjeevan",
//       avatar: tempimg,
//       managerAvatar: tempimg,
//     },
//     {
//       id: "04",
//       name: "S. Sanjeevan",
//       designation: "Mobile App Developer",
//       role: "Intern",
//       mgmtRole: "CHRO",
//       manager: "S. Sanjeevan",
//       avatar: tempimg,
//       managerAvatar: tempimg,
//     },
//   ];

//   // 🔥 Function to navigate to Employee Overview
//   const openOverview = (empId) => {
//     navigate(`/employees/${empId}/overview`);
//   };

//   return (
//     <div className="cemp-section">
//       <div className="cemp-header-box">
//         <div className="cemp-title-section">
//           <h2>Current Employee</h2>
//           <p>{employees.length} of 30 employees available</p>
//         </div>

//         <div className="cemp-controls">
//           <img src={filter} alt="Filter" className="cemp-filter-icon" />
//           <div className="cemp-search-bar">
//             <img src={search} alt="Search" className="cemp-search-icon" />
//             <input type="text" placeholder="Search" />
//           </div>
//         </div>
//       </div>

//       <table className="cemp-form-table">
//         <thead>
//           <tr>
//             <th>Emp ID</th>
//             <th>Employee Name</th>
//             <th>Designation</th>
//             <th>Role</th>
//             <th>Management Role</th>
//             <th>Reporting Manager</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {employees.map((emp) => (
//             <tr key={emp.id}>
//               <td>{emp.id}</td>

//               <td>
//                 <span className="cemp-name-cell">
//                   <img src={emp.avatar} alt="" aria-hidden="true" className="cemp-avatar" />
//                   <span className="cemp-name-text">{emp.name}</span>
//                 </span>
//               </td>

//               <td>{emp.designation}</td>
//               <td>{emp.role}</td>
//               <td>{emp.mgmtRole}</td>

//               <td>
//                 <span className="cemp-manager-cell">
//                   <img src={emp.managerAvatar} alt="" aria-hidden="true" className="cemp-avatar" />
//                   <span className="cemp-manager-text">{emp.manager}</span>
//                 </span>
//               </td>

//               <td>
//                 <button className="cemp-action-btn">
//                   <img src={greenicon} alt="Green Action" />
//                 </button>

//                 {/* 🔥 This button opens EmployeeOverview */}
//                 <button
//                   className="cemp-action-btn"
//                   onClick={() => openOverview(emp.id)}
//                 >
//                   <img src={blueicon} alt="Blue Action" />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CurrentEmpList;



import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/current_emp_list.css";

import filter from "../../assets/icons/filterricon.png";
import search from "../../assets/icons/searchicon.png";
import greenicon from "../../assets/icons/editicon.png";       // Edit employee
import blueicon from "../../assets/icons/editblueicon.png";   // Overview
import tempimg from "../../assets/icons/img.png";

const CurrentEmpList = () => {
  const navigate = useNavigate();

  const employees = [
    {
      id: "01",
      name: "Y. Kishana",
      designation: "Full Stack Engineer",
      role: "Team Lead",
      mgmtRole: "-",
      manager: "S. Sanjeevan",
      avatar: tempimg,
      managerAvatar: tempimg,
    },
    {
      id: "02",
      name: "A. Nimal",
      designation: "UI/UX Engineer",
      role: "Team Lead",
      mgmtRole: "-",
      manager: "S. Sanjeevan",
      avatar: tempimg,
      managerAvatar: tempimg,
    },
    {
      id: "03",
      name: "B. Perera",
      designation: "QA Engineer",
      role: "Associate",
      mgmtRole: "COO",
      manager: "S. Sanjeevan",
      avatar: tempimg,
      managerAvatar: tempimg,
    },
    {
      id: "04",
      name: "S. Sanjeevan",
      designation: "Mobile App Developer",
      role: "Intern",
      mgmtRole: "CHRO",
      manager: "S. Sanjeevan",
      avatar: tempimg,
      managerAvatar: tempimg,
    },
  ];

  // 🔥 Navigate to Employee Overview
  const openOverview = (empId) => {
    navigate(`/employees/${empId}/overview`);
  };

  // 🔥 Navigate to Edit Employee
  const openEdit = (empId) => {
    navigate(`/employees/${empId}/edit`);
  };

  return (
    <div className="cemp-section">
      {/* Header Box */}
      <div className="cemp-header-box">
        <div className="cemp-title-section">
          <h2>Current Employee</h2>
          <p>{employees.length} of 30 employees available</p>
        </div>

        <div className="cemp-controls">
          <img src={filter} alt="Filter" className="cemp-filter-icon" />
          <div className="cemp-search-bar">
            <img src={search} alt="Search" className="cemp-search-icon" />
            <input type="text" placeholder="Search" />
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="cemp-form-table">
        <thead>
          <tr>
            <th>Emp ID</th>
            <th>Employee Name</th>
            <th>Designation</th>
            <th>Role</th>
            <th>Management Role</th>
            <th>Reporting Manager</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>

              <td>
                <span className="cemp-name-cell">
                  <img
                    src={emp.avatar}
                    alt=""
                    aria-hidden="true"
                    className="cemp-avatar"
                  />
                  <span className="cemp-name-text">{emp.name}</span>
                </span>
              </td>

              <td>{emp.designation}</td>
              <td>{emp.role}</td>
              <td>{emp.mgmtRole}</td>

              <td>
                <span className="cemp-manager-cell">
                  <img
                    src={emp.managerAvatar}
                    alt=""
                    aria-hidden="true"
                    className="cemp-avatar"
                  />
                  <span className="cemp-manager-text">{emp.manager}</span>
                </span>
              </td>

              {/* ACTION BUTTONS */}
              <td>
                {/* 🟢 GREEN button = Edit Employee */}
                <button
                  className="cemp-action-btn"
                  onClick={() => openEdit(emp.id)}
                >
                  <img src={greenicon} alt="Edit Employee" />
                </button>

                {/* 🔵 BLUE button = Overview */}
                <button
                  className="cemp-action-btn"
                  onClick={() => openOverview(emp.id)}
                >
                  <img src={blueicon} alt="View Overview" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CurrentEmpList;

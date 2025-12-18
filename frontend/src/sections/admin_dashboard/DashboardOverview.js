import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/DashboardOverview.css';

// Import profile images
import lakshanImg from '../../assets/images/lakshan.png';
import nivethigaImg from '../../assets/images/nivethiga.png';
import nayananImg from '../../assets/images/nayanan.png';
import niroshanImg from '../../assets/images/niroshan.png';
import sanjeevanImg from '../../assets/images/sanjeevan.png';
import defaultImg from '../../assets/images/default_profile.png';
import pineappleImg from '../../assets/images/pineappleai.png';

export default function DashboardOverview() {
  const navigate = useNavigate();
  
  const employees = [
    {
      id: 1,
      name: 'Leasie Watson',
      designation: 'Team Lead - Design',
      checkInLocation: 'Office',
      checkOutTime: '09:27 AM',
      status: 'On Time',
      avatar: lakshanImg
    },
    {
      id: 2,
      name: 'Darlene Robertson',
      designation: 'Web Designer',
      checkInLocation: 'Office',
      checkOutTime: '10:15 AM',
      status: 'Late',
      avatar: nivethigaImg
    },
    {
      id: 3,
      name: 'Jacob Jones',
      designation: 'Medical Assistant',
      checkInLocation: 'Remote',
      checkOutTime: '10:24 AM',
      status: 'Late',
      avatar: nayananImg
    },
    {
      id: 4,
      name: 'Kathryn Murphy',
      designation: 'Marketing Coordinator',
      checkInLocation: 'Office',
      checkOutTime: '09:10 AM',
      status: 'On Time',
      avatar: niroshanImg
    },
    {
      id: 5,
      name: 'Leslie Alexander',
      designation: 'Data Analyst',
      checkInLocation: 'Office',
      checkOutTime: '09:15 AM',
      status: 'On Time',
      avatar: sanjeevanImg
    },
    {
      id: 6,
      name: 'Ronald Richards',
      designation: 'Python Developer',
      checkInLocation: 'Remote',
      checkOutTime: '09:29 AM',
      status: 'On Time',
      avatar: defaultImg
    },
    {
      id: 7,
      name: 'Jenny Wilson',
      designation: 'React JS Developer',
      checkInLocation: 'Remote',
      checkOutTime: '11:30 AM',
      status: 'Late',
      avatar: pineappleImg
    },
  ];

  const handleViewAll = () => {
    navigate('/attendance');
  };

  return (
    <section className="attendance-section" aria-labelledby="attendance-title">
      <div className="attendance-header">
        <h2 id="attendance-title" className="attendance-title">
          Attendance Overview
        </h2>

        <button
          type="button"
          className="view-all-button"
          aria-label="View all attendance"
          onClick={handleViewAll}
        >
          View All
        </button>
      </div>

      {/* Desktop Table */}
      <div
        className="attendance-table-wrapper"
        role="region"
        aria-labelledby="attendance-title"
        aria-label="Attendance table"
      >
        <table className="attendance-table" role="table" aria-label="Attendance">
          <thead>
            <tr>
              <th className="col-employee">Employee Name</th>
              <th className="col-designation">Designation</th>
              <th className="col-checkin">Check In</th>
              <th className="col-checkout">Check Out</th>
              <th className="col-status">Status</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="attendance-row">
                <td className="employee-cell">
                  <div className="employee-info">
                    <img 
                      src={emp.avatar} 
                      alt="" 
                      aria-hidden="true" 
                      className="avatar" 
                    />
                    <div className="employee-name" title={emp.name}>
                      {emp.name}
                    </div>
                  </div>
                </td>

                <td className="designation-cell" title={emp.designation}>
                  {emp.designation}
                </td>

                <td className="checkin-cell">{emp.checkInLocation}</td>
                <td className="checkout-cell">{emp.checkOutTime}</td>

                <td className="status-cell">
                  <span
                    className={`status-badge ${
                      emp.status.toLowerCase().includes('late') ? 'late' : 'on-time'
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="attendance-cards">
        {employees.map((emp) => (
          <div className="attendance-card" key={emp.id}>
            <div className="card-detail">
              <div className="employee-header">
                <img 
                  src={emp.avatar} 
                  alt="" 
                  aria-hidden="true" 
                  className="avatar" 
                />
                <span className="employee-name">{emp.name}</span>
              </div>
            </div>

            <div className="card-detail">
              <span className="card-label">Designation</span>
              <div className="card-value">{emp.designation}</div>
            </div>
            
            <div className="card-detail">
              <span className="card-label">Check In</span>
              <div className="card-value">{emp.checkInLocation}</div>
            </div>
            
            <div className="card-detail">
              <span className="card-label">Check Out</span>
              <div className="card-value">{emp.checkOutTime}</div>
            </div>
            
            <div className="card-detail">
              <span className="card-label">Status</span>
              <div className="card-value">
                <span
                  className={`status-badge ${
                    emp.status.toLowerCase().includes('late') ? 'late' : 'on-time'
                  }`}
                >
                  {emp.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
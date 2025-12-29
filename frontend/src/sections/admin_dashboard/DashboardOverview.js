import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllAttendanceRecords } from '../../integration/attendanceAPI';
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
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        const response = await fetchAllAttendanceRecords(1, 7); // Get 7 most recent records
        
        // Transform the attendance data to match the expected format
        const transformedData = response.data.attendance_records.map((record, index) => {
          const user = record.User || {};
          const clockInTime = record.clock_in ? new Date(record.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';
          const clockOutTime = record.clock_out ? new Date(record.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';
          
          return {
            id: record.id,
            name: `${user.first_name || 'N/A'} ${user.last_name || ''}`.trim() || 'Unknown Employee',
            designation: user.designation || 'N/A',
            checkInTime: clockInTime, // Actual check-in time
            checkOutTime: clockOutTime,
            status: record.status === 'on_time' ? 'On Time' : record.status === 'late' ? 'Late' : record.status,
            avatar: [lakshanImg, nivethigaImg, nayananImg, niroshanImg, sanjeevanImg, defaultImg, pineappleImg][index % 7] || defaultImg
          };
        });
        
        setEmployees(transformedData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching attendance data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendanceData();
  }, []);

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

      {loading && (
        <div className="loading-container" style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading attendance data...</p>
        </div>
      )}

      {error && (
        <div className="error-container" style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          <p>Error loading attendance data: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
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

                    <td className="checkin-cell">{emp.checkInTime}</td>
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
                  <div className="card-value">{emp.checkInTime}</div>
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
        </>
      )}
    </section>
  );
}
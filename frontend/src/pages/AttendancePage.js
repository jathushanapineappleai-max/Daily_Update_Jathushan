import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import backIcon from '../assets/icons/title_back.png';
import './Pages.css';
import './AttendancePage.css';

const AttendancePage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const attendanceData = useMemo(
    () => [
      { date: '22 Nov 2025', checkIn: '09:00 AM', checkOut: '06:00 PM', break: '00:45', workingHours: '08:15', status: 'Present' },
      { date: '21 Nov 2025', checkIn: '09:05 AM', checkOut: '05:55 PM', break: '00:30', workingHours: '08:20', status: 'Present' },
      { date: '20 Nov 2025', checkIn: '08:58 AM', checkOut: '06:10 PM', break: '00:40', workingHours: '08:32', status: 'Present' },
      { date: '19 Nov 2025', checkIn: '09:12 AM', checkOut: '06:05 PM', break: '00:50', workingHours: '07:58', status: 'Late' },
      { date: '18 Nov 2025', checkIn: '09:01 AM', checkOut: '05:45 PM', break: '00:35', workingHours: '08:09', status: 'Present' },
      { date: '17 Nov 2025', checkIn: '09:20 AM', checkOut: '06:15 PM', break: '00:30', workingHours: '08:25', status: 'Late' },
      { date: '16 Nov 2025', checkIn: '09:00 AM', checkOut: '06:00 PM', break: '00:45', workingHours: '08:15', status: 'Present' },
      { date: '15 Nov 2025', checkIn: '—', checkOut: '—', break: '—', workingHours: '—', status: 'Leave' },
      { date: '14 Nov 2025', checkIn: '08:45 AM', checkOut: '05:50 PM', break: '00:35', workingHours: '08:30', status: 'Present' },
      { date: '13 Nov 2025', checkIn: '09:30 AM', checkOut: '06:20 PM', break: '00:40', workingHours: '07:50', status: 'Late' },
    ],
    []
  );

  const totalPages = Math.max(1, Math.ceil(attendanceData.length / pageSize));

  const currentRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return attendanceData.slice(start, start + pageSize);
  }, [attendanceData, currentPage]);

  return (
    <div className="page-container attendance-page">
      <div className="attendance-header-card">
        <button className="attendance-back-button" onClick={handleBack} aria-label="Go back">
          <img src={backIcon} alt="Back" />
        </button>
        <h1 className="attendance-header-title">Attendance</h1>
      </div>

      <div className="attendance-table-wrapper">
        <div className="attendance-table">
          <div className="attendance-table-header">
            <div className="attendance-table-header-cell">
              <span>Date</span>
              <span className="attendance-table-sort-icon" aria-hidden="true">
                <span />
                <span />
              </span>
            </div>
            <div className="attendance-table-header-cell">Check In</div>
            <div className="attendance-table-header-cell">Check Out</div>
            <div className="attendance-table-header-cell">Break</div>
            <div className="attendance-table-header-cell">Working Hours</div>
            <div className="attendance-table-header-cell">Status</div>
          </div>

          <div className="attendance-table-body">
            {currentRows.map((row, index) => (
              <div className="attendance-table-row" key={row.date + index}>
                <div className="attendance-table-cell attendance-table-cell--date">{row.date}</div>
                <div className="attendance-table-cell">{row.checkIn}</div>
                <div className="attendance-table-cell">{row.checkOut}</div>
                <div className="attendance-table-cell">{row.break}</div>
                <div className="attendance-table-cell">{row.workingHours}</div>
                <div className="attendance-table-cell attendance-table-cell--status">
                  <span className={`attendance-status attendance-status--${row.status.toLowerCase()}`}>
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="attendance-card-list">
        {currentRows.map((row, index) => (
          <div className="attendance-card" key={`card-${row.date}-${index}`}>
            <div className="attendance-card-header">
              <span className="attendance-card-date">{row.date}</span>
              <span className={`attendance-status attendance-status--${row.status.toLowerCase()}`}>
                {row.status}
              </span>
            </div>
            <div className="attendance-card-body">
              <div className="attendance-card-field">
                <p>Check In</p>
                <strong>{row.checkIn}</strong>
              </div>
              <div className="attendance-card-field">
                <p>Check Out</p>
                <strong>{row.checkOut}</strong>
              </div>
              <div className="attendance-card-field">
                <p>Break</p>
                <strong>{row.break}</strong>
              </div>
              <div className="attendance-card-field">
                <p>Working Hours</p>
                <strong>{row.workingHours}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="attendance-pagination">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default AttendancePage;


import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import arrowLeft from '../../assets/icons/arrow_left.png';
import './LeaveCalendar.css';

// Mobile calendar component
function MobileCalendar({ date, setDate, leaveData, getLeaveStatus }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    setDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthYear = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="mobile-calendar">
      <div className="mobile-calendar-header">
        <button className="mobile-nav-btn" onClick={handlePrevMonth}>
          <img src={arrowLeft} alt="Previous" />
        </button>
        <div className="mobile-month-year">{monthYear}</div>
        <button className="mobile-nav-btn" onClick={handleNextMonth}>
          <img src={arrowLeft} alt="Next" className="arrow-right" />
        </button>
      </div>

      <div className="mobile-weekdays">
        <div className="mobile-weekday">Sun</div>
        <div className="mobile-weekday">Mon</div>
        <div className="mobile-weekday">Tue</div>
        <div className="mobile-weekday">Wed</div>
        <div className="mobile-weekday">Thu</div>
        <div className="mobile-weekday">Fri</div>
        <div className="mobile-weekday">Sat</div>
      </div>

      <div className="mobile-days-grid">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="mobile-day empty"></div>;
          }

          const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const status = getLeaveStatus(dayDate);

          return (
            <div
              key={day}
              className={`mobile-day ${status ? `status-${status}` : ''}`}
              onClick={() => handleDateClick(day)}
            >
              <span className="mobile-day-number">{day}</span>
              {status && <div className={`mobile-status-dot status-${status}`}></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LeaveCalendar() {
  const [date, setDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sample leave data - replace with actual data from API
  // This should be fetched from your backend API
  const leaveData = {
    '2025-11-05': 'approved',
    '2025-11-10': 'pending',
    '2025-11-15': 'rejected',
    '2025-11-20': 'approved',
    '2025-11-25': 'pending',
    '2025-12-03': 'approved',
    '2025-12-08': 'pending',
    '2025-12-15': 'rejected',
    '2025-10-05': 'approved',
    '2025-10-12': 'pending',
    '2025-10-13': 'pending',
  };

  // Get leave status for a specific date
  const getLeaveStatus = (checkDate) => {
    const dateStr = checkDate.toISOString().split('T')[0];
    return leaveData[dateStr];
  };

  // Custom tile class based on leave status
  const getTileClassName = ({ date }) => {
    return 'leave-tile';
  };

  // Custom tile content with status marker
  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const status = getLeaveStatus(date);

      return (
        <div className="tile-content">
          {status && <div className={`status-marker status-${status}`}></div>}
        </div>
      );
    }
  };

  return (
    <div className="leave-calendar-container">
      {isMobile ? (
        <>
          <h2 className="leave-calendar-title">Leave Management</h2>
          <MobileCalendar
            date={date}
            setDate={setDate}
            leaveData={leaveData}
            getLeaveStatus={getLeaveStatus}
          />
        </>
      ) : (
        <div className="leave-calendar-outer-wrapper">
          <h2 className="leave-calendar-title">Leave Management</h2>
          <div className="calendar-divider"></div>
          <div className="leave-calendar-wrapper">
            <div className="calendar-nav-header">
          <div className="nav-dropdowns">
            <select
              className="month-dropdown"
              value={date.getMonth()}
              onChange={(e) => setDate(new Date(date.getFullYear(), parseInt(e.target.value)))}
            >
              <option value="0">Jan</option>
              <option value="1">Feb</option>
              <option value="2">Mar</option>
              <option value="3">Apr</option>
              <option value="4">May</option>
              <option value="5">Jun</option>
              <option value="6">Jul</option>
              <option value="7">Aug</option>
              <option value="8">Sep</option>
              <option value="9">Oct</option>
              <option value="10">Nov</option>
              <option value="11">Dec</option>
            </select>
            <select
              className="year-dropdown"
              value={date.getFullYear()}
              onChange={(e) => setDate(new Date(parseInt(e.target.value), date.getMonth()))}
            >
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="nav-center-section">
            <button
              className="nav-arrow-btn prev-arrow"
              onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1))}
            >
              <img src={arrowLeft} alt="Previous" />
            </button>
            <div className="calendar-month-year">
              {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>
            <button
              className="nav-arrow-btn next-arrow"
              onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1))}
            >
              <img src={arrowLeft} alt="Next" className="arrow-right" />
            </button>
          </div>
        </div>
        <Calendar
          value={date}
          onChange={setDate}
          tileClassName={getTileClassName}
          tileContent={getTileContent}
          calendarType="gregory"
          navigationLabel={null}
          showNavigation={false}
        />
        </div>
        </div>
      )}

      {/* Legend */}
      <div className="leave-legend">
        <div className="legend-item">
          <span className="legend-dot approved"></span>
          <span className="legend-label">Approved</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot pending"></span>
          <span className="legend-label">Pending</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot rejected"></span>
          <span className="legend-label">Rejected</span>
        </div>
      </div>
    </div>
  );
}


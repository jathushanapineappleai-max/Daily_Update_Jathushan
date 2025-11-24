import React, { useState, useEffect } from 'react';
import './TodayAttendance.css';
import checkInIcon from '../../assets/icons/checkin.png';
import breakTimeIcon from '../../assets/icons/break_time.png';
import checkOutIcon from '../../assets/icons/checkout.png';
import totalDaysIcon from '../../assets/icons/total_days.png';
import CheckoutConfirmModal from '../../modals/CheckoutConfirmModal';

const TodayAttendance = () => {
  const [attendanceState, setAttendanceState] = useState('initial'); // initial, checkedIn, onBreak
  const [checkInTime, setCheckInTime] = useState(null);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [totalBreakTime, setTotalBreakTime] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [displayTime, setDisplayTime] = useState({
    checkIn: '00:00 p.m',
    breakTime: '00:00 mins',
    checkOut: '00:00 p.m',
    totalDays: '0 days'
  });

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      // Update Check In time (display once when checked in)
      if (checkInTime && attendanceState !== 'initial') {
        const hours = checkInTime.getHours();
        const minutes = String(checkInTime.getMinutes()).padStart(2, '0');
        const period = hours >= 12 ? 'p.m' : 'a.m';
        const displayHours = hours % 12 || 12;
        setDisplayTime(prev => ({
          ...prev,
          checkIn: `${String(displayHours).padStart(2, '0')}:${minutes} ${period}`
        }));
      }

      // Update Break Time (accumulated + current break if on break)
      if (attendanceState === 'onBreak' && breakStartTime) {
        const currentBreakDuration = Math.floor((now - breakStartTime) / 1000);
        const totalDuration = totalBreakTime + currentBreakDuration;
        const breakMins = Math.floor(totalDuration / 60);
        const breakSecs = totalDuration % 60;
        setDisplayTime(prev => ({
          ...prev,
          breakTime: `${String(breakMins).padStart(2, '0')}:${String(breakSecs).padStart(2, '0')} mins`
        }));
      } else if (attendanceState === 'checkedIn' && totalBreakTime > 0) {
        // Display accumulated break time when back to work
        const breakMins = Math.floor(totalBreakTime / 60);
        const breakSecs = totalBreakTime % 60;
        setDisplayTime(prev => ({
          ...prev,
          breakTime: `${String(breakMins).padStart(2, '0')}:${String(breakSecs).padStart(2, '0')} mins`
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [checkInTime, breakStartTime, attendanceState, totalBreakTime]);

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now);
    setAttendanceState('checkedIn');
  };

  const handleTakeBreak = () => {
    const now = new Date();
    setBreakStartTime(now);
    setAttendanceState('onBreak');
  };

  const handleBackToWork = () => {
    if (breakStartTime) {
      const breakDuration = Math.floor((new Date() - breakStartTime) / 1000);
      setTotalBreakTime(totalBreakTime + breakDuration);
    }
    setBreakStartTime(null);
    setAttendanceState('checkedIn');
  };

  const handleCheckOutClick = () => {
    // Show confirmation modal instead of directly checking out
    setShowCheckoutModal(true);
  };

  const handleCheckOutConfirm = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? 'p.m' : 'a.m';
    const displayHours = hours % 12 || 12;

    setDisplayTime(prev => ({
      ...prev,
      checkOut: `${String(displayHours).padStart(2, '0')}:${minutes} ${period}`
    }));

    setAttendanceState('checkedOut');
    setBreakStartTime(null);
    setShowCheckoutModal(false);
  };

  const handleCheckOutCancel = () => {
    setShowCheckoutModal(false);
  };

  return (
    <div className="today-attendance-container">
      <h2 className="ta-title">Today Attendance</h2>
      
      <div className="ta-content">
        {/* Left Column - Check In & Break Time */}
        <div className="ta-column">
          {/* Check In Card */}
          <div className="ta-card">
            <div className="ta-card-icon">
              <img src={checkInIcon} alt="Check In" />
            </div>
            <div className="ta-card-content">
              <p className="ta-card-label">Check In</p>
              <p className="ta-card-time">{displayTime.checkIn}</p>
            </div>
          </div>

          {/* Break Time Card */}
          <div className="ta-card">
            <div className="ta-card-icon">
              <img src={breakTimeIcon} alt="Break Time" />
            </div>
            <div className="ta-card-content">
              <p className="ta-card-label">Break Time</p>
              <p className="ta-card-time">{displayTime.breakTime}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Check Out & Total Days */}
        <div className="ta-column">
          {/* Check Out Card */}
          <div className="ta-card">
            <div className="ta-card-icon">
              <img src={checkOutIcon} alt="Check Out" />
            </div>
            <div className="ta-card-content">
              <p className="ta-card-label">Check Out</p>
              <p className="ta-card-time">{displayTime.checkOut}</p>
            </div>
          </div>

          {/* Total Days Card */}
          <div className="ta-card">
            <div className="ta-card-icon">
              <img src={totalDaysIcon} alt="Total Days" />
            </div>
            <div className="ta-card-content">
              <p className="ta-card-label">Total Days</p>
              <p className="ta-card-time">{displayTime.totalDays}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="ta-actions">
        <button
          className={`ta-btn-break ${attendanceState === 'checkedIn' ? 'active' : ''} ${attendanceState === 'checkedOut' ? 'disabled-after-checkout' : ''}`}
          onClick={attendanceState === 'onBreak' ? handleBackToWork : handleTakeBreak}
          disabled={attendanceState === 'initial' || attendanceState === 'checkedOut'}
        >
          {attendanceState === 'onBreak' ? 'Back to Work' : 'Take a Break'}
        </button>
        <button
          className={`ta-btn-checkout ${attendanceState === 'onBreak' ? 'error' : ''} ${attendanceState === 'checkedOut' ? 'disabled-after-checkout' : ''}`}
          onClick={attendanceState === 'initial' ? handleCheckIn : handleCheckOutClick}
          disabled={attendanceState === 'onBreak' || attendanceState === 'checkedOut'}
        >
          {attendanceState === 'initial' ? 'Check In' : 'Check Out'}
        </button>
      </div>

      {/* Checkout Confirmation Modal */}
      <CheckoutConfirmModal
        isOpen={showCheckoutModal}
        onConfirm={handleCheckOutConfirm}
        onCancel={handleCheckOutCancel}
      />
    </div>
  );
};

export default TodayAttendance;


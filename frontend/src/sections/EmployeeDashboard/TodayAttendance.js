import React, { useState, useEffect, useRef } from 'react';
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
  
  // Refs for animation
  const totalDaysRef = useRef(null);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

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
  
  // Animate Total Days counter on mount
  useEffect(() => {
    if (totalDaysRef.current) {
      // Quick counting animation for Total Days
      let count = 0;
      const target = 150; // Simulate a realistic number of total days
      const duration = 1500; // 1.5 seconds
      const increment = target === 0 ? 0 : Math.ceil(target / (duration / 16));
      
      const animateCounter = () => {
        if (count < target) {
          count = Math.min(count + increment, target);
          setDisplayTime(prev => ({
            ...prev,
            totalDays: `${count} days`
          }));
          requestAnimationFrame(animateCounter);
        }
      };
      
      // Start animation after a short delay
      const timeout = setTimeout(() => {
        animateCounter();
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, []);
  
  // Add entrance animations
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.add('ta-container-enter');
      
      // Staggered card animations
      setTimeout(() => {
        cardsRef.current.forEach((card, index) => {
          if (card) {
            setTimeout(() => {
              card.classList.add('ta-card-enter');
            }, index * 100);
          }
        });
      }, 100);
    }
  }, []);

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now);
    setAttendanceState('checkedIn');
    
    // Add animation feedback
    if (cardsRef.current[0]) {
      cardsRef.current[0].classList.add('ta-card-action-feedback');
      setTimeout(() => {
        cardsRef.current[0].classList.remove('ta-card-action-feedback');
      }, 1000);
    }
  };

  const handleTakeBreak = () => {
    const now = new Date();
    setBreakStartTime(now);
    setAttendanceState('onBreak');
    
    // Add animation feedback
    if (cardsRef.current[1]) {
      cardsRef.current[1].classList.add('ta-card-action-feedback');
      setTimeout(() => {
        cardsRef.current[1].classList.remove('ta-card-action-feedback');
      }, 1000);
    }
  };

  const handleBackToWork = () => {
    if (breakStartTime) {
      const breakDuration = Math.floor((new Date() - breakStartTime) / 1000);
      setTotalBreakTime(totalBreakTime + breakDuration);
    }
    setBreakStartTime(null);
    setAttendanceState('checkedIn');
    
    // Add animation feedback
    if (cardsRef.current[1]) {
      cardsRef.current[1].classList.add('ta-card-action-feedback');
      setTimeout(() => {
        cardsRef.current[1].classList.remove('ta-card-action-feedback');
      }, 1000);
    }
  };

  const handleCheckOutClick = () => {
    // Show confirmation modal instead of directly checking out
    setShowCheckoutModal(true);
    
    // Add animation feedback
    if (cardsRef.current[2]) {
      cardsRef.current[2].classList.add('ta-card-action-feedback');
      setTimeout(() => {
        cardsRef.current[2].classList.remove('ta-card-action-feedback');
      }, 1000);
    }
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
    
    // Add animation feedback
    if (cardsRef.current[2]) {
      cardsRef.current[2].classList.add('ta-card-action-feedback');
      setTimeout(() => {
        cardsRef.current[2].classList.remove('ta-card-action-feedback');
      }, 1000);
    }
  };

  const handleCheckOutCancel = () => {
    setShowCheckoutModal(false);
  };

  // Function to add pulse animation to active card
  const addActiveCardPulse = () => {
    // Remove pulse from all cards first
    cardsRef.current.forEach(card => {
      if (card) {
        card.classList.remove('ta-card-active-pulse');
      }
    });
    
    // Add pulse to active card based on state
    if (attendanceState === 'checkedIn' && cardsRef.current[0]) {
      cardsRef.current[0].classList.add('ta-card-active-pulse');
    } else if (attendanceState === 'onBreak' && cardsRef.current[1]) {
      cardsRef.current[1].classList.add('ta-card-active-pulse');
    }
  };

  // Add pulse animation to active card when state changes
  useEffect(() => {
    addActiveCardPulse();
  }, [attendanceState]);

  return (
    <div className="today-attendance-container" ref={containerRef}>
      <h2 className="ta-title">Today Attendance</h2>
      
      <div className="ta-content">
        {/* Left Column - Check In & Break Time */}
        <div className="ta-column">
          {/* Check In Card */}
          <div className="ta-card" ref={(el) => cardsRef.current[0] = el}>
            <div className="ta-card-icon">
              <img src={checkInIcon} alt="Check In" />
            </div>
            <div className="ta-card-content">
              <p className="ta-card-label">Check In</p>
              <p className="ta-card-time">{displayTime.checkIn}</p>
            </div>
          </div>

          {/* Break Time Card */}
          <div className="ta-card" ref={(el) => cardsRef.current[1] = el}>
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
          <div className="ta-card" ref={(el) => cardsRef.current[2] = el}>
            <div className="ta-card-icon">
              <img src={checkOutIcon} alt="Check Out" />
            </div>
            <div className="ta-card-content">
              <p className="ta-card-label">Check Out</p>
              <p className="ta-card-time">{displayTime.checkOut}</p>
            </div>
          </div>

          {/* Total Days Card */}
          <div className="ta-card" ref={(el) => cardsRef.current[3] = el}>
            <div className="ta-card-icon">
              <img src={totalDaysIcon} alt="Total Days" />
            </div>
            <div className="ta-card-content">
              <p className="ta-card-label">Total Days</p>
              <p className="ta-card-time" ref={totalDaysRef}>{displayTime.totalDays}</p>
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


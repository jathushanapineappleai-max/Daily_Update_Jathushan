import React, { useState, useEffect } from 'react';
import './HolidayList.css';

// Sri Lankan holidays for 2025 and 2026
const SRI_LANKAN_HOLIDAYS = {
  2025: [
    { name: 'New Year Day', date: '2025-01-01', day: 'Wednesday' },
    { name: 'Independence Day', date: '2025-02-04', day: 'Tuesday' },
    { name: 'Maha Shivaratri', date: '2025-02-26', day: 'Wednesday' },
    { name: 'Mawlid', date: '2025-03-02', day: 'Sunday' },
    { name: 'Republic Day', date: '2025-03-14', day: 'Friday' },
    { name: 'Poya Day (Medin)', date: '2025-03-23', day: 'Sunday' },
    { name: 'Good Friday', date: '2025-04-18', day: 'Friday' },
    { name: 'Sinhala & Tamil New Year', date: '2025-04-14', day: 'Monday' },
    { name: 'Poya Day (Bak)', date: '2025-04-22', day: 'Tuesday' },
    { name: 'Labour Day', date: '2025-05-01', day: 'Thursday' },
    { name: 'Vesak Full Moon Poya', date: '2025-05-21', day: 'Wednesday' },
    { name: 'Poson Full Moon Poya', date: '2025-06-20', day: 'Friday' },
    { name: 'Esala Full Moon Poya', date: '2025-07-20', day: 'Sunday' },
    { name: 'Nikini Full Moon Poya', date: '2025-08-19', day: 'Tuesday' },
    { name: 'Binara Full Moon Poya', date: '2025-09-18', day: 'Thursday' },
    { name: 'Deepavali', date: '2025-10-20', day: 'Monday' },
    { name: 'Il Full Moon Poya', date: '2025-10-18', day: 'Saturday' },
    { name: 'Kataragama Perahera', date: '2025-07-31', day: 'Thursday' },
    { name: 'Kandy Perahera', date: '2025-08-13', day: 'Wednesday' },
    { name: 'Christmas Day', date: '2025-12-25', day: 'Thursday' }
  ],
  2026: [
    { name: 'New Year Day', date: '2026-01-01', day: 'Thursday' },
    { name: 'Independence Day', date: '2026-02-04', day: 'Wednesday' },
    { name: 'Republic Day', date: '2026-03-14', day: 'Saturday' },
    { name: 'Good Friday', date: '2026-04-03', day: 'Friday' },
    { name: 'Sinhala & Tamil New Year', date: '2026-04-14', day: 'Tuesday' },
    { name: 'Labour Day', date: '2026-05-01', day: 'Friday' },
    { name: 'Vesak Full Moon Poya', date: '2026-05-10', day: 'Sunday' },
    { name: 'Christmas Day', date: '2026-12-25', day: 'Friday' }
  ]
};

export default function HolidayList() {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    // Get current year and next year
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    // Combine holidays from current and next year
    const allHolidays = [
      ...(SRI_LANKAN_HOLIDAYS[currentYear] || []),
      ...(SRI_LANKAN_HOLIDAYS[nextYear] || [])
    ];

    // Filter to show only upcoming holidays (from today onwards)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingHolidays = allHolidays
      .filter(holiday => new Date(holiday.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10) // Show only next 10 holidays
      .map((holiday, index) => {
        const holidayDate = new Date(holiday.date);
        return {
          id: index,
          name: holiday.name,
          date: holidayDate.getDate(),
          month: holidayDate.toLocaleString('default', { month: 'short' }).toUpperCase(),
          day: holiday.day,
          color: '#DADADA'
        };
      });

    setHolidays(upcomingHolidays);
  }, []);

  return (
    <div className="holiday-container">
      <div className="holiday-wrapper">
        <h2 className="holiday-title">Holidays</h2>
        
        <div className="holidays-list">
          {holidays.map((holiday) => (
            <div key={holiday.id} className="holiday-item">
              <div className="holiday-date-box" style={{ backgroundColor: holiday.color }}>
                <div className="holiday-date-number">{holiday.date}</div>
                <div className="holiday-date-month">{holiday.month}</div>
              </div>
              
              <div className="holiday-info">
                <h3 className="holiday-name">{holiday.name}</h3>
                <p className="holiday-day">{holiday.day}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import './LeaveStats.css';

const PieChart = ({ title, available, consumed }) => {
  const total = available + consumed;
  const availablePercentage = (available / total) * 100;
  const consumedPercentage = (consumed / total) * 100;

  // Calculate SVG path for pie chart
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const availableStrokeDashoffset = circumference - (availablePercentage / 100) * circumference;

  return (
    <div className="pie-chart-card">
      <h3 className="pie-chart-title">{title}</h3>
      
      <div className="pie-chart-container">
        <svg className="pie-chart-svg" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle cx="60" cy="60" r="55" fill="none" stroke="#1E293B" strokeWidth="8" />
          
          {/* Available segment (green) */}
          <circle
            cx="60"
            cy="60"
            r="55"
            fill="none"
            stroke="#347E45"
            strokeWidth="8"
            strokeDasharray={`${(availablePercentage / 100) * circumference} ${circumference}`}
            strokeDashoffset="0"
            transform="rotate(-90 60 60)"
            strokeLinecap="round"
          />
        </svg>

        <div className="pie-chart-legend">
          <div className="legend-item">
            <span className="legend-dot available"></span>
            <div className="legend-text">
              <div className="legend-number">{available}</div>
              <div className="legend-label">Available</div>
            </div>
          </div>
          
          <div className="legend-item">
            <span className="legend-dot consumed"></span>
            <div className="legend-text">
              <div className="legend-number">{consumed}</div>
              <div className="legend-label">Consumed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LeaveStats() {
  const [stats] = useState([
    { title: 'Casual', available: 7, consumed: 7 },
    { title: 'Sick', available: 5, consumed: 3 },
    { title: 'Annual', available: 12, consumed: 8 }
  ]);

  return (
    <div className="leave-stats-container">
      <div className="pie-charts-grid">
        {stats.map((stat, index) => (
          <PieChart
            key={index}
            title={stat.title}
            available={stat.available}
            consumed={stat.consumed}
          />
        ))}
      </div>
    </div>
  );
}


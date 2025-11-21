import React, { useState } from 'react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './LeaveStats.css';

const LeavePieChart = ({ title, available, consumed }) => {
  const total = available + consumed;
  const data = [
    { name: 'Available', value: available, color: '#347E45' },
    { name: 'Consumed', value: consumed, color: '#1E293B' }
  ];

  return (
    <div className="pie-chart-card">
      <h3 className="pie-chart-title">{title}</h3>

      <div className="pie-chart-container">
        <div className="pie-chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={37}
                outerRadius={55}
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>

              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={37}
                outerRadius={60}
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                isAnimationActive={false}
              >
                {data.map((entry) => (
                  <Cell
                    key={`${entry.name}-overlay`}
                    fill={entry.name === 'Available' ? entry.color : 'transparent'}
                  />
                ))}
              </Pie>
            </RePieChart>
          </ResponsiveContainer>

          <div className="pie-chart-center">
            <span className="pie-chart-total">{total}</span>
            <span className="pie-chart-total-label">Total</span>
          </div>
        </div>

        <div className="pie-chart-legend">
          <div className="legend-item">
            <span className="legend-dot available"></span>
            <div className="legend-text">
              <div className="legend-number">{String(available).padStart(2, '0')}</div>
              <div className="legend-label">Available</div>
            </div>
          </div>

          <div className="legend-item">
            <span className="legend-dot consumed"></span>
            <div className="legend-text">
              <div className="legend-number">{String(consumed).padStart(2, '0')}</div>
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
          <LeavePieChart
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


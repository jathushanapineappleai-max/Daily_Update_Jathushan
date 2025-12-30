// import React from "react";
// import "../../styles/DashboardWidgets.css";

// import TEicon from "../../assets/icons/teicon.png";      // total employee
// import TAicon from "../../assets/icons/applicant.png";   // total applicant
// import TATicon from "../../assets/icons/attendence.png"; // today attendance
// import TPicon from "../../assets/icons/projects.png";    // total projects

// export default function DashboardWidgets() {
//   const widgets = [
//     { id: 1, title: "Total Employee", value: 56, icon: TEicon, update: "July 16, 2025" },
//     { id: 2, title: "Total Applicant", value: 100, icon: TAicon, update: "July 14, 2025" },
//     { id: 3, title: "Today Attendance", value: 47, icon: TATicon, update: "July 14, 2025" },
//     { id: 4, title: "Total Projects", value: 25, icon: TPicon, update: "July 10, 2025" },
//   ];

//   return (
//     <div className="widget-section" role="region" aria-label="Dashboard widgets" style={{ width: '100%', maxWidth: '1164px', margin: '0', padding: '20px', boxSizing: 'border-box' }}>
//       <div className="widget-grid">
//         {widgets.map((w) => (
//           <article className="widget-box" key={w.id}>
//             <div className="widget-top">
//               <div className="icon-wrap" aria-hidden="true">
//                 <img src={w.icon} alt={`${w.title} icon`} />
//               </div>
//               <div className="widget-title">{w.title}</div>
//             </div>

//             <div className="widget-value" aria-live="polite">{w.value}</div>

//             <div className="divider" />

//             <div className="widget-update">Update: {w.update}</div>
//           </article>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import "../../styles/DashboardWidgets.css";

import TEicon from "../../assets/icons/teicon.png";      // total employee
import TAicon from "../../assets/icons/applicant.png";   // total applicant
import TATicon from "../../assets/icons/attendence.png"; // today attendance
import TPicon from "../../assets/icons/projects.png";    // total projects

import { fetchTodayAttendanceCount } from '../../integration/attendanceAPI';

export default function DashboardWidgets() {
  const [widgets, setWidgets] = useState([
    { id: 1, title: "Total Employee", value: 56, icon: TEicon, update: "Just now" },
    { id: 2, title: "Total Applicant", value: 100, icon: TAicon, update: "Just now" },
    { id: 3, title: "Today Attendance", value: 0, icon: TATicon, update: "Just now" },
    { id: 4, title: "Total Projects", value: 25, icon: TPicon, update: "Just now" },
  ]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        const response = await fetchTodayAttendanceCount();
        
        setWidgets(prevWidgets => 
          prevWidgets.map(widget => 
            widget.id === 3 
              ? { ...widget, value: response.data.count, update: new Date().toLocaleDateString() }
              : widget
          )
        );
      } catch (error) {
        console.error('Error fetching today attendance count:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendanceData();
  }, []);

  return (
    <div className="widget-section" role="region" aria-label="Dashboard widgets" style={{ width: '100%', maxWidth: '1164px', margin: '0', padding: '20px', boxSizing: 'border-box' }}>
      <div className="widget-grid">
        {widgets.map((w) => (
          <article className="widget-box" key={w.id}>
            <div className="widget-top">
              <div className="icon-wrap" aria-hidden="true">
                <img src={w.icon} alt={`${w.title} icon`} />
              </div>
              <div className="widget-title">{w.title}</div>
            </div>

            <div className="widget-value" aria-live="polite">{w.value}</div>

            <div className="divider" />

            <div className="widget-update">Update: {w.update}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
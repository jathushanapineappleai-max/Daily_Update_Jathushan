import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import logo from '../assets/images/logo.png';
import pineappleBrand from '../assets/images/pineappleai.png';

import dashboardIcon from '../assets/icons/dashboard.png';
import employeeIcon from '../assets/icons/employee.png';
import leaveIcon from '../assets/icons/leave.png';
import recruitmentIcon from '../assets/icons/recruitment.png';
import projectIcon from '../assets/icons/project.png';
import payrollIcon from '../assets/icons/payroll.png';
import settingIcon from '../assets/icons/setting.png';
import logoutIcon from '../assets/icons/logout.png';
import taskIcon from '../assets/icons/task.png';
import performanceIcon from '../assets/icons/performance.png';


const Sidebar = ({ isOpen, onNavigate }) => {
  const adminMenu = [
    { path: '/dashboard', label: 'Dashboard', icon: dashboardIcon },
    { path: '/employees', label: 'Employees', icon: employeeIcon },
    { path: '/leave', label: 'Leaves', icon: leaveIcon },
    { path: '/recruitment', label: 'Recruitment', icon: recruitmentIcon },
    { path: '/projects', label: 'Projects', icon: projectIcon },
    { path: '/payroll', label: 'Payroll', icon: payrollIcon },
    { path: '/templates', label: 'Templates', icon: projectIcon },
    { path: '/settings', label: 'Settings', icon: settingIcon },
    { path: '/logout', label: 'Logout', icon: logoutIcon },
  ];

  const staffMenu = [
    { path: '/employee-dashboard', label: 'Dashboard', icon: dashboardIcon },
    { path: '/tasks', label: 'My Tasks', icon: taskIcon },
    { path: '/leaves', label: 'Leaves', icon: leaveIcon },
    { path: '/performance', label: 'Performance', icon: performanceIcon },
    { path: '/settings', label: 'Settings', icon: settingIcon },
    { path: '/logout', label: 'Logout', icon: logoutIcon },
  ];

  // Combine both menus: admin items first, then employee items
  const menuItems = [...adminMenu, ...staffMenu];
  const sidebarClass = `sidebar${isOpen ? ' open' : ''}`;

  return (
    <div className={sidebarClass}>
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="logo-img" />
        <img src={pineappleBrand} alt="PINEAPPLEAI" className="brand-img" />
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onNavigate}
          >
            <img className="nav-icon" src={item.icon} alt={`${item.label} icon`} />
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
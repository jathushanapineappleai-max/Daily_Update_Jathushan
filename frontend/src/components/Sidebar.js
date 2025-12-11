import React, { useState, useEffect } from 'react';
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

// Map icon names to actual imports
const iconMap = {
  dashboard: dashboardIcon,
  employee: employeeIcon,
  leave: leaveIcon,
  recruitment: recruitmentIcon,
  project: projectIcon,
  payroll: payrollIcon,
  setting: settingIcon,
  logout: logoutIcon,
  task: taskIcon,
  performance: performanceIcon
};

const Sidebar = ({ isOpen, onNavigate }) => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Fetch menu items from backend based on user role
    const fetchMenuItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/sidebar/menu', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (data.success) {
          setMenuItems(data.data.menuItems);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        // Fallback to original menu structure if API fails
        const adminMenu = [
          { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
          { path: '/employees', label: 'Employees', icon: 'employee' },
          { path: '/leave', label: 'Leaves', icon: 'leave' },
          { path: '/recruitment', label: 'Recruitment', icon: 'recruitment' },
          { path: '/projects', label: 'Projects', icon: 'project' },
          { path: '/payroll', label: 'Payroll', icon: 'payroll' },
          { path: '/templates', label: 'Templates', icon: 'project' },
          { path: '/settings', label: 'Settings', icon: 'setting' },
          { path: '/logout', label: 'Logout', icon: 'logout' }
        ];

        const staffMenu = [
          { path: '/employee-dashboard', label: 'Dashboard', icon: 'dashboard' },
          { path: '/tasks', label: 'My Tasks', icon: 'task' },
          { path: '/leaves', label: 'Leaves', icon: 'leave' },
          { path: '/performance', label: 'Performance', icon: 'performance' },
          { path: '/settings', label: 'Settings', icon: 'setting' },
          { path: '/logout', label: 'Logout', icon: 'logout' }
        ];

        // For demo purposes, we'll show admin menu
        // In a real app, this would be determined by the user's role
        setMenuItems(adminMenu);
      }
    };

    fetchMenuItems();
  }, []);

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
            <img className="nav-icon" src={iconMap[item.icon]} alt={`${item.label} icon`} />
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
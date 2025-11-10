import React from 'react';
import './Header.css';
import defaultProfile from '../assets/images/default_profile.png';
import bellIcon from '../assets/icons/bell.png';


const Header = ({ onToggleSidebar }) => {
  return (
    <header className="header">
      {/* Mobile hamburger toggle */}
      <button type="button" className="hamburger-btn" onClick={onToggleSidebar} aria-label="Open sidebar">
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* Left title/subtitle group */}
      <div className="header-title">
        <div className="title">Hello Sanjeevan <span className="wave" aria-hidden="true">👋</span></div>
        <div className="subtitle">Good Morning</div>
      </div>

      {/* Notification square (green border) with centered icon */}
      <div className="notification-box">
        <img src={bellIcon} alt="Notifications" className="notification-icon-img" />
      </div>

      {/* User card: avatar + name + role */}
      <div className="user-card">
        <div className="avatar-box">
          <img src={defaultProfile} alt="User Avatar" />
        </div>
        <div className="user-info">
          <div className="name">Admin User</div>
          <div className="role">Administrator</div>
        </div>
      </div>
    </header>
  );
};

export default Header;

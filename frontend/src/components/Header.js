import React from 'react';
import useAuth from '../hooks/useAuth';
import './Header.css';
import defaultProfile from '../assets/images/default_profile.png';
import bellIcon from '../assets/icons/bell.png';


const Header = ({ onToggleSidebar }) => {
  const { user, loading } = useAuth();
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  // Get user's first name or default
  const getFirstName = () => {
    if (loading) return 'Loading...';
    if (user && user.first_name) {
      return user.first_name;
    }
    return 'User';
  };
  
  // Get user's role or default
  const getUserRole = () => {
    if (loading) return '...';
    if (user && user.role) {
      return user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }
    return 'User';
  };
  
  // Get user's profile image
  const getProfileImage = () => {
    if (loading) return defaultProfile;
    if (user && user.EmployeeDetail && user.EmployeeDetail.image_path) {
      return user.EmployeeDetail.image_path;
    }
    return defaultProfile;
  };
  
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
        <div className="title">Hello {getFirstName()} <span className="wave" aria-hidden="true">👋</span></div>
        <div className="subtitle">{getGreeting()}</div>
      </div>

      {/* Notification square (green border) with centered icon */}
      <div className="notification-box">
        <img src={bellIcon} alt="Notifications" className="notification-icon-img" />
      </div>

      {/* User card: avatar + name + role */}
      <div className="user-card">
        <div className="avatar-box">
          <img 
            src={getProfileImage()} 
            alt="User Avatar" 
          />
        </div>
        <div className="user-info">
          <div className="name">{getFirstName()}</div>
          <div className="role">{getUserRole()}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;

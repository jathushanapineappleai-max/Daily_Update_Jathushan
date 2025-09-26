import React, { useState } from "react";
import "../../styles/admin_panel/sidebar.css";

import pineappleLogo from "../../assets/images/pineappleAI_logo.png"; // ✅ imported real logo

import homeIcon from "../../assets/icons/sidebar_home.png";
import aboutIcon from "../../assets/icons/sidebar_about.png";
import servicesIcon from "../../assets/icons/sidebar_services.png";
import productIcon from "../../assets/icons/sidebar_product.png";
import blogIcon from "../../assets/icons/sidebar_blog.png";
import contactIcon from "../../assets/icons/sidebar_contacts.png";
import careersIcon from "../../assets/icons/sidebar_careers.png";
import logoutIcon from "../../assets/icons/sidebar_logout.png";

const navItems = [
  { id: "home", label: "Home", icon: homeIcon },
  { id: "about", label: "About", icon: aboutIcon, dropdown: ["Team", "Vision"] },
  { id: "services", label: "Services", icon: servicesIcon, dropdown: ["Web Dev", "App Dev", "UI/UX"] },
  { id: "products", label: "Products", icon: productIcon },
  { id: "blogs", label: "Blogs", icon: blogIcon },
  { id: "contact", label: "Contact", icon: contactIcon },
  { id: "careers", label: "Careers", icon: careersIcon, dropdown: ["Open Roles", "Internships"] },
  { id: "logout", label: "Logout", icon: logoutIcon },
];

export default function Sidebar() {
  const [selected, setSelected] = useState("home");
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile toggle state

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNavClick = (item) => {
    setSelected(item.id);
    if (item.dropdown) toggleDropdown(item.id);
    if (window.innerWidth < 768) setSidebarOpen(false); // auto-close sidebar on mobile
  };

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className={`sidebar-toggle ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle Sidebar"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      <div className={`ap-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="ap-sidebar-logo">
  <img src={pineappleLogo} alt="PineappleAI Logo" />
  <h1>PineappleAI</h1>
  {/* Divider line */}
  <div className="ap-sidebar-logo-divider"></div>
</div>



        {/* Divider under Logo */}
        <hr className="ap-sidebar-logo-divider" />

        {/* Navigation */}
        <nav className="ap-sidebar-nav">
          {navItems.map((item) => (
            <div key={item.id} className="ap-nav-wrapper">
              <button
                onClick={() => handleNavClick(item)}
                className={selected === item.id ? "ap-nav-item active" : "ap-nav-item"}
              >
                {item.icon && (
                  <img
                    src={item.icon}
                    alt={`${item.label} icon`}
                    className="ap-nav-icon"
                  />
                )}
                <span>{item.label}</span>

                {/* Dropdown indicator */}
                {item.dropdown && (
                  <span
                    className={`ap-dropdown-icon ${openDropdowns[item.id] ? "open" : ""}`}
                  >
                    ▼
                  </span>
                )}
              </button>

              {/* Dropdown menu */}
              {item.dropdown && openDropdowns[item.id] && (
                <div className="ap-dropdown">
                  {item.dropdown.map((subItem) => (
                    <button
                      key={subItem}
                      className="ap-dropdown-item"
                      onClick={() => setSelected(subItem)}
                    >
                      {subItem}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin_panel/sidebar.css";

import pineappleLogo from "../../assets/images/pineappleAI_logo.png";

import homeIcon from "../../assets/icons/sidebar_home.png";
import aboutIcon from "../../assets/icons/sidebar_about.png";
import servicesIcon from "../../assets/icons/sidebar_services.png";
import productIcon from "../../assets/icons/sidebar_product.png";
import blogIcon from "../../assets/icons/sidebar_blog.png";
import contactIcon from "../../assets/icons/sidebar_contacts.png";
import careersIcon from "../../assets/icons/sidebar_careers.png";
import logoutIcon from "../../assets/icons/sidebar_logout.png";

const navItems = [
  {
    id: "home",
    label: "Home",
    icon: homeIcon,
    dropdown: [
      { label: "Product Selection", path: "/admin/product-selection" },
      { label: "Client Review", path: "/admin/client-review" },
    ],
  },
  {
    id: "about",
    label: "About",
    icon: aboutIcon,
    path: "/admin/team",
  },
  {
    id: "services",
    label: "Services",
    icon: servicesIcon,
    dropdown: [
      { label: "Main Services", path: "/admin/main-services" },
      { label: "Tech Stack", path: "/admin/tech-stack" },
      { label: "Industry", path: "/admin/industry" },
    ],
  },
  {
    id: "products",
    label: "Products",
    icon: productIcon,
    dropdown: [
      { label: "Company Projects", path: "/admin/company-projects" },
      { label: "Clients Projects", path: "/admin/clients-projects" },
    ],
  },
  {
    id: "blogs",
    label: "Blogs",
    icon: blogIcon,
    dropdown: [
      { label: "New Blog", path: "/admin/new-blog" },
      { label: "Posted Blogs", path: "/admin/posted-blogs" },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    icon: contactIcon,
    path: "/admin/contact",
  },
  {
    id: "careers",
    label: "Careers",
    icon: careersIcon,
    dropdown: [
      { label: "New Jobs", path: "/admin/new-jobs" },
      { label: "Posted Jobs", path: "/admin/posted-jobs" },
      { label: "Applications", path: "/admin/applications" },
    ],
  },
  {
    id: "logout",
    label: "Logout",
    icon: logoutIcon,
    path: "/admin/signin",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("home");
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile toggle

  const handleNavClick = (item, subPath) => {
    if (subPath) {
      navigate(subPath);
      setSelected(subPath);
    } else if (item.path) {
      navigate(item.path);
      setSelected(item.path);
    }

    if (item.dropdown) {
      setOpenDropdowns((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
    }

    if (window.innerWidth < 768) setSidebarOpen(false);
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
        </div>

        {/* Divider line */}
        <hr className="ap-sidebar-logo-divider" />

        {/* Navigation */}
        <nav className="ap-sidebar-nav">
          {navItems.map((item) => (
            <div key={item.id} className="ap-nav-wrapper">
              <button
                onClick={() => handleNavClick(item)}
                className={
                  selected === item.path ? "ap-nav-item active" : "ap-nav-item"
                }
              >
                {item.icon && (
                  <img src={item.icon} alt={`${item.label} icon`} className="ap-nav-icon" />
                )}
                <span>{item.label}</span>

                {/* Dropdown arrow */}
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
                      key={subItem.path}
                      className="ap-dropdown-item"
                      onClick={() => handleNavClick(item, subItem.path)}
                    >
                      {subItem.label}
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

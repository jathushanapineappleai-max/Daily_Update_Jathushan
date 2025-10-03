import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin_panel/sidebar.css";

// Logo
import pineappleLogo from "../../assets/images/pineappleAI_logo.png";

// Sidebar icons (normal + green versions)
import homeIcon from "../../assets/icons/sidebar_home.png";
import homeIconGreen from "../../assets/icons/sidebar_home_green.png";
import aboutIcon from "../../assets/icons/sidebar_about.png";
import aboutIconGreen from "../../assets/icons/sidebar_about_green.png";
import servicesIcon from "../../assets/icons/sidebar_services.png";
import servicesIconGreen from "../../assets/icons/sidebar_services_green.png";
import productIcon from "../../assets/icons/sidebar_product.png";
import productIconGreen from "../../assets/icons/sidebar_product_green.png";
import blogIcon from "../../assets/icons/sidebar_blog.png";
import blogIconGreen from "../../assets/icons/sidebar_blog_green.png";
import contactIcon from "../../assets/icons/sidebar_contacts.png";
import contactIconGreen from "../../assets/icons/sidebar_contacts_green.png";
import careersIcon from "../../assets/icons/sidebar_careers.png";
import careersIconGreen from "../../assets/icons/sidebar_careers_green.png";
import logoutIcon from "../../assets/icons/sidebar_logout.png";
import logoutIconGreen from "../../assets/icons/sidebar_logout.png";

import dropdownIcon from "../../assets/icons/dropdown.png"; // PNG arrow

const navItems = [
  {
    id: "home",
    label: "Home",
    icon: homeIcon,
    iconGreen: homeIconGreen,
    dropdown: [
      { label: "Product Selection", path: "/admin/product-selection" },
      { label: "Client Review", path: "/admin/client-review" },
    ],
  },
  { id: "about", label: "About", icon: aboutIcon, iconGreen: aboutIconGreen, path: "/admin/team" },
  {
    id: "services",
    label: "Services",
    icon: servicesIcon,
    iconGreen: servicesIconGreen,
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
    iconGreen: productIconGreen,
    dropdown: [
      { label: "Company Projects", path: "/admin/company-projects" },
      { label: "Clients Projects", path: "/admin/clients-projects" },
    ],
  },
  {
    id: "blogs",
    label: "Blogs",
    icon: blogIcon,
    iconGreen: blogIconGreen,
    dropdown: [
      { label: "New Blog", path: "/admin/new-blog" },
      { label: "Posted Blogs", path: "/admin/posted-blogs" },
    ],
  },
  { id: "contact", label: "Contact", icon: contactIcon, iconGreen: contactIconGreen, path: "/admin/contact" },
  {
    id: "careers",
    label: "Careers",
    icon: careersIcon,
    iconGreen: careersIconGreen,
    dropdown: [
      { label: "New Jobs", path: "/admin/new-jobs" },
      { label: "Posted Jobs", path: "/admin/posted-jobs" },
      { label: "Applications", path: "/admin/applications" },
    ],
  },
  { id: "logout", label: "Logout", icon: logoutIcon, iconGreen: logoutIconGreen, path: "/admin/signin" },
];

// Sidebar component with forwardRef for external toggle
const Sidebar = forwardRef(({ sidebarOpen: sidebarOpenProp, setSidebarOpen: setSidebarOpenProp }, ref) => {
  const navigate = useNavigate();

  const [selected, setSelected] = useState("/admin/product-selection");
  const [openDropdowns, setOpenDropdowns] = useState({ home: true });
  const [internalOpen, setInternalOpen] = useState(false);

  const isMobile = window.innerWidth < 768;
  const sidebarOpen = sidebarOpenProp !== undefined ? sidebarOpenProp : internalOpen;
  const setSidebarOpen = setSidebarOpenProp || setInternalOpen;

  // Allow header to toggle sidebar
  useImperativeHandle(ref, () => ({
    toggleSidebar: () => setSidebarOpen((prev) => !prev),
  }));

  const handleNavClick = (item, subPath) => {
    const pathToNavigate = subPath || item.path;

    if (!pathToNavigate) {
      setOpenDropdowns((prev) => ({
        ...prev,
        [item.id]: !prev[item.id],
      }));
      return;
    }

    navigate(pathToNavigate);
    setSelected(pathToNavigate);

    if (item.dropdown) {
      setOpenDropdowns({ [item.id]: true });
    } else {
      setOpenDropdowns({});
    }

    if (isMobile) setSidebarOpen(false);
  };

  // Collapse sidebar when clicking outside (mobile only)
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (e) => {
      const sidebar = document.querySelector(".ap-sidebar");
      if (sidebar && !sidebar.contains(e.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSidebarOpen, isMobile]);

  return (
    <>
      {/* Sidebar container */}
      <aside className={`ap-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="ap-sidebar-logo">
          <img src={pineappleLogo} alt="PineappleAI Logo" />
          <h1>PineappleAI</h1>
        </div>

        <hr className="ap-sidebar-logo-divider" />

        {/* Navigation */}
        <nav className="ap-sidebar-nav">
          {navItems.map((item) => {
            const isActive =
              selected === item.path ||
              (item.dropdown && item.dropdown.some((sub) => sub.path === selected));

            return (
              <div key={item.id} className="ap-nav-wrapper">
                {/* Main Nav Item */}
                <button
                  onClick={() => handleNavClick(item)}
                  className={`ap-nav-item ${isActive ? "active" : ""}`}
                >
                  {item.icon && (
                    <img
                      src={isActive ? item.iconGreen : item.icon}
                      alt={`${item.label} icon`}
                      className="ap-nav-icon"
                    />
                  )}
                  <span>{item.label}</span>

                  {item.dropdown && (
                    <img
                      src={dropdownIcon}
                      alt="Dropdown"
                      className={`ap-dropdown-icon ${openDropdowns[item.id] ? "open" : ""}`}
                    />
                  )}
                </button>

                {/* Dropdown Items */}
                {item.dropdown && openDropdowns[item.id] && (
                  <div className="ap-dropdown">
                    {item.dropdown.map((subItem) => (
                      <button
                        key={subItem.path}
                        className={`ap-dropdown-item ${selected === subItem.path ? "active" : ""}`}
                        onClick={() => handleNavClick(item, subItem.path)}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
});

export default Sidebar;
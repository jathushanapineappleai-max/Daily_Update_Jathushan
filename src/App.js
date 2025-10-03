import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useRef } from "react";
import Sidebar from "./components/admin_panel/sidebar";
import AdminHeader from "./components/admin_panel/admin_header";

// Auth
import SignIn from "./pages/admin_panel/auth/signin";

// Sections
import ProductSelection from "./pages/admin_panel/sections/product_selection";
import ClientReview from "./pages/admin_panel/sections/client_review";
import Team from "./pages/admin_panel/sections/team";
import MainServices from "./pages/admin_panel/sections/main_services";
import TechStack from "./pages/admin_panel/sections/tech_stack";
import Industry from "./pages/admin_panel/sections/industry";
import CompanyProjects from "./pages/admin_panel/sections/company_projects";
import ClientsProjects from "./pages/admin_panel/sections/clients_projects";
import NewBlog from "./pages/admin_panel/sections/new_blog";
import PostedBlogs from "./pages/admin_panel/sections/posted_blogs";
import Contact from "./pages/admin_panel/sections/contact";
import NewJobs from "./pages/admin_panel/sections/new_jobs";
import PostedJobs from "./pages/admin_panel/sections/posted_jobs";
import Applications from "./pages/admin_panel/sections/applications";

import "./index.css";

export default function AdminApp() {
  // Sidebar ref allows header to control sidebar
  const sidebarRef = useRef();

  const toggleSidebar = () => {
    if (sidebarRef.current) sidebarRef.current.toggleSidebar();
  };

  return (
    <Router>
      <div className="admin-layout">
        {/* Sidebar with forwardRef */}
        <Sidebar ref={sidebarRef} />

        {/* Main content + Header */}
        <div className="admin-main">
          <AdminHeader onToggleSidebar={toggleSidebar} />

          {/* Routes */}
          <Routes>
            <Route path="/admin/signin" element={<SignIn />} />
            <Route path="/admin/product-selection" element={<ProductSelection />} />
            <Route path="/admin/client-review" element={<ClientReview />} />
            <Route path="/admin/team" element={<Team />} />
            <Route path="/admin/main-services" element={<MainServices />} />
            <Route path="/admin/tech-stack" element={<TechStack />} />
            <Route path="/admin/industry" element={<Industry />} />
            <Route path="/admin/company-projects" element={<CompanyProjects />} />
            <Route path="/admin/clients-projects" element={<ClientsProjects />} />
            <Route path="/admin/new-blog" element={<NewBlog />} />
            <Route path="/admin/posted-blogs" element={<PostedBlogs />} />
            <Route path="/admin/contact" element={<Contact />} />
            <Route path="/admin/new-jobs" element={<NewJobs />} />
            <Route path="/admin/posted-jobs" element={<PostedJobs />} />
            <Route path="/admin/applications" element={<Applications />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

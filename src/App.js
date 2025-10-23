import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
      <Routes>
        {/* Sign-in route without sidebar and header */}
        <Route path="/admin/signin" element={<SignIn />} />

        {/* Other routes with sidebar and header */}
        <Route
          path="/admin/*"
          element={
            <div className="admin-layout">
              <Sidebar ref={sidebarRef} />
              <div className="admin-main">
                <AdminHeader onToggleSidebar={toggleSidebar} />
                <Routes>
                  <Route path="product-selection" element={<ProductSelection />} />
                  <Route path="client-review" element={<ClientReview />} />
                  <Route path="team" element={<Team />} />
                  <Route path="main-services" element={<MainServices />} />
                  <Route path="tech-stack" element={<TechStack />} />
                  <Route path="industry" element={<Industry />} />
                  <Route path="company-projects" element={<CompanyProjects />} />
                  <Route path="clients-projects" element={<ClientsProjects />} />
                  <Route path="new-blog" element={<NewBlog />} />
                  <Route path="posted-blogs" element={<PostedBlogs />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="new-jobs" element={<NewJobs />} />
                  <Route path="posted-jobs" element={<PostedJobs />} />
                  <Route path="applications" element={<Applications />} />
                  {/* Redirect root /admin to signin if not authenticated */}
                  <Route path="/" element={<Navigate to="/admin/signin" replace />} />
                </Routes>
              </div>
            </div>
          }
        />
        {/* Redirect any unmatched route to signin */}
        <Route path="*" element={<Navigate to="/admin/signin" replace />} />
      </Routes>
    </Router>
  );
}
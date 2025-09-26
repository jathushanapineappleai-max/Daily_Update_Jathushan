import React from "react";
import "../../../styles/admin_panel/new_blog.css";

// Import admin panel shared components
import Sidebar from "../../../components/admin_panel/sidebar";
import AdminHeader from "../../../components/admin_panel/admin_header";

export default function NewBlog() {
  return (
 

        <div className="new_blog-section">
          <h2 className="section-title">New Blog Section</h2>
          <p className="section-desc">
            Here you can create and publish new blogs for PineappleAI.
          </p>
        </div>
  
  );
}
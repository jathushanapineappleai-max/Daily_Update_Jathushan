import React, { useEffect, useState } from "react";
import "../../../styles/admin_panel/posted_blogs.css";
import "../../../styles/admin_panel/viewmore_button.css";

// Import PNG icons
import EditIcon from "../../../assets/icons/Frame.png";
import DeleteIcon from "../../../assets/icons/Vector.png";

// Import ViewMoreButton
import ViewMoreButton from "../../../components/admin_panel/buttons/viewmore_button";

export default function PostedBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const staticBlogs = [
      { id: 1, title: "Design Principles", author: "S.Sanjeevan", date: "02 September 2025", category: "Web Design" },
      { id: 2, title: "UI/UX Best Practices", author: "A.Jathu", date: "05 September 2025", category: "UI/UX" },
      { id: 3, title: "Frontend Architecture", author: "M.Kumar", date: "10 September 2025", category: "Frontend" },
      { id: 4, title: "Color Psychology", author: "S.Sanjeevan", date: "12 September 2025", category: "Design" },
      { id: 5, title: "Wireframing Tips", author: "A.Jathu", date: "15 September 2025", category: "UI/UX" },
      { id: 6, title: "Modern Layouts", author: "M.Kumar", date: "18 September 2025", category: "Web Design" },
      { id: 7, title: "Responsive Patterns", author: "S.Sanjeevan", date: "20 September 2025", category: "Frontend" },
      { id: 8, title: "Microinteractions", author: "A.Jathu", date: "22 September 2025", category: "UI/UX" },
      { id: 9, title: "Usability Testing", author: "M.Kumar", date: "25 September 2025", category: "UX Research" },
    ];

    const savedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    setBlogs([...staticBlogs, ...savedBlogs]);
  }, []);

  const handleDelete = (id) => {
    const updatedBlogs = blogs.filter((b) => b.id !== id);
    setBlogs(updatedBlogs);

    const localBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const filteredLocal = localBlogs.filter((b) => b.id !== id);
    localStorage.setItem("blogs", JSON.stringify(filteredLocal));
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="posted-blogs-wrapper">
      {/* Header Row */}
      <div className="posted-blogs-header">
        <h1 className="posted-blogs-heading">Posted Blogs</h1>
        <div className="posted-blogs-search">
          <input
            type="text"
            placeholder="Search..."
            className="posted-blogs-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Blog Grid */}
      <div className="posted-blogs-list">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <div key={blog.id} className="posted-blog-card">
              <div className="blog-actions">
                <button className="edit-btn" title="Edit Blog">
                  <img src={EditIcon} alt="Edit" />
                </button>
                <button
                  className="delete-btn"
                  title="Delete Blog"
                  onClick={() => handleDelete(blog.id)}
                >
                  <img src={DeleteIcon} alt="Delete" />
                </button>
              </div>

              <h2 className="blog-title">{blog.title}</h2>
              <div className="blog-meta">
                <span className="blog-author">{blog.author}</span>
                <span className="blog-category">{blog.category}</span>
              </div>
              <p className="blog-date">{blog.date}</p>
            </div>
          ))
        ) : (
          <p style={{ color: "#AEB9E1", fontFamily: "Source Sans Pro" }}>
            No blogs found.
          </p>
        )}
      </div>

      {/* Divider below all blogs */}
      <hr
        style={{
          border: "0.6px solid #343B4F",
          width: "100%",
          maxWidth: "1308px",
          margin: "20px 0",
        }}
      />

      {/* View More Button aligned to right */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ViewMoreButton
          label="View More"
          onClick={() => alert("Load more blogs...")}
        />
      </div>
    </div>
  );
}

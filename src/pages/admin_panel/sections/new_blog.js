import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "../../../styles/admin_panel/new_blog.css";
import "../../../styles/admin_panel/custom_toolbar.css"; // Toolbar styling
import CustomToolbar from "../../../components/admin_panel/CustomToolbar";
import PostButton from "../../../components/admin_panel/buttons/post_button";

export default function NewBlog() {
  const [editorContent, setEditorContent] = useState("");

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  return (
    <div className="new-blog-wrapper">
      <h1 className="new-blog-heading">New Blog</h1>

      <div className="new-blog-section">
        {/* First Row */}
        <div className="form-grid">
          {/* Blog Title */}
          <div className="form-group">
            <label className="form-label">Blog Title</label>
            <input
              type="text"
              placeholder="Add a blog title"
              className="form-input"
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input">
              <option value="">Choose a category</option>
              <option value="web">Web Development</option>
              <option value="app">App Development</option>
              <option value="uiux">UI/UX Design</option>
              <option value="ai">AI/ML Development</option>
            </select>
          </div>

          {/* Author */}
          <div className="form-group">
            <label className="form-label">Author</label>
            <input
              type="text"
              placeholder="Add an author name"
              className="form-input"
            />
          </div>
        </div>

        {/* Second Row - Description / Tags */}
        <div className="form-group full-width">
          <label className="form-label">Tags</label>
          <textarea
            className="form-textarea"
            placeholder="Write blog description..."
          ></textarea>
        </div>

        {/* Editor Container */}
        <div className="editor-outer-container">
          <CustomToolbar />
          <ReactQuill
            value={editorContent}
            onChange={handleEditorChange}
            modules={{
              toolbar: {
                container: "#custom-toolbar",
                handlers: {
                  pin: () => alert("Document pinned!"),
                },
              },
            }}
            formats={[
              "font",
              "size",
              "bold",
              "italic",
              "underline",
              "strike",
              "color",
              "background",
              "list",
              "align",
              "script",
              "image",
            ]}
            placeholder="Start writing your blog here..."
            className="blog-editor"
          />
        </div>

        {/* Post Button */}
        <div className="form-actions">
          <PostButton />
        </div>
      </div>
    </div>
  );
}

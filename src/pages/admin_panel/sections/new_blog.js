import React, { useState } from "react";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "../../../styles/admin_panel/new_blog.css";
import "../../../styles/admin_panel/custom_toolbar.css";
import CustomToolbar from "../../../components/admin_panel/CustomToolbar";
import PostButton from "../../../components/admin_panel/buttons/post_button";

export default function NewBlog() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [editorContent, setEditorContent] = useState("");

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handlePost = () => {
    if (!title || !category || !author) {
      alert("Please fill all required fields!");
      return;
    }

    const newBlog = {
      id: Date.now(),
      title,
      category,
      author,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      tags,
      content: editorContent,
    };

    // Get existing blogs
    const existingBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    // Add new one
    const updatedBlogs = [...existingBlogs, newBlog];
    // Save to localStorage
    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));

    alert("Blog saved successfully!");

    // Reset form
    setTitle("");
    setCategory("");
    setAuthor("");
    setTags("");
    setEditorContent("");
  };

  return (
    <div className="new-blog-wrapper">
      <h1 className="new-blog-heading">New Blog</h1>

      <div className="new-blog-section">
        {/* First Row */}
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Blog Title</label>
            <input
              type="text"
              placeholder="Add a blog title"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Choose a category</option>
              <option value="Web Development">Web Development</option>
              <option value="App Development">App Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="AI/ML Development">AI/ML Development</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Author</label>
            <input
              type="text"
              placeholder="Add an author name"
              className="form-input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="form-group full-width">
          <label className="form-label">Tags</label>
          <textarea
            className="form-textarea"
            placeholder="Write blog description..."
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          ></textarea>
        </div>

        {/* Editor */}
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
          <PostButton onClick={handlePost} />
        </div>
      </div>
    </div>
  );
}
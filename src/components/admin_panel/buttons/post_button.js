import React from "react";
import "../../../styles/admin_panel/post_button.css";

export default function PostButton({ label = "Post", onClick }) {
  return (
    <button className="post_button-btn" onClick={onClick}>
      {label}
    </button>
  );
}

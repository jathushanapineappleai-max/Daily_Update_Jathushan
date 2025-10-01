import React, { useState } from "react";
import "../../../styles/admin_panel/new_blog.css";

import PostButton from "../../../components/admin_panel/buttons/post_button";
import UpdateButton from "../../../components/admin_panel/buttons/update_button";
import AddEmployeeButton from "../../../components/admin_panel/buttons/add_employee_button";
import SummitButton from "../../../components/admin_panel/buttons/summit_button";
import ViewMoreButton from "../../../components/admin_panel/buttons/viewmore_button";
import DownloadCVButton from "../../../components/admin_panel/buttons/download_cv";
import Popup from "../../../components/admin_panel/popups/success";

// Higher-order component to automatically wrap any button with popup functionality
const withPopup = (ButtonComponent, defaultTitle, defaultMessage) => {
  return ({ ...props }) => {
    const [showPopup, setShowPopup] = useState(false);

    const handleClick = () => {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);

      if (props.onClick) props.onClick(); // preserve original onClick if exists
    };

    return (
      <>
        <ButtonComponent {...props} onClick={handleClick} />
        {showPopup && (
          <div className="popup-container">
            <Popup title={defaultTitle} message={defaultMessage} />
          </div>
        )}
      </>
    );
  };
};

// Wrap buttons with the popup HOC
const PostButtonWithPopup = withPopup(
  PostButton,
  "Post Success!",
  "Your blog has been posted successfully."
);
const UpdateButtonWithPopup = withPopup(
  UpdateButton,
  "Update Success!",
  "The blog has been updated successfully."
);
const AddEmployeeButtonWithPopup = withPopup(
  AddEmployeeButton,
  "Employee Added!",
  "A new employee has been successfully added."
);
const SummitButtonWithPopup = withPopup(
  SummitButton,
  "Submitted!",
  "Your form has been submitted successfully."
);
const ViewMoreButtonWithPopup = withPopup(
  ViewMoreButton,
  "Viewed!",
  "You are viewing more details."
);
const DownloadCVButtonWithPopup = withPopup(
  DownloadCVButton,
  "Downloaded!",
  "The CV has been downloaded successfully."
);

export default function NewBlog() {
  return (
    <div className="new_blog-section">
      <h2 className="section-title">New Blog Section</h2>
      <p className="section-desc">
        Here you can create and publish new blogs for PineappleAI.
      </p>

      <div className="button-row">
        <PostButtonWithPopup label="Post" />
        <UpdateButtonWithPopup label="Update" />
        <AddEmployeeButtonWithPopup label="Add Employee" />
        <SummitButtonWithPopup label="Submit" />
        <ViewMoreButtonWithPopup label="View more" />
        <DownloadCVButtonWithPopup label="Download CV" />
      </div>
    </div>
  );
}

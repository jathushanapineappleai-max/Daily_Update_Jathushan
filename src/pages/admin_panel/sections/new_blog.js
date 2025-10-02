import React, { useState } from "react";
import "../../../styles/admin_panel/new_blog.css";

import PostButton from "../../../components/admin_panel/buttons/post_button";
import UpdateButton from "../../../components/admin_panel/buttons/update_button";
import AddEmployeeButton from "../../../components/admin_panel/buttons/add_employee_button";
import SummitButton from "../../../components/admin_panel/buttons/summit_button";
import ViewMoreButton from "../../../components/admin_panel/buttons/viewmore_button";
import DownloadCVButton from "../../../components/admin_panel/buttons/download_cv";

// ✅ Import Popup Variants
import Popup from "../../../components/admin_panel/popups/success"; // Success popup
import DeleteConfirmPopup from "../../../components/admin_panel/popups/delete_confirm"; // Confirm popup
import DeletePopup from "../../../components/admin_panel/popups/delete"; // Delete popup

// 🗑️ Import Trash Icon
import trashIcon from "../../../assets/icons/Vector.png";

// ✅ Popup Wrapper for other buttons only
const withPopup = (ButtonComponent, defaultTitle, defaultMessage) => {
  return ({ ...props }) => {
    const [showPopup, setShowPopup] = useState(false);

    const handleClick = () => {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      if (props.onClick) props.onClick();
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

// ✅ Wrap only other buttons
const PostButtonWithPopup = withPopup(PostButton, "Post Success!", "Your blog has been posted successfully.");
const UpdateButtonWithPopup = withPopup(UpdateButton, "Update Success!", "The blog has been updated successfully.");
const AddEmployeeButtonWithPopup = withPopup(AddEmployeeButton, "Employee Added!", "A new employee has been successfully added.");
const SummitButtonWithPopup = withPopup(SummitButton, "Submitted!", "Your form has been submitted successfully.");
const ViewMoreButtonWithPopup = withPopup(ViewMoreButton, "Viewed!", "You are viewing more details.");
const DownloadCVButtonWithPopup = withPopup(DownloadCVButton, "Downloaded!", "The CV has been downloaded successfully.");

export default function NewBlog() {
  // ✅ Popup States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  // ✅ Handlers
  const handleTrashClick = () => {
    setShowDeleteConfirm(true); // Step 1: open confirm popup
  };

  // Step 2: Confirm delete → open delete popup
  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    setShowDeletePopup(true);
  };

  // Step 3: After delete popup → show success
  const handleDeleteComplete = () => {
    setShowDeletePopup(false);
    setShowDeleteSuccess(true);
    setTimeout(() => setShowDeleteSuccess(false), 3000);
  };

  // Cancel confirm popup
  const handleCloseConfirm = () => {
    setShowDeleteConfirm(false);
  };

  // Close delete popup
  const handleCloseDeletePopup = () => {
    setShowDeletePopup(false);
  };

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

        {/* 🗑️ Trash Icon */}
        <button className="trash-icon-btn" onClick={handleTrashClick}>
          <img src={trashIcon} alt="Delete" className="trash-icon" />
        </button>
      </div>

      {/* ⚠️ Delete Confirm Popup */}
      {showDeleteConfirm && (
        <div className="popup-overlay">
          <DeleteConfirmPopup
            onClose={handleCloseConfirm}
            onConfirm={handleConfirmDelete}
          />
        </div>
      )}

      {/* 🗑️ Delete Popup */}
      {showDeletePopup && (
        <div className="popup-overlay">
          <DeletePopup
            onClose={handleCloseDeletePopup}
            onDeleteComplete={handleDeleteComplete}
          />
        </div>
      )}

      {/* ✅ Delete Success Popup */}
      {showDeleteSuccess && (
        <div className="popup-container">
          <Popup title="Deleted!" message="The item has been deleted successfully." />
        </div>
      )}
    </div>
  );
}

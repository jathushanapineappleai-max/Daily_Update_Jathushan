import React, { useState } from "react";
import uploadIcon from "../../../assets/icons/upload.png";
import editIconImg from "../../../assets/icons/Frame.png";
import deleteIcon from "../../../assets/icons/Vector.png";
import SummitButton from "../../../components/admin_panel/buttons/summit_button";
import "../../../styles/admin_panel/company_projects.css";
import Popup from "../../../components/admin_panel/popups/success";
import DeleteConfirmPopup from "../../../components/admin_panel/popups/delete_confirm";
import DeletePopup from "../../../components/admin_panel/popups/delete";

export default function CompanyProjects() {
  const [projectName, setProjectName] = useState("");
  const [caption, setCaption] = useState("");
  const [googleLink, setGoogleLink] = useState("");
  const [appLink, setAppLink] = useState("");
  const [description, setDescription] = useState("");
  const [projectPhoto, setProjectPhoto] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [activeBox, setActiveBox] = useState("");
  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});

  // Popups
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Edit Modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);

  /* File Handling */
  const handleFileChange = (e, setter, fieldName) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "Only JPG or PNG files are allowed.",
        }));
        return;
      }
      setter(file);
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
    setActiveBox("");
  };

  const handleBoxClick = (id) => {
    setActiveBox(id);
    document.getElementById(id).click();
    setTimeout(() => setActiveBox(""), 800);
  };

  /* Validation */
  const validateForm = () => {
    const newErrors = {};
    if (!projectName.trim()) newErrors.projectName = "Project name is required.";
    if (!caption.trim()) newErrors.caption = "Caption is required.";
    if (!projectPhoto)
      newErrors.projectPhoto = "Please upload a project photo (JPG or PNG).";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* Add Project */
  const handleSubmit = () => {
    if (!validateForm()) return;
    const newProject = {
      id: Date.now(),
      name: projectName,
      caption,
      googleLink,
      appLink,
      description,
      projectPhoto: projectPhoto ? projectPhoto.name : "IMGProject.png",
      qrCode: qrCode ? qrCode.name : "Upload QR Code",
    };
    setProjects((prev) => [...prev, newProject]);
    setProjectName("");
    setCaption("");
    setGoogleLink("");
    setAppLink("");
    setDescription("");
    setProjectPhoto(null);
    setQrCode(null);
    setErrors({});
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 2500);
  };

  /* Delete */
  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget));
      setShowDeletePopup(false);
      setDeleteTarget(null);
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 2500);
    }
  };

  /* Edit */
  const handleEditClick = (proj) => {
    setEditData(proj);
    setEditModalVisible(true);
  };

  const handleUpdateProject = () => {
    setProjects((prev) =>
      prev.map((p) => (p.id === editData.id ? { ...p, ...editData } : p))
    );
    setEditModalVisible(false);
  };

  return (
    <div className="cp-content">
      <h2 className="cp-heading">Company Projects</h2>

      {/* Form Section */}
      <div className="cp-container">
        <div className="cp-form-grid">
          {/* Project Name */}
          <div className="cp-form-group">
            <label className="cp-label">Project Name</label>
            <input
              type="text"
              placeholder="Add project name"
              className={`cp-input ${errors.projectName ? "input-error" : ""}`}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            {errors.projectName && (
              <small className="error-text">{errors.projectName}</small>
            )}
          </div>

          {/* Caption */}
          <div className="cp-form-group">
            <label className="cp-label">Caption</label>
            <input
              type="text"
              placeholder="Write a short caption"
              className={`cp-input ${errors.caption ? "input-error" : ""}`}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            {errors.caption && (
              <small className="error-text">{errors.caption}</small>
            )}
          </div>

          {/* Project Photo */}
          <div className="cp-form-group">
            <label className="cp-label">Project Photo (JPG/PNG)</label>
            <input
              type="file"
              id="project-photo"
              style={{ display: "none" }}
              accept=".jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, setProjectPhoto, "projectPhoto")}
            />
            <div
              className={`cp-upload-box ${activeBox === "project-photo" ? "active" : ""}`}
              onClick={() => handleBoxClick("project-photo")}
            >
              <span className="cp-upload-placeholder">
                {projectPhoto ? projectPhoto.name : "Upload project photo"}
              </span>
              <img src={uploadIcon} alt="Upload" className="cp-upload-icon" />
            </div>
            {errors.projectPhoto && (
              <small className="error-text">{errors.projectPhoto}</small>
            )}
          </div>

          {/* Google Link */}
          <div className="cp-form-group">
            <label className="cp-label">Google Play Link</label>
            <input
              type="text"
              placeholder="Add Google Play Store URL"
              className="cp-input"
              value={googleLink}
              onChange={(e) => setGoogleLink(e.target.value)}
            />
          </div>

          {/* App Store Link */}
          <div className="cp-form-group">
            <label className="cp-label">App Store Link</label>
            <input
              type="text"
              placeholder="Add App Store URL"
              className="cp-input"
              value={appLink}
              onChange={(e) => setAppLink(e.target.value)}
            />
          </div>

          {/* QR Code */}
          <div className="cp-form-group">
            <label className="cp-label">QR Code</label>
            <input
              type="file"
              id="qr-code"
              style={{ display: "none" }}
              accept=".jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, setQrCode, "qrCode")}
            />
            <div
              className={`cp-upload-box ${activeBox === "qr-code" ? "active" : ""}`}
              onClick={() => handleBoxClick("qr-code")}
            >
              <span className="cp-upload-placeholder">
                {qrCode ? qrCode.name : "Upload QR Code"}
              </span>
              <img src={uploadIcon} alt="Upload" className="cp-upload-icon" />
            </div>
          </div>
        </div>

        <div className="cp-form-group cp-description-group">
          <label className="cp-label">Description</label>
          <textarea
            className="cp-textarea"
            placeholder="Write a description about the company project"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <hr className="cp-divider" />
        <div className="cp-actions">
          <SummitButton label="Submit" onClick={handleSubmit} />
        </div>
      </div>

      {/* Table Section */}
      <div className="cp-second-container">
        <h2 className="cp-table-heading">All Company Projects</h2>
        <div className="cp-table-wrapper">
          <table className="cp-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Caption</th>
                <th>Google Play Link</th>
                <th>App Store Link</th>
                <th>QR Code</th>
                <th>Description</th>
                <th style={{ textAlign: "right", paddingRight: "30px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj.id}>
                  <td>{proj.name}</td>
                  <td>{proj.caption}</td>
                  <td>{proj.googleLink}</td>
                  <td>{proj.appLink}</td>
                  <td>{proj.qrCode}</td>
                  <td>{proj.description}</td>
                  <td className="cp-action-buttons">
                    <button
                      className="cp-icon-btn"
                      title="Edit"
                      onClick={() => handleEditClick(proj)}
                    >
                      <img src={editIconImg} alt="Edit" className="cp-action-icon" />
                    </button>
                    <button
                      className="cp-icon-btn"
                      title="Delete"
                      onClick={() => handleDeleteClick(proj.id)}
                    >
                      <img src={deleteIcon} alt="Delete" className="cp-action-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== EDIT MODAL ===== */}
      {editModalVisible && editData && (
        <div className="cp-modal-overlay" onClick={() => setEditModalVisible(false)}>
          <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="cp-modal-heading">Edit Company Project</h3>

            <div className="cp-modal-field">
              <label>Project Name</label>
              <input
                type="text"
                value={editData.name || ""}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
            </div>

            <div className="cp-modal-field">
              <label>Caption</label>
              <input
                type="text"
                value={editData.caption || ""}
                onChange={(e) => setEditData({ ...editData, caption: e.target.value })}
              />
            </div>

            <div className="cp-modal-field">
              <label>Description</label>
              <textarea
                value={editData.description || ""}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              />
            </div>

            <hr className="cp-modal-divider" />

            <div className="cp-modal-actions">
              <button type="button" onClick={handleUpdateProject}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popups */}
      {showSuccessPopup && (
        <Popup title="Company Project Added!" message="New company project added successfully." />
      )}
      {showDeleteSuccess && (
        <DeletePopup title="Deleted!" message="Company project deleted successfully." />
      )}
      {showDeletePopup && (
        <DeleteConfirmPopup
          onClose={() => setShowDeletePopup(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
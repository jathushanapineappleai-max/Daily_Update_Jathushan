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

  // Popups
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Edit Modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);

  /* File Handlers */
  const handleFileChange = (e, setter) => {
    const file = e.target.files?.[0];
    if (file) setter(file);
    setActiveBox("");
  };

  const handleBoxClick = (id) => {
    setActiveBox(id);
    document.getElementById(id).click();
    setTimeout(() => setActiveBox(""), 800);
  };

  /* Add Project */
  const handleSubmit = () => {
    if (!projectName || !caption) {
      alert("Please fill in required fields!");
      return;
    }

    const newProject = {
      id: Date.now(),
      name: projectName,
      caption,
      googleLink,
      appLink,
      description,
      projectPhoto: projectPhoto
        ? projectPhoto.name
        : "IMGProject.png",
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
      setProjects((prev) => prev.filter((proj) => proj.id !== deleteTarget));
      setShowDeletePopup(false);
      setDeleteTarget(null);
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 2500);
    }
  };
  const handleCancelDelete = () => setShowDeletePopup(false);

  /* Edit */
  const handleEditClick = (proj) => {
    setEditData(proj);
    setEditModalVisible(true);
  };
  const handleUpdateProject = () => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === editData.id ? { ...proj, ...editData } : proj
      )
    );
    setEditModalVisible(false);
  };

  /* Render */
  return (
    <div className="cp-content">
      <h2 className="cp-heading">Company Projects</h2>

      {/* =================== FORM =================== */}
      <div className="cp-container">
        <div className="cp-form-grid">
          <div className="cp-form-group">
            <label className="cp-label">Project Name</label>
            <input
              type="text"
              placeholder="Add project name"
              className="cp-input"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="cp-form-group">
            <label className="cp-label">Caption</label>
            <input
              type="text"
              placeholder="Write a short caption"
              className="cp-input"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <div className="cp-form-group">
            <label className="cp-label">Project Photo</label>
            <input
              type="file"
              id="project-photo"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, setProjectPhoto)}
            />
            <div
              className={`cp-upload-box ${
                activeBox === "project-photo" ? "active" : ""
              }`}
              onClick={() => handleBoxClick("project-photo")}
            >
              <span className="cp-upload-placeholder">
                {projectPhoto ? projectPhoto.name : "Upload project photo"}
              </span>
              <img src={uploadIcon} alt="Upload" className="cp-upload-icon" />
            </div>
          </div>

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

          <div className="cp-form-group">
            <label className="cp-label">QR Code</label>
            <input
              type="file"
              id="qr-code"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, setQrCode)}
            />
            <div
              className={`cp-upload-box ${
                activeBox === "qr-code" ? "active" : ""
              }`}
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

      {/* =================== TABLE =================== */}
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
                <th>Action</th>
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
                      <img
                        src={editIconImg}
                        alt="Edit"
                        className="cp-action-icon small-icon"
                      />
                    </button>
                    <button
                      className="cp-icon-btn"
                      title="Delete"
                      onClick={() => handleDeleteClick(proj.id)}
                    >
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        className="cp-action-icon small-icon"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================== EDIT MODAL =================== */}
      {editModalVisible && (
        <div className="cp-modal-overlay">
          <div className="cp-modal">
            <h2 className="cp-modal-heading">Edit Project</h2>

            <div className="cp-modal-field">
              <label>Project Name</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
            </div>

            <div className="cp-modal-field">
              <label>Caption</label>
              <input
                type="text"
                value={editData.caption}
                onChange={(e) =>
                  setEditData({ ...editData, caption: e.target.value })
                }
              />
            </div>

            <div className="cp-modal-field">
              <label>Project Photo</label>
              <div className="cp-upload-box">
                <span className="cp-upload-placeholder">
                  {editData.projectPhoto}
                </span>
                <img src={uploadIcon} alt="Upload" className="cp-upload-icon" />
              </div>
            </div>

            <div className="cp-modal-field">
              <label>Google Play Link</label>
              <input
                type="text"
                value={editData.googleLink}
                onChange={(e) =>
                  setEditData({ ...editData, googleLink: e.target.value })
                }
              />
            </div>

            <div className="cp-modal-field">
              <label>App Store Link</label>
              <input
                type="text"
                value={editData.appLink}
                onChange={(e) =>
                  setEditData({ ...editData, appLink: e.target.value })
                }
              />
            </div>

            <div className="cp-modal-field">
              <label>QR Code</label>
              <div className="cp-upload-box">
                <span className="cp-upload-placeholder">
                  {editData.qrCode}
                </span>
                <img src={uploadIcon} alt="Upload" className="cp-upload-icon" />
              </div>
            </div>

            <div className="cp-modal-field">
              <label>Description</label>
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              ></textarea>
            </div>

            <hr className="cp-modal-divider" />

            <div className="cp-modal-actions">
              <button onClick={handleUpdateProject}>Update</button>
            </div>
          </div>
        </div>
      )}

      {/* =================== POPUPS =================== */}
      {showSuccessPopup && (
        <Popup
          title="Company Project Added!"
          message="New company project added successfully."
        />
      )}
      {showDeleteSuccess && (
        <DeletePopup
          title="Deleted!"
          message="Company project deleted successfully."
        />
      )}
      {showDeletePopup && (
        <DeleteConfirmPopup
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
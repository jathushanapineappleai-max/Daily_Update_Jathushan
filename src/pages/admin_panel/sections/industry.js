import React, { useState, useRef } from "react";
import uploadIcon from "../../../assets/icons/upload.png";
import editIcon from "../../../assets/icons/Frame.png";
import deleteIcon from "../../../assets/icons/Vector.png";
import SummitButton from "../../../components/admin_panel/buttons/summit_button";
import UpdateButton from "../../../components/admin_panel/buttons/update_button";
import "../../../styles/admin_panel/industry.css";

// ✅ Popups
import Popup from "../../../components/admin_panel/popups/success"; // green success popup
import DeleteConfirmPopup from "../../../components/admin_panel/popups/delete_confirm"; // confirm box
import DeletePopup from "../../../components/admin_panel/popups/delete"; // red delete success popup

export default function Industry() {
  const [industryName, setIndustryName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [industries, setIndustries] = useState([]);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editIndustry, setEditIndustry] = useState(null);
  const [editName, setEditName] = useState("");
  const [editFile, setEditFile] = useState(null);

  // ✅ Popup States
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Refs
  const mainFileInputRef = useRef(null);
  const modalFileInputRef = useRef(null);

  /* ========================================================= */
  /*                     FILE HANDLING                         */
  /* ========================================================= */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      e.target.value = "";
    }
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFile(file);
      e.target.value = "";
    }
  };

  /* ========================================================= */
  /*                     ADD INDUSTRY                          */
  /* ========================================================= */
  const handleSubmit = () => {
    if (!industryName) return;

    const newIndustry = {
      id: Date.now(),
      name: industryName,
      image: selectedFile
        ? URL.createObjectURL(selectedFile)
        : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    };

    setIndustries([...industries, newIndustry]);
    setIndustryName("");
    setSelectedFile(null);

    // ✅ Show success popup
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 2500);
  };

  /* ========================================================= */
  /*                     EDIT INDUSTRY                         */
  /* ========================================================= */
  const handleEdit = (industry) => {
    setEditIndustry(industry);
    setEditName(industry.name);
    setEditFile(null);
    setShowModal(true);
  };

  const handleUpdate = () => {
    const updated = industries.map((item) =>
      item.id === editIndustry.id
        ? {
            ...item,
            name: editName,
            image: editFile ? URL.createObjectURL(editFile) : item.image,
          }
        : item
    );
    setIndustries(updated);
    setShowModal(false);
  };

  /* ========================================================= */
  /*                     DELETE INDUSTRY                       */
  /* ========================================================= */
  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setIndustries((prev) => prev.filter((item) => item.id !== deleteTarget));
      setShowDeletePopup(false);
      setDeleteTarget(null);

      // ✅ Show red delete popup
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 2500);
    }
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setDeleteTarget(null);
  };

  /* ========================================================= */
  /*                          RENDER                           */
  /* ========================================================= */
  return (
    <div className="industry-section">
      <div className="industry-content">
        <div className="industry-wrapper">
          <h2 className="industry-heading">Industries</h2>

          {/* ================= FORM ================= */}
          <div className="industry-container">
            <div className="form-row">
              {/* Industry Name */}
              <div className="form-group">
                <label className="category-tag">Industry</label>
                <input
                  type="text"
                  className="industry-input"
                  placeholder="Add industry name"
                  value={industryName}
                  onChange={(e) => setIndustryName(e.target.value)}
                />
              </div>

              {/* Upload */}
              <div className="form-group">
                <label className="category-tag">Image</label>
                <input
                  type="file"
                  ref={mainFileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <div
                  className="upload-box"
                  onClick={() =>
                    mainFileInputRef.current && mainFileInputRef.current.click()
                  }
                >
                  <span className="upload-placeholder">
                    {selectedFile ? selectedFile.name : "Upload an image"}
                  </span>
                  <img src={uploadIcon} alt="Upload" className="upload-icon" />
                </div>
              </div>
            </div>

            <hr className="form-divider" />

            <div className="form-actions">
              <SummitButton label="Submit" onClick={handleSubmit} />
            </div>
          </div>

          {/* ================= TABLE ================= */}
          <div className="industry-list-container">
            <div className="industry-list-header">
              <span>All Industries</span>
              <span className="industry-count">
                {industries.length > 0
                  ? `1 - ${industries.length} of ${industries.length}`
                  : "0"}
              </span>
            </div>

            <table className="industry-table">
              <thead>
                <tr>
                  <th>Industry</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {industries.map((item) => (
                  <tr key={item.id}>
                    <td className="industry-cell">
                      <img
                        src={item.image}
                        alt="Industry"
                        className="industry-avatar"
                      />
                      <span>{item.name}</span>
                    </td>
                    <td>
                      <div className="industry-actions">
                        <img
                          src={editIcon}
                          alt="Edit"
                          className="action-icon edit"
                          onClick={() => handleEdit(item)}
                        />
                        <img
                          src={deleteIcon}
                          alt="Delete"
                          className="action-icon delete"
                          onClick={() => handleDeleteClick(item.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= POPUPS ================= */}
          {showSuccessPopup && (
            <div className="popup-container">
              <Popup
                title="Industry Added!"
                message="New industry has been successfully added."
              />
            </div>
          )}

          {showDeleteSuccess && (
            <div className="popup-container">
              <DeletePopup
                title="Deleted!"
                message="Industry deleted successfully."
              />
            </div>
          )}

          {showDeletePopup && (
            <DeleteConfirmPopup
              onClose={handleCancelDelete}
              onConfirm={handleConfirmDelete}
            />
          )}

          {/* ================= MODAL ================= */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h2 className="modal-heading">Edit Industry</h2>

                <div className="modal-field">
                  <label>Industry</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div className="modal-field">
                  <label>Image</label>
                  <input
                    type="file"
                    ref={modalFileInputRef}
                    style={{ display: "none" }}
                    onChange={handleEditFileChange}
                  />
                  <div
                    className="upload-box"
                    onClick={() =>
                      modalFileInputRef.current &&
                      modalFileInputRef.current.click()
                    }
                  >
                    <span className="upload-placeholder">
                      {editFile
                        ? editFile.name
                        : editIndustry?.image
                        ? "Current Image"
                        : "Upload Image"}
                    </span>
                    <img
                      src={uploadIcon}
                      alt="Upload"
                      className="upload-icon"
                    />
                  </div>
                </div>

                <hr className="modal-divider" />

                <div className="modal-actions">
                  <UpdateButton label="Update" onClick={handleUpdate} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
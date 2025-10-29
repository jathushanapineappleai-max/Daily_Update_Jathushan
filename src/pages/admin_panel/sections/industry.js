import React, { useState, useRef } from "react";
import uploadIcon from "../../../assets/icons/upload.png";
import editIcon from "../../../assets/icons/Frame.png";
import deleteIcon from "../../../assets/icons/Vector.png";
import SummitButton from "../../../components/admin_panel/buttons/summit_button";
import UpdateButton from "../../../components/admin_panel/buttons/update_button";
import "../../../styles/admin_panel/industry.css";

// Popups
import Popup from "../../../components/admin_panel/popups/success";
import DeleteConfirmPopup from "../../../components/admin_panel/popups/delete_confirm";
import DeletePopup from "../../../components/admin_panel/popups/delete";

export default function Industry() {
  const [industryName, setIndustryName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [errors, setErrors] = useState({});

  // Popups
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editIndustry, setEditIndustry] = useState(null);
  const [editName, setEditName] = useState("");
  const [editFile, setEditFile] = useState(null);

  const mainFileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  /* ========================================================= */
  /* VALIDATION + FILE HANDLING                                */
  /* ========================================================= */
  const validateForm = () => {
    const newErrors = {};
    if (!industryName.trim()) newErrors.industryName = "Industry name is required.";
    if (!selectedFile) newErrors.image = "Please upload an image (JPG or PNG).";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Only JPG or PNG files are allowed.",
        }));
        return;
      }
      setSelectedFile(file);
      setErrors((prev) => ({ ...prev, image: "" }));
      e.target.value = "";
    }
  };

  /* ========================================================= */
  /* ADD INDUSTRY                                              */
  /* ========================================================= */
  const handleAddIndustry = () => {
    if (!validateForm()) return;
    const newIndustry = {
      id: Date.now(),
      name: industryName,
      image: URL.createObjectURL(selectedFile),
    };
    setIndustries([...industries, newIndustry]);
    setIndustryName("");
    setSelectedFile(null);
    setErrors({});
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 2500);
  };

  /* ========================================================= */
  /* EDIT INDUSTRY                                             */
  /* ========================================================= */
  const handleEdit = (industry) => {
    setEditIndustry(industry);
    setEditName(industry.name);
    setEditFile(null);
    setShowModal(true);
  };

  const handleUpdate = () => {
    if (!editName.trim()) return;
    const updatedList = industries.map((item) =>
      item.id === editIndustry.id
        ? {
            ...item,
            name: editName,
            image: editFile ? URL.createObjectURL(editFile) : item.image,
          }
        : item
    );
    setIndustries(updatedList);
    setShowModal(false);
  };

  /* ========================================================= */
  /* DELETE INDUSTRY                                           */
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
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 2500);
    }
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setDeleteTarget(null);
  };

  /* ========================================================= */
  /* RENDER                                                    */
  /* ========================================================= */
  return (
    <div className="industry-section">
      <div className="main-content">
        <div className="industry-wrapper">
          <h2 className="industry-heading">Industries</h2>

          {/* ================== FORM SECTION ================== */}
          <div className="big-container">
            <div className="form-row">
              {/* Industry Name */}
              <div className="form-group">
                <label className="category-tag">Industry</label>
                <input
                  type="text"
                  className={`industry-input ${errors.industryName ? "input-error" : ""}`}
                  placeholder="Enter industry name"
                  value={industryName}
                  onChange={(e) => setIndustryName(e.target.value)}
                />
                {errors.industryName && (
                  <small className="error-text">{errors.industryName}</small>
                )}
              </div>

              {/* Upload Image */}
              <div className="form-group">
                <label className="category-tag">Image (JPG or PNG)</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  ref={mainFileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <div
                  className={`upload-box ${errors.image ? "upload-error" : ""}`}
                  onClick={() =>
                    mainFileInputRef.current && mainFileInputRef.current.click()
                  }
                >
                  <span className="upload-placeholder">
                    {selectedFile ? selectedFile.name : "Upload an image"}
                  </span>
                  <img src={uploadIcon} alt="Upload" className="upload-icon" />
                </div>
                {errors.image && <small className="error-text">{errors.image}</small>}
              </div>
            </div>

            <hr className="form-divider" />
            <div className="form-actions">
              <SummitButton label="Submit" onClick={handleAddIndustry} />
            </div>
          </div>

          {/* ================== TABLE SECTION ================== */}
          <div className="second-container">
            <div className="industry-list-header">
              <h2 className="table-heading">All Industries</h2>
              <span className="industry-count">{industries.length}</span>
            </div>
            <div className="table-wrapper">
              <table className="industry-table">
                <thead>
                  <tr>
                    <th>Industry</th>
                    <th className="action-col">Action</th>
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
                      <td className="action-col">
                        <div className="action-buttons">
                          <button
                            className="icon-btn"
                            title="Edit"
                            onClick={() => handleEdit(item)}
                          >
                            <img src={editIcon} alt="Edit" className="action-icon" />
                          </button>
                          <button
                            className="icon-btn"
                            title="Delete"
                            onClick={() => handleDeleteClick(item.id)}
                          >
                            <img src={deleteIcon} alt="Delete" className="action-icon" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ================== POPUPS ================== */}
          {showSuccessPopup && (
            <Popup title="Industry Added!" message="Industry added successfully." />
          )}
          {showDeleteSuccess && (
            <DeletePopup title="Deleted!" message="Industry deleted successfully." />
          )}
          {showDeletePopup && (
            <DeleteConfirmPopup
              onClose={handleCancelDelete}
              onConfirm={handleConfirmDelete}
            />
          )}

          {/* ================== EDIT MODAL ================== */}
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
                  <label>Image (JPG or PNG)</label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    ref={editFileInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setEditFile(file);
                      e.target.value = "";
                    }}
                  />
                  <div
                    className="upload-box"
                    onClick={() =>
                      editFileInputRef.current && editFileInputRef.current.click()
                    }
                  >
                    <span className="upload-placeholder">
                      {editFile
                        ? editFile.name
                        : editIndustry?.image
                        ? "Current Image"
                        : "Upload image"}
                    </span>
                    <img src={uploadIcon} alt="Upload" className="upload-icon" />
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
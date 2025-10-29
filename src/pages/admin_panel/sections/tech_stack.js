import React, { useState, useRef } from "react";
import uploadIcon from "../../../assets/icons/upload.png";
import dropdownArrow from "../../../assets/icons/dropdownOption.png";
import editIcon from "../../../assets/icons/Frame.png";
import deleteIcon from "../../../assets/icons/Vector.png";
import "../../../styles/admin_panel/tech_stack.css";

import SummitButton from "../../../components/admin_panel/buttons/summit_button";
import UpdateButton from "../../../components/admin_panel/buttons/update_button";
import Popup from "../../../components/admin_panel/popups/success";
import DeletePopup from "../../../components/admin_panel/popups/delete";
import DeleteConfirmPopup from "../../../components/admin_panel/popups/delete_confirm";

export default function TechStack() {
  const [technology, setTechnology] = useState("");
  const [category, setCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [techList, setTechList] = useState([]);
  const [errors, setErrors] = useState({});

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editTech, setEditTech] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editFile, setEditFile] = useState(null);

  const mainFileInputRef = useRef(null);
  const modalFileInputRef = useRef(null);

  /* -------------------- VALIDATION -------------------- */
  const validateForm = () => {
    const newErrors = {};
    if (!technology.trim()) newErrors.technology = "Technology name is required.";
    if (!category.trim()) newErrors.category = "Please select a category.";
    if (!selectedFile) newErrors.image = "Please upload an image (JPG or PNG).";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* -------------------- FILE HANDLING -------------------- */
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

  const handleModalFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        alert("Only JPG or PNG files are allowed.");
        return;
      }
      setEditFile(file);
      e.target.value = "";
    }
  };

  /* -------------------- ADD -------------------- */
  const handleAddTech = () => {
    if (!validateForm()) return;

    const newTech = {
      id: Date.now(),
      technology,
      category,
      image: URL.createObjectURL(selectedFile),
    };

    setTechList([...techList, newTech]);
    setTechnology("");
    setCategory("");
    setSelectedFile(null);
    setErrors({});
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 2500);
  };

  /* -------------------- EDIT -------------------- */
  const handleEdit = (tech) => {
    setEditTech(tech);
    setEditName(tech.technology);
    setEditCategory(tech.category);
    setEditFile(null);
    setShowModal(true);
  };

  const handleUpdate = () => {
    const updated = techList.map((item) =>
      item.id === editTech.id
        ? {
            ...item,
            technology: editName,
            category: editCategory,
            image: editFile ? URL.createObjectURL(editFile) : item.image,
          }
        : item
    );
    setTechList(updated);
    setShowModal(false);
  };

  /* -------------------- DELETE -------------------- */
  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setTechList((prev) => prev.filter((item) => item.id !== deleteTarget));
      setShowDeletePopup(false);
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 2500);
    }
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setDeleteTarget(null);
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="tech-stack-section">
      <div className="main-content">
        <div className="tech-stack-wrapper">
          <h2 className="tech-stack-heading">Tech Stack</h2>

          {/* FORM SECTION */}
          <div className="big-container">
            <div className="form-row">
              {/* Technology */}
              <div className="form-group">
                <label className="category-tag">Technology</label>
                <input
                  type="text"
                  className={`tech-input ${errors.technology ? "input-error" : ""}`}
                  placeholder="Enter technology name"
                  value={technology}
                  onChange={(e) => setTechnology(e.target.value)}
                />
                {errors.technology && (
                  <small className="error-text">{errors.technology}</small>
                )}
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="category-tag">Category</label>
                <select
                  className={`tech-input ${errors.category ? "input-error" : ""}`}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    backgroundImage: `url(${dropdownArrow})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 16px center",
                    backgroundSize: "14px",
                    paddingRight: "40px",
                    appearance: "none",
                  }}
                >
                  <option value="">Select category</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && (
                  <small className="error-text">{errors.category}</small>
                )}
              </div>

              {/* Upload */}
              <div className="form-group">
                <label className="category-tag">Icon (JPG/PNG)</label>
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
                    {selectedFile ? selectedFile.name : "Upload icon"}
                  </span>
                  <img src={uploadIcon} alt="Upload" className="upload-icon" />
                </div>
                {errors.image && <small className="error-text">{errors.image}</small>}
              </div>
            </div>

            <hr className="form-divider" />
            <div className="form-actions">
              <SummitButton label="Submit" onClick={handleAddTech} />
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="second-container">
            <h2 className="table-heading">All Technologies</h2>
            <div className="table-wrapper">
              <table className="services-table">
                <thead>
                  <tr>
                    <th>Technology</th>
                    <th>Category</th>
                    <th className="action-col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {techList.map((tech) => (
                    <tr key={tech.id}>
                      <td className="service-cell">
                        <img src={tech.image} alt="Tech" className="tech-icon" />
                        <span>{tech.technology}</span>
                      </td>
                      <td>{tech.category}</td>
                      <td className="action-col">
                        <div className="action-buttons">
                          <button
                            className="icon-btn"
                            onClick={() => handleEdit(tech)}
                          >
                            <img src={editIcon} alt="Edit" className="action-icon" />
                          </button>
                          <button
                            className="icon-btn"
                            onClick={() => handleDeleteClick(tech.id)}
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

          {/* POPUPS */}
          {showSuccessPopup && (
            <Popup title="Technology Added!" message="Successfully added new technology." />
          )}
          {showDeleteSuccess && (
            <DeletePopup title="Deleted!" message="Technology deleted successfully." />
          )}
          {showDeletePopup && (
            <DeleteConfirmPopup
              onClose={handleCancelDelete}
              onConfirm={handleConfirmDelete}
            />
          )}

          {/* MODAL */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h2 className="modal-heading">Edit Technology</h2>
                <div className="modal-field">
                  <label>Technology</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div className="modal-field">
                  <label>Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    <option value="">Select category</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="modal-field">
                  <label>Icon (JPG/PNG)</label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    ref={modalFileInputRef}
                    style={{ display: "none" }}
                    onChange={handleModalFileChange}
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
                        : editTech?.image
                        ? "Current Icon"
                        : "Upload Icon"}
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
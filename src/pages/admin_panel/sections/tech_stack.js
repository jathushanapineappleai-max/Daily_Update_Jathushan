import React, { useState, useRef } from "react";
import uploadIcon from "../../../assets/icons/upload.png";
import "../../../styles/admin_panel/tech_stack.css";
import dropdownArrow from "../../../assets/icons/dropdownOption.png";
import editIcon from "../../../assets/icons/Frame.png";
import deleteIcon from "../../../assets/icons/Vector.png";
import SummitButton from "../../../components/admin_panel/buttons/summit_button";
import UpdateButton from "../../../components/admin_panel/buttons/update_button";

// ✅ Import popups
import Popup from "../../../components/admin_panel/popups/success"; // green popup
import DeleteConfirmPopup from "../../../components/admin_panel/popups/delete_confirm"; // confirm box
import DeletePopup from "../../../components/admin_panel/popups/delete"; // red popup

export default function TechStack() {
  /* ========================== */
  /* STATE MANAGEMENT            */
  /* ========================== */
  const [technology, setTechnology] = useState("");
  const [category, setCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [techList, setTechList] = useState([]);

  // Popups
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editTech, setEditTech] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editFile, setEditFile] = useState(null);

  const mainFileInputRef = useRef(null);
  const modalFileInputRef = useRef(null);

  /* ========================== */
  /* FILE HANDLERS              */
  /* ========================== */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      e.target.value = "";
    }
  };

  const handleModalFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFile(file);
      e.target.value = "";
    }
  };

  /* ========================== */
  /* ADD NEW TECH STACK ITEM    */
  /* ========================== */
  const handleAddTech = () => {
    if (!technology || !category) return;

    const newTech = {
      id: Date.now(),
      technology,
      category,
      image: selectedFile ? URL.createObjectURL(selectedFile) : null,
    };

    setTechList((prev) => [...prev, newTech]);
    setTechnology("");
    setCategory("");
    setSelectedFile(null);

    // ✅ Show success popup
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 2500);
  };

  /* ========================== */
  /* DELETE TECH STACK ITEM     */
  /* ========================== */
  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setTechList((prev) => prev.filter((t) => t.id !== deleteTarget));
      setShowDeletePopup(false);
      setDeleteTarget(null);

      // ✅ Show red popup
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 2500);
    }
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setDeleteTarget(null);
  };

  /* ========================== */
  /* EDIT HANDLING (MODAL)      */
  /* ========================== */
  const handleEdit = (tech) => {
    setEditTech(tech);
    setEditName(tech.technology);
    setEditCategory(tech.category);
    setEditFile(null);
    setShowModal(true);
  };

  const handleUpdate = () => {
    const updatedList = techList.map((item) =>
      item.id === editTech.id
        ? {
            ...item,
            technology: editName,
            category: editCategory,
            image: editFile ? URL.createObjectURL(editFile) : item.image,
          }
        : item
    );
    setTechList(updatedList);
    setShowModal(false);
  };

  /* ========================== */
  /* RENDER                     */
  /* ========================== */
  return (
    <div className="main-content">
      <div className="tech-stack-wrapper">
        <h2 className="tech-stack-heading">Tech Stack</h2>

        {/* ================= FORM SECTION ================= */}
        <div className="tech-container">
          <div className="form-row">
            {/* Technology input */}
            <div className="form-group">
              <label className="category-tag">Technology</label>
              <input
                type="text"
                className="tech-input tech-input-technology"
                placeholder="Add technology"
                value={technology}
                onChange={(e) => setTechnology(e.target.value)}
              />
            </div>

            {/* Category dropdown */}
            <div className="form-group">
              <label className="category-tag">Category</label>
              <select
                className="tech-input tech-input-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  backgroundImage: `url(${dropdownArrow})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                  backgroundSize: "14px",
                  paddingRight: "40px",
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                }}
              >
                <option value="">Choose a category</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Upload image */}
            <div className="form-group">
              <label className="category-tag">Image</label>
              <input
                type="file"
                accept="image/*"
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
            <SummitButton label="Submit" onClick={handleAddTech} />
          </div>
        </div>

        {/* ================= TABLE SECTION ================= */}
        <div className="second-container">
          <h2 className="table-heading">All Technology</h2>

          <div className="table-wrapper">
            <table className="services-table">
              <thead>
                <tr>
                  <th>Technology</th>
                  <th>Category</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {techList.map((tech) => (
                  <tr key={tech.id}>
                    <td>
                      <div className="service-cell">
                        {tech.image && (
                          <img src={tech.image} alt="Tech" className="tech-icon" />
                        )}
                        <span>{tech.technology}</span>
                      </div>
                    </td>

                    <td>{tech.category}</td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-btn"
                          onClick={() => handleEdit(tech)}
                          title="Edit"
                        >
                          <img src={editIcon} alt="Edit" className="action-icon" />
                        </button>
                        <button
                          className="icon-btn"
                          onClick={() => handleDeleteClick(tech.id)}
                          title="Delete"
                        >
                          <img
                            src={deleteIcon}
                            alt="Delete"
                            className="action-icon"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= POPUPS ================= */}
        {showSuccessPopup && (
          <div className="popup-container">
            <Popup
              title="Technology Added!"
              message="New technology has been successfully added."
            />
          </div>
        )}

        {showDeleteSuccess && (
          <div className="popup-container">
            <DeletePopup
              title="Deleted!"
              message="Technology deleted successfully."
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
                <label>Icon</label>
                <input
                  type="file"
                  accept="image/*"
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
                  <img src={uploadIcon} alt="Upload Icon" className="upload-icon" />
                </div>
              </div>

              <div className="modal-field">
                <label>Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  style={{
                    backgroundImage: `url(${dropdownArrow})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 16px center",
                    backgroundSize: "14px",
                    paddingRight: "40px",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                  }}
                >
                  <option value="">Choose a category</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Other">Other</option>
                </select>
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
  );
}
import React, { useState, useRef } from "react";
import uploadIcon from "../../../assets/icons/upload.png";
import editIcon from "../../../assets/icons/Frame.png";
import deleteIcon from "../../../assets/icons/Vector.png";
import "../../../styles/admin_panel/main_services.css";

import SummitButton from "../../../components/admin_panel/buttons/summit_button";
import UpdateButton from "../../../components/admin_panel/buttons/update_button";
import Popup from "../../../components/admin_panel/popups/success";
import DeletePopup from "../../../components/admin_panel/popups/delete";
import DeleteConfirmPopup from "../../../components/admin_panel/popups/delete_confirm";

export default function MainServices() {
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [services, setServices] = useState([]);
  const [errors, setErrors] = useState({});

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFile, setEditFile] = useState(null);

  const mainFileInputRef = useRef(null);
  const modalFileInputRef = useRef(null);

  /* -------------------- VALIDATION -------------------- */
  const validateForm = () => {
    const newErrors = {};
    if (!serviceName.trim()) newErrors.serviceName = "Service name is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!selectedFile) newErrors.icon = "Please upload an icon (JPG or PNG).";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* -------------------- ADD -------------------- */
  const handleAddService = () => {
    if (!validateForm()) return;
    const newService = {
      id: Date.now(),
      name: serviceName,
      description,
      icon: URL.createObjectURL(selectedFile),
    };
    setServices([...services, newService]);
    setServiceName("");
    setDescription("");
    setSelectedFile(null);
    setErrors({});
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 2500);
  };

  /* -------------------- EDIT -------------------- */
  const handleEdit = (service) => {
    setEditService(service);
    setEditName(service.name);
    setEditDescription(service.description);
    setEditFile(null);
    setShowModal(true);
  };

  const handleUpdate = () => {
    const updated = services.map((item) =>
      item.id === editService.id
        ? {
            ...item,
            name: editName,
            description: editDescription,
            icon: editFile ? URL.createObjectURL(editFile) : item.icon,
          }
        : item
    );
    setServices(updated);
    setShowModal(false);
  };

  /* -------------------- DELETE -------------------- */
  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setServices((prev) => prev.filter((s) => s.id !== deleteTarget));
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
    <div className="main-services-section">
      <div className="main-content">
        <div className="main-services-wrapper">
          <h2 className="main-services-heading">Main Services</h2>

          {/* FORM SECTION */}
          <div className="big-container">
            <div className="form-row">
              {/* Service Name */}
              <div className="form-group">
                <label className="category-tag">Service</label>
                <input
                  type="text"
                  className={`service-input ${errors.serviceName ? "input-error" : ""}`}
                  placeholder="Enter service name"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                />
                {errors.serviceName && (
                  <small className="error-text">{errors.serviceName}</small>
                )}
              </div>

              {/* Upload Icon */}
              <div className="form-group">
                <label className="category-tag">Icon (JPG/PNG)</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  ref={mainFileInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setSelectedFile(file);
                    e.target.value = "";
                  }}
                />
                <div
                  className={`upload-box ${errors.icon ? "upload-error" : ""}`}
                  onClick={() =>
                    mainFileInputRef.current && mainFileInputRef.current.click()
                  }
                >
                  <span className="upload-placeholder">
                    {selectedFile ? selectedFile.name : "Upload icon"}
                  </span>
                  <img src={uploadIcon} alt="Upload" className="upload-icon" />
                </div>
                {errors.icon && <small className="error-text">{errors.icon}</small>}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="category-tag">Description</label>
              <textarea
                className={`service-input textarea-input ${
                  errors.description ? "input-error" : ""
                }`}
                placeholder="Write a description about the service"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && (
                <small className="error-text">{errors.description}</small>
              )}
            </div>

            <hr className="form-divider" />
            <div className="form-actions">
              <SummitButton label="Submit" onClick={handleAddService} />
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="second-container">
            <h2 className="table-heading">All Services</h2>
            <div className="table-wrapper">
              <table className="services-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Description</th>
                    <th className="action-col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((srv) => (
                    <tr key={srv.id}>
                      <td className="service-cell">
                        <img src={srv.icon} alt="Service" className="service-icon" />
                        <span>{srv.name}</span>
                      </td>
                      <td>{srv.description}</td>
                      <td className="action-col">
                        <div className="action-buttons">
                          <button className="icon-btn" onClick={() => handleEdit(srv)}>
                            <img src={editIcon} alt="Edit" className="action-icon" />
                          </button>
                          <button
                            className="icon-btn"
                            onClick={() => handleDeleteClick(srv.id)}
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
            <Popup title="Service Added!" message="Successfully added new service." />
          )}
          {showDeleteSuccess && (
            <DeletePopup title="Deleted!" message="Service deleted successfully." />
          )}
          {showDeletePopup && (
            <DeleteConfirmPopup
              onClose={handleCancelDelete}
              onConfirm={handleConfirmDelete}
            />
          )}

          {/* EDIT MODAL */}
          {showModal && (
            <div className="modal-overlay">
              <div className="edit-modal">
                <h2 className="edit-heading">Edit Service</h2>

                <div className="edit-form">
                  <div className="edit-group">
                    <label>Service</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>

                  <div className="edit-group">
                    <label>Icon</label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      ref={modalFileInputRef}
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
                        modalFileInputRef.current && modalFileInputRef.current.click()
                      }
                    >
                      <span className="upload-placeholder">
                        {editFile
                          ? editFile.name
                          : editService?.icon
                          ? "Current Icon"
                          : "Upload Icon"}
                      </span>
                      <img src={uploadIcon} alt="Upload" className="upload-icon" />
                    </div>
                  </div>

                  <div className="edit-group">
                    <label>Description</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows="3"
                    />
                  </div>
                </div>

                <div className="edit-divider"></div>
                <div className="edit-actions">
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
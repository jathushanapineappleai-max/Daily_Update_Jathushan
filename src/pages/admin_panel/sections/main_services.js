import React, { useState, useRef } from "react";
import uploadIcon from "../../../assets/icons/upload.png";
import editIconImg from "../../../assets/icons/Frame.png";
import deleteIcon from "../../../assets/icons/Vector.png";
import "../../../styles/admin_panel/main_services.css";
import SummitButton from "../../../components/admin_panel/buttons/summit_button";
import UpdateButton from "../../../components/admin_panel/buttons/update_button";

// ✅ Popups
import Popup from "../../../components/admin_panel/popups/success";
import DeleteConfirmPopup from "../../../components/admin_panel/popups/delete_confirm";
import DeletePopup from "../../../components/admin_panel/popups/delete";

export default function MainServices() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState([]);

  // === Validation Errors ===
  const [errors, setErrors] = useState({});

  // === Popups ===
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // === Edit Modal ===
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIconFile, setEditIconFile] = useState(null);

  const mainFileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  /* ========================== VALIDATION ========================== */
  const validateForm = () => {
    const newErrors = {};
    if (!serviceName.trim()) newErrors.serviceName = "Service name is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!selectedFile) newErrors.icon = "Please upload an icon.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ========================== ADD SERVICE ========================== */
  const handleAddService = () => {
    if (!validateForm()) return;

    const newService = {
      id: Date.now(),
      name: serviceName,
      description,
      icon: URL.createObjectURL(selectedFile),
    };

    setServices((prev) => [...prev, newService]);
    setServiceName("");
    setDescription("");
    setSelectedFile(null);
    setErrors({});

    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 2500);
  };

  /* ========================== DELETE ========================== */
  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setServices((prev) => prev.filter((srv) => srv.id !== deleteTarget));
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

  /* ========================== EDIT ========================== */
  const handleEdit = (service) => {
    setEditService(service);
    setEditName(service.name);
    setEditDescription(service.description);
    setShowModal(true);
  };

  const handleUpdate = () => {
    if (!editName.trim() || !editDescription.trim()) return;

    const updatedServices = services.map((srv) =>
      srv.id === editService.id
        ? {
            ...srv,
            name: editName,
            description: editDescription,
            icon: editIconFile ? URL.createObjectURL(editIconFile) : srv.icon,
          }
        : srv
    );
    setServices(updatedServices);
    setShowModal(false);
  };

  /* ========================== RETURN ========================== */
  return (
    <div className="main-services-section">
      <div className="main-content">
        <div className="main-services-wrapper">
          <h2 className="main-services-heading">Main Services</h2>

          {/* ================== FORM SECTION ================== */}
          <div className="big-container">
            <div className="form-row">
              {/* Service Name */}
              <div className="form-group">
                <label className="category-tag">Service</label>
                <input
                  type="text"
                  className={`service-input ${
                    errors.serviceName ? "input-error" : ""
                  }`}
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
                <label className="category-tag">Icon</label>
                <input
                  type="file"
                  accept="image/*"
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
                {errors.icon && (
                  <small className="error-text">{errors.icon}</small>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="category-tag">Description</label>
              <textarea
                className={`description-input ${
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

          {/* ================== TABLE SECTION ================== */}
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
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td className="service-cell">
                        <img
                          src={service.icon}
                          alt="Service Icon"
                          className="service-icon"
                        />
                        <span>{service.name}</span>
                      </td>
                      <td>{service.description}</td>
                      <td className="action-col">
                        <div className="action-buttons">
                          <button
                            className="icon-btn"
                            title="Edit"
                            onClick={() => handleEdit(service)}
                          >
                            <img
                              src={editIconImg}
                              alt="Edit"
                              className="action-icon"
                            />
                          </button>
                          <button
                            className="icon-btn"
                            title="Delete"
                            onClick={() => handleDeleteClick(service.id)}
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

          {/* ================== POPUPS ================== */}
          {showSuccessPopup && (
            <div className="popup-container">
              <Popup
                title="Service Added!"
                message="The service was successfully added."
              />
            </div>
          )}

          {showDeleteSuccess && (
            <div className="popup-container">
              <DeletePopup
                title="Deleted!"
                message="The service has been deleted successfully."
              />
            </div>
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
                <h2 className="modal-heading">Edit Service</h2>

                <div className="modal-field">
                  <label>Service</label>
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
                    ref={editFileInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setEditIconFile(file);
                      e.target.value = "";
                    }}
                  />
                  <div
                    className="upload-box"
                    onClick={() =>
                      editFileInputRef.current &&
                      editFileInputRef.current.click()
                    }
                  >
                    <span className="upload-placeholder">
                      {editIconFile
                        ? editIconFile.name
                        : editService?.icon
                        ? "Current Icon"
                        : "Upload an icon"}
                    </span>
                    <img src={uploadIcon} alt="Upload" className="upload-icon" />
                  </div>
                </div>

                <div className="modal-field">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  ></textarea>
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
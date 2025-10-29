// team.js
import React, { useState, useRef, useEffect } from "react";
import "../../../styles/admin_panel/team.css";
import UpdateButton from "./../../../components/admin_panel/buttons/update_button"; // don't change this file
import dropIconSrc from "../../../assets/icons/Group 1000005456.png";
import avatarIconSrc from "../../../assets/icons/04.png";
import editIconSrc from "../../../assets/icons/Frame.png";
import deleteIconSrc from "../../../assets/icons/Vector.png";
import Pagination from "../../../components/admin_panel/pagination";
import leftImg from "../../../assets/icons/leftArrow.png";
import rightImg from "../../../assets/icons/rightArrow.png";
import sortIcon from "../../../assets/icons/sort_arrows.png";
import Popup from "../../../components/admin_panel/popups/success"; // Assuming this path; adjust as needed
import DeleteConfirmPopup from "../../../components/admin_panel/popups/delete_confirm";
import DeletePopup from "../../../components/admin_panel/popups/delete";

function getInitials(name) {
  const parts = name.split(/[\s.]+/).filter(Boolean);
  const initials = parts.map(p => p[0]?.toUpperCase()).join('.');
  return initials.slice(0, 3) || '??';
}

/**
 * computeRange: returns { start, end } for display
 * Ensures 0-0 when total === 0
 */
function computeRange({ currentPage = 1, rowsPerPage = 10, total = 0 }) {
  const safePage = Math.max(1, Number(currentPage) || 1);
  const safeRows = Math.max(1, Number(rowsPerPage) || 10);
  const startIndex = (safePage - 1) * safeRows;
  const start = total > 0 ? startIndex + 1 : 0;
  const end = total > 0 ? Math.min(startIndex + safeRows, total) : 0;
  return { start, end };
}

export default function TeamPage() {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal-specific states
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalEditingId, setModalEditingId] = useState(null);

  // Delete confirm states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Delete success popup state
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  // Popup states
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("Success");
  const [popupMessage, setPopupMessage] = useState("");

  const positions = [
    "Choose your job position",
    "CEO",
    "CTO",
    "Developer",
    "Designer",
    "Marketing",
    "HR",
    "UI/UX Engineer"
  ];

  useEffect(() => {
    if (!popupVisible) return undefined;
    const t = setTimeout(() => setPopupVisible(false), 3000);
    return () => clearTimeout(t);
  }, [popupVisible]);

  useEffect(() => {
    if (!showDeleteSuccess) return undefined;
    const t = setTimeout(() => setShowDeleteSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [showDeleteSuccess]);

  function handleFile(file) {
    if (!file) return;
    setPhotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function onFileChange(e) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }

  function onDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  function removePhoto() {
    setPhotoFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  }

  function resetForm() {
    setName("");
    setPosition("");
    setLinkedin("");
    setDescription("");
    removePhoto();
    setErrors({});
  }

  const validateForm = () => {
    let errs = {};
    if (!name.trim()) {
      errs.name = "Name is required";
    }
    if (!position) {
      errs.position = "Position is required";
    }
    if (!linkedin.trim()) {
      errs.linkedin = "LinkedIn URL is required";
    } else {
      let urlStr = linkedin;
      if (!urlStr.startsWith("http://") && !urlStr.startsWith("https://")) {
        urlStr = "https://" + urlStr;
      }
      try {
        const url = new URL(urlStr);
        const hostname = url.hostname.toLowerCase();
        if (hostname !== "linkedin.com" && hostname !== "www.linkedin.com") {
          errs.linkedin = "Must be a valid LinkedIn URL";
        }
      } catch (e) {
        errs.linkedin = "Invalid LinkedIn URL";
      }
    }
    if (!description.trim()) {
      errs.description = "Short description is required";
    }
    if (!previewUrl) {
      errs.photo = "Employee photo is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  function submitForm(e) {
    e.preventDefault();
    if (!validateForm()) return;
    const employeeData = { name, position, linkedin, description, photoUrl: previewUrl || null };
    const newEmployees = [...employees, { ...employeeData, id: Date.now() }];
    setEmployees(newEmployees);
    const lastPage = Math.ceil(newEmployees.length / rowsPerPage);
    setPage(lastPage);
    resetForm();
    setPopupMessage("Employee added successfully.");
    setPopupVisible(true);
  }

  // Edit from list: open modal and prefill fields
  function handleEdit(id) {
    const emp = employees.find(e => e.id === id);
    if (emp) {
      setName(emp.name || "");
      setPosition(emp.position || "");
      setLinkedin(emp.linkedin || "");
      setDescription(emp.description || "");
      setPreviewUrl(emp.photoUrl || null);
      setPhotoFile(null);
      setModalEditingId(id);
      setShowEditModal(true);
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  }

  function handleDelete(id) {
    if (!id) return;
    setDeleteId(id);
    setShowDeleteConfirm(true);
  }

  // Update employee from modal
  function updateEmployeeFromModal() {
    if (!modalEditingId) return;
    if (!validateForm()) return;
    const updated = {
      name,
      position,
      linkedin,
      description,
      photoUrl: previewUrl || null,
      id: modalEditingId,
    };
    setEmployees(employees.map(emp => (emp.id === modalEditingId ? updated : emp)));
    setShowEditModal(false);
    setModalEditingId(null);
    resetForm();
    setPopupMessage("Employee updated successfully.");
    setPopupVisible(true);
  }

  function closeEditModal() {
    setShowEditModal(false);
    setModalEditingId(null);
    resetForm();
  }

  // Compute paginated employees and the display range
  const total = employees.length;
  const currentEmployees = employees.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const { start, end } = computeRange({ currentPage: page, rowsPerPage, total });

  return (
    <div className="team-page-root">
      {/* CONTENT WRAPPER: will be blurred when modal is open */}
      <div className={`content-wrapper ${showEditModal || showDeleteConfirm ? "blurred" : ""}`}>
        <h2 className="team-title">Team</h2>

        {/* Top add form - unchanged (Add Employee) */}
        <form className="team-container" onSubmit={submitForm}>
          <div className="row three-cols">
            <label className="field">
              <span className="field-label">Name</span>
              <input
                className={`input ${errors.name ? "error" : ""}`}
                placeholder="Add employee name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </label>

            <label className="field">
              <span className="field-label">Position</span>
              <select
                className={`input select ${position ? "has-value" : ""} ${errors.position ? "error" : ""}`}
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                {positions.map((p) => (
                  <option key={p} value={p === positions[0] ? "" : p} disabled={p === positions[0]}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.position && <span className="field-error">{errors.position}</span>}
            </label>

            <label className="field">
              <span className="field-label">LinkedIn</span>
              <input
                className={`input ${errors.linkedin ? "error" : ""}`}
                placeholder="Add Linked URL"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
              {errors.linkedin && <span className="field-error">{errors.linkedin}</span>}
            </label>
          </div>

          <div className="row three-cols photo-row">
            <div className="field photo-field">
              <span className="field-label">Employee Photo</span>
              {previewUrl ? (
                <div className="avatar-stack">
                  <img src={previewUrl} alt="employee" className="avatar" />
                  <div className="photo-actions">
                    <button type="button" className="link-btn delete" onClick={removePhoto}>
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="avatar-placeholder">
                  <div className="avatar-icon">
                    <img src={avatarIconSrc} alt="employee placeholder" />
                  </div>
                </div>
              )}
            </div>

            <div
              className={`photo-drop ${errors.photo ? "error" : ""}`}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <div className="drop-inner">
                <div className="drop-icon">
                  <img src={dropIconSrc} alt="upload" />
                </div>
                <div className="drop-text">
                  <div className="drop-line">Click to upload or drag and</div>
                  <div className="drop-line">drop</div>
                  <div className="drop-sub">PNG, JPG (344 x 488px)</div>
                </div>
              </div>
            </div>

            <div className="field empty-field" />
          </div>
          {errors.photo && <span className="field-error">{errors.photo}</span>}

          <label className="field fullwidth description-field">
            <span className="field-label">Short Description</span>
            <textarea
              className={`textarea ${errors.description ? "error" : ""}`}
              placeholder="Write a short bio about employee"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </label>

          <div className="divider" />

          <div className="form-actions">
            <button type="submit" className="add-employee-btn">
              Add Employee
            </button>
          </div>

          {/* global hidden file input (shared with modal) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={onFileChange}
          />
        </form>

        {/* team list */}
        <div className="team-list">
          <div className="list-header">
            <h3>All Team Members</h3>

            {/* NUMBER OF ITEMS BAR (top-right) */}
            <div className="cr-list-meta" aria-hidden>
              <span className="cr-range">{start} - {end}</span>
              <span className="cr-muted"> of {total}</span>
            </div>
          </div>

          <table className="team-table">
            <thead>
              <tr>
                <th id="th-name" className="th-header th-name">
                  Name <img src={sortIcon} alt="sort" className="sort-icon" />
                </th>

                <th id="th-position" className="th-header th-position">
                  Position <img src={sortIcon} alt="sort" className="sort-icon" />
                </th>

                <th id="th-linkedin" className="th-header th-linkedin">
                  LinkedIn <img src={sortIcon} alt="sort" className="sort-icon" />
                </th>

                <th id="th-description" className="th-header th-description">
                  Short Description <img src={sortIcon} alt="sort" className="sort-icon" />
                </th>

                <th id="th-action" className="th-header th-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="name-cell">
                      {emp.photoUrl ? (
                        <img src={emp.photoUrl} alt={emp.name} className="list-avatar" />
                      ) : (
                        <div className="list-avatar-icon">{getInitials(emp.name)}</div>
                      )}
                      {emp.name}
                    </div>
                  </td>
                  <td>{emp.position}</td>
                  <td>
                    <a href={emp.linkedin} target="_blank" rel="noopener noreferrer">
                      {emp.linkedin}
                    </a>
                  </td>
                  <td>{emp.description}</td>
                  <td className="td-action">
                  <div className="action-group">
                    {/* EDIT button opens modal with prefilled fields */}
                    <button className="action-btn edit" onClick={() => handleEdit(emp.id)}>
                      <img src={editIconSrc} alt="Edit" className="action-icon" />
                    </button>

                    {/* DELETE button deletes employee */}
                    <button className="action-btn delete" onClick={() => handleDelete(emp.id)}>
                      <img src={deleteIconSrc} alt="Delete" className="action-icon" />
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "16px 0", color: "var(--muted)" }}>No employees yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-box">
          <Pagination
            currentPage={page}
            total={employees.length}
            rowsPerPage={rowsPerPage}
            onPageChange={(p) => setPage(p)}
            onRowsPerPageChange={(size) => {
              setRowsPerPage(size);
              // optional: reset page to 1 when rowsPerPage changes (if your pagination component doesn't already handle it)
              // setPage(1);
            }}
            leftIcon={leftImg}
            rightIcon={rightImg}
            resetPageOnRowsChange={true}
          />
        </div>
      </div>

      {/* Modal overlay kept outside content-wrapper so it doesn't get blurred */}
      {showEditModal && (
        <div className="TMmodal-overlay" onMouseDown={closeEditModal}>
          <div
            className="editTMmodal"
            onMouseDown={(e) => e.stopPropagation()} /* prevent overlay close when clicking inside modal */
          >
            {/* Modal form: stacked inputs in required order (no title, no delete/cancel) */}
            <form
              className="TMmodal-content"
              onSubmit={(e) => { e.preventDefault(); updateEmployeeFromModal(); }}
            >
              <div className="form-details">
                {/* 1. Name */}
                <div className="row-field name-row">
                  <label className="field-label" htmlFor="modal-name">Name</label>
                  <div className="spacer"></div>
                  <div className="input-wrapper">
                    <input
                      id="modal-name"
                      className={`input ${errors.name ? "error" : ""}`}
                      placeholder="Add employee name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>
                </div>

                {/* 2. Position */}
                <div className="row-field position-row">
                  <label className="field-label" htmlFor="modal-position">Position</label>
                  <div className="spacer"></div>
                  <div className="input-wrapper">
                    <select
                      id="modal-position"
                      className={`input select ${position ? "has-value" : ""} ${errors.position ? "error" : ""}`}
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    >
                      {positions.map((p) => (
                        <option key={p} value={p === positions[0] ? "" : p} disabled={p === positions[0]}>
                          {p}
                        </option>
                      ))}
                    </select>
                    {errors.position && <span className="field-error">{errors.position}</span>}
                  </div>
                </div>

                {/* 3. Employee Photo (avatar + drop area) */}
                <div className="row-field photo-block photo-row">
                  <span className="field-label">Employee Photo</span>
                  <div className="photo-block-inner">
                    <div className="photo-left">
                      {previewUrl ? (
                        <div className="avatar-stack">
                          <img src={previewUrl} alt="employee" className="avatar" />
                          <div className="photo-actions">
                            <button type="button" className="link-btn delete" onClick={removePhoto}>
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="avatar-placeholder">
                          <div className="avatar-icon">
                            <img src={avatarIconSrc} alt="employee placeholder" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className={`photo-drop TMmodal-drop ${errors.photo ? "error" : ""}`}
                      onDrop={onDrop}
                      onDragOver={onDragOver}
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      <div className="drop-inner">
                        <div className="drop-icon">
                          <img src={dropIconSrc} alt="upload" />
                        </div>
                        <div className="drop-text">
                          <div className="drop-line">Click to upload or drag and</div>
                          <div className="drop-line">drop</div>
                          <div className="drop-sub">PNG, JPG (344 x 488px)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {errors.photo && <span className="field-error">{errors.photo}</span>}

                {/* 4. LinkedIn */}
                <div className="row-field linkedin-row">
                  <label className="field-label" htmlFor="modal-linkedin">LinkedIn</label>
                  <div className="spacer"></div>
                  <div className="input-wrapper">
                    <input
                      id="modal-linkedin"
                      className={`input ${errors.linkedin ? "error" : ""}`}
                      placeholder="Add Linked URL"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                    />
                    {errors.linkedin && <span className="field-error">{errors.linkedin}</span>}
                  </div>
                </div>

                {/* 5. Short Description */}
                <div className="row-field description-field desc-row">
                  <label className="field-label" htmlFor="modal-description">Short Description</label>
                  <div className="spacer"></div>
                  <div className="input-wrapper">
                    <textarea
                      id="modal-description"
                      className={`textarea ${errors.description ? "error" : ""}`}
                      placeholder="Write a short bio about employee"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description && <span className="field-error">{errors.description}</span>}
                  </div>
                </div>
              </div>

              <div className="divider" />

              <div className="form-actions TMmodal-actions">
                {/* Only Update button remains */}
                <UpdateButton onClick={updateEmployeeFromModal} />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Popup */}
      {showDeleteConfirm && (
        <DeleteConfirmPopup
          onClose={() => {
            setShowDeleteConfirm(false);
            setDeleteId(null);
          }}
          onConfirm={() => {
            const newEmployees = employees.filter(e => e.id !== deleteId);
            setEmployees(newEmployees);
            const maxPage = Math.ceil(newEmployees.length / rowsPerPage) || 1;
            if (page > maxPage) {
              setPage(maxPage);
            }
            if (modalEditingId === deleteId) {
              closeEditModal();
            }
            setShowDeleteConfirm(false);
            setDeleteId(null);
            setShowDeleteSuccess(true);
          }}
        />
      )}

      {/* Delete Success Popup */}
      {showDeleteSuccess && (
        <div className="delete-popup-container">
          <DeletePopup message="Employee deleted successfully." />
        </div>
      )}

      {/* Success Popup */}
      {popupVisible && (
        <div
          className="success-popup-container"
          role="dialog"
          aria-live="polite"
          aria-modal="false"
        >
          <Popup title={popupTitle} message={popupMessage} />
        </div>
      )}
    </div>
  );
}
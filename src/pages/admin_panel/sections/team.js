// team.js
import React, { useState, useRef } from "react";
import "../../../styles/admin_panel/team.css";
import UpdateButton from "./../../../components/admin_panel/buttons/update_button"; // don't change this file
import dropIconSrc from "../../../assets/icons/Group 1000005456.png";
import avatarIconSrc from "../../../assets/icons/04.png";
import editIconSrc from "../../../assets/icons/Frame.png";
import deleteIconSrc from "../../../assets/icons/Vector.png";

function getInitials(name) {
  const parts = name.split(/[\s.]+/).filter(Boolean);
  const initials = parts.map(p => p[0]?.toUpperCase()).join('.');
  return initials.slice(0, 3) || '??';
}

export default function TeamPage() {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal-specific states
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalEditingId, setModalEditingId] = useState(null);

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
  }

  function submitForm(e) {
    e.preventDefault();
    const employeeData = { name, position, linkedin, description, photoUrl: previewUrl || null };
    const newEmployees = [...employees, { ...employeeData, id: Date.now() }];
    setEmployees(newEmployees);
    const newTotalPages = Math.ceil(newEmployees.length / rowsPerPage);
    setCurrentPage(newTotalPages);
    resetForm();
    alert("Employee added (frontend-only).");
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
    if (window.confirm("Are you sure you want to delete this employee?")) {
      const newEmployees = employees.filter(e => e.id !== id);
      setEmployees(newEmployees);
      const newTotalPages = Math.ceil(newEmployees.length / rowsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages || 1);
      }
      // close modal if deleting the currently edited one
      if (modalEditingId === id) {
        closeEditModal();
      }
    }
  }

  function handleRowsPerPageChange(e) {
    const newRows = Number(e.target.value);
    setRowsPerPage(newRows);
    setCurrentPage(1);
  }

  // Update employee from modal
  function updateEmployeeFromModal() {
    if (!modalEditingId) return;
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
    alert("Employee updated (frontend-only).");
  }

  function closeEditModal() {
    setShowEditModal(false);
    setModalEditingId(null);
    resetForm();
  }

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentEmployees = employees.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(employees.length / rowsPerPage);

  function nextPage() {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }

  function prevPage() {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }

  return (
    <div className="team-page-root">
      {/* CONTENT WRAPPER: will be blurred when modal is open */}
      <div className={`content-wrapper ${showEditModal ? "blurred" : ""}`}>
        <h2 className="team-title">Team</h2>

        {/* Top add form - unchanged (Add Employee) */}
        <form className="team-container" onSubmit={submitForm}>
          <div className="row three-cols">
            <label className="field">
              <span className="field-label">Name</span>
              <input
                className="input"
                placeholder="Add employee name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="field">
              <span className="field-label">Position</span>
              <select
                className={`input select ${position ? 'has-value' : ''}`}
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                {positions.map((p) => (
                  <option key={p} value={p === positions[0] ? "" : p} disabled={p === positions[0]}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field-label">LinkedIn</span>
              <input
                className="input"
                placeholder="Add Linked URL"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
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
              className="photo-drop"
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

          <label className="field fullwidth description-field">
            <span className="field-label">Short Description</span>
            <textarea
              className="textarea"
              placeholder="Write a short bio about employee"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
            <span>{employees.length ? `${indexOfFirst + 1} - ${Math.min(indexOfLast, employees.length)} of ${employees.length}` : `0 of 0`}</span>
          </div>
          <table className="team-table">
            <thead>
              <tr>
                <th>Name ↓</th>
                <th>Position ↓</th>
                <th>LinkedIn ↓</th>
                <th>Short Description ↓</th>
                <th>Action</th>
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
                  <td>
                    {/* EDIT button opens modal with prefilled fields */}
                    <button className="action-btn edit" onClick={() => handleEdit(emp.id)}>
                      <img src={editIconSrc} alt="Edit" className="action-icon" />
                    </button>

                    {/* DELETE button deletes employee */}
                    <button className="action-btn delete" onClick={() => handleDelete(emp.id)}>
                      <img src={deleteIconSrc} alt="Delete" className="action-icon" />
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "16px 0", color: "var(--muted)" }}>No employees yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-bar">
          <span className="page-info">{employees.length ? `${indexOfFirst + 1} - ${Math.min(indexOfLast, employees.length)} of ${employees.length}` : "0 of 0"}</span>
          <div className="pagination-right">
            <div className="rows-per-page">
              <span>Rows per page: </span>
              <select className="rows-select" value={rowsPerPage} onChange={handleRowsPerPageChange}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="page-arrows">
              <button onClick={prevPage} disabled={currentPage === 1}>←</button>
              <button onClick={nextPage} disabled={currentPage === totalPages}>→</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal overlay kept outside content-wrapper so it doesn't get blurred */}
      {showEditModal && (
        <div className="modal-overlay" onMouseDown={closeEditModal}>
          <div
            className="edit-modal"
            onMouseDown={(e) => e.stopPropagation()} /* prevent overlay close when clicking inside modal */
          >
            {/* Modal form: stacked inputs in required order (no title, no delete/cancel) */}
            <form
              className="modal-content"
              onSubmit={(e) => { e.preventDefault(); updateEmployeeFromModal(); }}
            >
              <div className="form-details">
                {/* 1. Name */}
                <div className="row-field name-row">
                  <label className="field-label" htmlFor="modal-name">Name</label>
                  <div className="spacer"></div>
                  <input
                    id="modal-name"
                    className="input"
                    placeholder="Add employee name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* 2. Position */}
                <div className="row-field position-row">
                  <label className="field-label" htmlFor="modal-position">Position</label>
                  <div className="spacer"></div>
                  <select
                    id="modal-position"
                    className={`input select ${position ? 'has-value' : ''}`}
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  >
                    {positions.map((p) => (
                      <option key={p} value={p === positions[0] ? "" : p} disabled={p === positions[0]}>
                        {p}
                      </option>
                    ))}
                  </select>
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
                      className="photo-drop modal-drop"
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

                {/* 4. LinkedIn */}
                <div className="row-field linkedin-row">
                  <label className="field-label" htmlFor="modal-linkedin">LinkedIn</label>
                  <div className="spacer"></div>
                  <input
                    id="modal-linkedin"
                    className="input"
                    placeholder="Add Linked URL"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                </div>

                {/* 5. Short Description */}
                <div className="row-field description-field desc-row">
                  <label className="field-label" htmlFor="modal-description">Short Description</label>
                  <div className="spacer"></div>
                  <textarea
                    id="modal-description"
                    className="textarea"
                    placeholder="Write a short bio about employee"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="divider" />

              <div className="form-actions modal-actions">
                {/* Only Update button remains */}
                <UpdateButton onClick={updateEmployeeFromModal} />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
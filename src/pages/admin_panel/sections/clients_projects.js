import React, { useState } from "react";
import uploadIcon from "../../../assets/icons/upload.png";
import editIcon from "../../../assets/icons/Frame.png";
import deleteIcon from "../../../assets/icons/Vector.png";
import SummitButton from "../../../components/admin_panel/buttons/summit_button";
import "../../../styles/admin_panel/clients_projects.css";

// ✅ Reusable Popups
import Popup from "../../../components/admin_panel/popups/success";
import DeleteConfirmPopup from "../../../components/admin_panel/popups/delete_confirm";
import DeletePopup from "../../../components/admin_panel/popups/delete";

export default function ClientProjects() {
  const [projectName, setProjectName] = useState("");
  const [projectCategory, setProjectCategory] = useState("");
  const [projectWebsite, setProjectWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [projectLogo, setProjectLogo] = useState(null);
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

  /* ------------------------ File Upload ------------------------ */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProjectLogo(file);
    setActiveBox("");
  };

  const handleBoxClick = () => {
    setActiveBox("logo");
    document.getElementById("project-logo").click();
    setTimeout(() => setActiveBox(""), 800);
  };

  /* ------------------------ Add Project ------------------------ */
  const handleSubmit = () => {
    if (!projectName || !projectCategory || !projectWebsite) {
      alert("Please fill all fields!");
      return;
    }

    const newProject = {
      id: Date.now(),
      name: projectName,
      category: projectCategory,
      website: projectWebsite,
      description,
      logo: projectLogo
        ? URL.createObjectURL(projectLogo)
        : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    };

    setProjects((prev) => [...prev, newProject]);
    setProjectName("");
    setProjectCategory("");
    setProjectWebsite("");
    setDescription("");
    setProjectLogo(null);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 2500);
  };

  /* ------------------------ Delete ------------------------ */
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

  const handleCancelDelete = () => setShowDeletePopup(false);

  /* ------------------------ Edit ------------------------ */
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

  /* ------------------------ Render ------------------------ */
  return (
    <div className="cp-client-content">
      <h2 className="cp-client-heading">Client Projects</h2>

      {/* ================= FORM ================= */}
      <div className="cp-client-container">
        <div className="cp-client-grid">
          <div className="cp-client-group">
            <label className="cp-client-label">Project Name</label>
            <input
              type="text"
              placeholder="Enter project name"
              className="cp-client-input"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="cp-client-group">
            <label className="cp-client-label">Project Category</label>
            <select
              className="cp-client-input"
              value={projectCategory}
              onChange={(e) => setProjectCategory(e.target.value)}
            >
              <option value="">Choose a category</option>
              <option value="Web Solution">Web Solution</option>
              <option value="Mobile Solution">Mobile Solution</option>
              <option value="UI/UX Design">UI/UX Design</option>
            </select>
          </div>

          <div className="cp-client-group">
            <label className="cp-client-label">Project Logo</label>
            <input
              type="file"
              id="project-logo"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <div
              className={`cp-client-upload-box ${
                activeBox === "logo" ? "active" : ""
              }`}
              onClick={handleBoxClick}
            >
              <span className="cp-client-upload-placeholder">
                {projectLogo ? projectLogo.name : "Upload project logo"}
              </span>
              <img
                src={uploadIcon}
                alt="Upload"
                className="cp-client-upload-icon"
              />
            </div>
          </div>

          <div className="cp-client-group website-field">
            <label className="cp-client-label">Project Website</label>
            <input
              type="text"
              placeholder="Add project website link"
              className="cp-client-input"
              value={projectWebsite}
              onChange={(e) => setProjectWebsite(e.target.value)}
            />
          </div>

          <div className="cp-client-group description-field">
            <label className="cp-client-label">Description</label>
            <textarea
              className="cp-client-textarea"
              placeholder="Write a description about the project"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>

        <hr className="cp-client-divider" />
        <div className="cp-client-actions">
          <SummitButton label="Submit" onClick={handleSubmit} />
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="cp-client-table-container">
        <h2 className="cp-table-heading">All Client Projects</h2>
        <div className="cp-table-wrapper">
          <table className="cp-client-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Category</th>
                <th>Website</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td className="cp-name-cell">
                    <img src={p.logo} alt="Logo" className="cp-logo" />
                    {p.name}
                  </td>
                  <td>{p.category}</td>
                  <td>{p.website}</td>
                  <td>{p.description}</td>
                  <td className="cp-action-buttons">
                    <button
                      className="cp-icon-btn"
                      title="Edit"
                      onClick={() => handleEditClick(p)}
                    >
                      <img
                        src={editIcon}
                        alt="Edit"
                        className="cp-action-icon"
                      />
                    </button>
                    <button
                      className="cp-icon-btn"
                      title="Delete"
                      onClick={() => handleDeleteClick(p.id)}
                    >
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        className="cp-action-icon"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editModalVisible && (
        <div className="cp-modal-overlay">
          <div className="cp-modal">
            <h2 className="cp-modal-heading">Edit Client Project</h2>

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
              <label>Project Category</label>
              <select
                value={editData.category}
                onChange={(e) =>
                  setEditData({ ...editData, category: e.target.value })
                }
              >
                <option value="Web Solution">Web Solution</option>
                <option value="Mobile Solution">Mobile Solution</option>
                <option value="UI/UX Design">UI/UX Design</option>
              </select>
            </div>

            <div className="cp-modal-field">
              <label>Photo Logo</label>
              <div className="cp-upload-box">
                <span className="cp-upload-placeholder">
                  {editData.logo ? "Dialus.jpg" : "Upload Logo"}
                </span>
                <img src={uploadIcon} alt="Upload" className="cp-upload-icon" />
              </div>
            </div>

            <div className="cp-modal-field">
              <label>Project Website</label>
              <input
                type="text"
                value={editData.website}
                onChange={(e) =>
                  setEditData({ ...editData, website: e.target.value })
                }
              />
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

      {/* ================= POPUPS ================= */}
      {showSuccessPopup && (
        <Popup
          title="Client Project Added!"
          message="Project added successfully."
        />
      )}

      {showDeleteSuccess && (
        <DeletePopup
          title="Deleted!"
          message="Client project deleted successfully."
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
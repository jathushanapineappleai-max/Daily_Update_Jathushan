import React, { useRef, useState } from "react";
import "../styles/add_employee_step3.css";
import { useNavigate } from "react-router-dom";

// Local icons (place these PNGs in src/assets/icons/)
import backIcon from "../assets/icons/back.png";
import uploadIcon from "../assets/icons/upload.png";
import calendarIcon from "../assets/icons/calender.png";
import dropdownIcon from "../assets/icons/dropdown.png";
import successIcon from "../assets/icons/success.png";
import closeIcon from "../assets/icons/Close.png";

export default function AddEmployeeStep3() {
  const navigate = useNavigate();
  const joinDateRef = useRef(null);

  const [formData, setFormData] = useState({
    nic: null,
    birthCertificate: null,
    educationCertificate: null,
    transcript: null,
    joinDate: "",
    designation: "",
    role: "",
    managementRole: "",
    reportingManager: "",
  });

  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  const handleFile = (e) => {
    const { name, files } = e.target;
    setFormData((p) => ({ ...p, [name]: files && files[0] ? files[0] : null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const err = {};
    if (!formData.nic) err.nic = "Upload NIC document";
    if (!formData.birthCertificate) err.birthCertificate = "Upload Birth Certificate";
    if (!formData.educationCertificate) err.educationCertificate = "Upload Educational Certificate";
    if (!formData.transcript) err.transcript = "Upload Transcript";
    if (!formData.joinDate) err.joinDate = "Select Date of Joining";
    if (!formData.designation) err.designation = "Select Designation";
    if (!formData.role) err.role = "Select Role";
    if (!formData.managementRole) err.managementRole = "Select Management Role";
    if (!formData.reportingManager) err.reportingManager = "Select Reporting Manager";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      alert("Please fill all mandatory fields correctly.");
      return;
    }
    // Success → show popup → then go to Employees list
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate("/employees");
    }, 2000);
  };

  return (
    <div className="add-employee-step3">
      {/* ===== Header ===== */}
      <div className="employee-header">
        <div className="header-left" onClick={() => navigate("/employees/step2")}>
          <img src={backIcon} alt="Back" className="back-icon" />
          <h2>New Employee</h2>
        </div>

        <div className="pagination">
          <div className="circle done">1</div>
          <div className="line active"></div>
          <div className="circle done">2</div>
          <div className="line active"></div>
          <div className="circle active">3</div>
        </div>
      </div>

      {/* ===== Document Upload ===== */}
      <div className="info-box">
        <div className="info-header">
          <h3>Document Upload</h3>
        </div>
        <hr />

        <div className="upload-grid">
          {/* NIC */}
          <div className="upload-col">
            <label className="upload-title">NIC</label>

            <div className="mandatory-row">
              <div className="mandatory-dot">!</div>
              <div className="mandatory-pill">Both sides of NIC required.</div>
            </div>

            <label className="upload-field">
              <img src={uploadIcon} alt="upload" />
              <span>{formData.nic ? formData.nic.name : "Upload NIC document"}</span>
              <input
                type="file"
                name="nic"
                accept=".pdf"
                onChange={handleFile}
                hidden
              />
            </label>

            <small className="pdf-note">* Upload PDF only</small>
            {errors.nic && <small className="error">{errors.nic}</small>}
          </div>

          {/* Birth Certificate */}
          <div className="upload-col">
            <label className="upload-title">Birth Certificate</label>

            <div className="mandatory-row">
              <div className="mandatory-dot">!</div>
              <div className="mandatory-pill">Both sides of Birth Certificate required.</div>
            </div>

            <label className="upload-field">
              <img src={uploadIcon} alt="upload" />
              <span>
                {formData.birthCertificate
                  ? formData.birthCertificate.name
                  : "Upload Birth Certificate"}
              </span>
              <input
                type="file"
                name="birthCertificate"
                accept=".pdf"
                onChange={handleFile}
                hidden
              />
            </label>

            <small className="pdf-note">* Upload PDF only</small>
            {errors.birthCertificate && (
              <small className="error">{errors.birthCertificate}</small>
            )}
          </div>

          {/* Educational Certificate */}
          <div className="upload-col">
            <label className="upload-title">Educational Certificate</label>

            <div className="mandatory-row">
              <div className="mandatory-dot">!</div>
              <div className="mandatory-pill">
                Both sides of Educational Certificate required.
              </div>
            </div>

            <label className="upload-field">
              <img src={uploadIcon} alt="upload" />
              <span>
                {formData.educationCertificate
                  ? formData.educationCertificate.name
                  : "Upload Educational Certificate"}
              </span>
              <input
                type="file"
                name="educationCertificate"
                accept=".pdf"
                onChange={handleFile}
                hidden
              />
            </label>

            <small className="pdf-note">* Upload PDF only</small>
            {errors.educationCertificate && (
              <small className="error">{errors.educationCertificate}</small>
            )}
          </div>

          {/* Transcript */}
          <div className="upload-col">
            <label className="upload-title">Transcript</label>

            <label className="upload-field">
              <img src={uploadIcon} alt="upload" />
              <span>{formData.transcript ? formData.transcript.name : "Upload Transcript"}</span>
              <input
                type="file"
                name="transcript"
                accept=".pdf"
                onChange={handleFile}
                hidden
              />
            </label>

            <small className="pdf-note">* Upload PDF only</small>
            {errors.transcript && <small className="error">{errors.transcript}</small>}
          </div>
        </div>
      </div>

      {/* ===== Work Information ===== */}
      <div className="info-box">
        <div className="info-header">
          <h3>Work Information</h3>
        </div>
        <hr />

        <div className="work-grid">
          {/* Date of Joining */}
          <div className="form-group">
            <label>Date of Joining</label>
            <div className="input-icon">
              <input
                ref={joinDateRef}
                type="date"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
              />
              <img
                src={calendarIcon}
                alt="calendar"
                className="calendar-icon"
                onClick={() => joinDateRef.current && joinDateRef.current.showPicker()}
              />
            </div>
            {errors.joinDate && <small className="error">{errors.joinDate}</small>}
          </div>

          {/* Designation */}
          <div className="form-group">
            <label>Designation</label>
            <div className="select-box">
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
              >
                <option value="">Select Designation</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="QA Engineer">QA Engineer</option>
                <option value="Project Manager">Project Manager</option>
              </select>
              <img src={dropdownIcon} alt="dropdown" className="dropdown-icon" />
            </div>
            {errors.designation && <small className="error">{errors.designation}</small>}
          </div>

          {/* Role */}
          <div className="form-group">
            <label>Role</label>
            <div className="select-box">
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
              </select>
              <img src={dropdownIcon} alt="dropdown" className="dropdown-icon" />
            </div>
            {errors.role && <small className="error">{errors.role}</small>}
          </div>

          {/* Management Role */}
          <div className="form-group">
            <label>Management Role</label>
            <div className="select-box">
              <select
                name="managementRole"
                value={formData.managementRole}
                onChange={handleChange}
              >
                <option value="">Select Management Role</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Team Lead">Team Lead</option>
              </select>
              <img src={dropdownIcon} alt="dropdown" className="dropdown-icon" />
            </div>
            {errors.managementRole && <small className="error">{errors.managementRole}</small>}
          </div>

          {/* Reporting Manager */}
          <div className="form-group">
            <label>Reporting Manager</label>
            <div className="select-box">
              <select
                name="reportingManager"
                value={formData.reportingManager}
                onChange={handleChange}
              >
                <option value="">Select Reporting Manager</option>
                <option value="Mr. Alex">Mr. Alex</option>
                <option value="Ms. Tina">Ms. Tina</option>
              </select>
              <img src={dropdownIcon} alt="dropdown" className="dropdown-icon" />
            </div>
            {errors.reportingManager && (
              <small className="error">{errors.reportingManager}</small>
            )}
          </div>
        </div>

        <div className="button-row">
          <button className="cancel-btn" onClick={() => navigate("/employees")}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>

      {/* ===== Success Popup ===== */}
      {showPopup && (
        <div className="success-popup">
          <div className="left-bar"></div>
          <img src={successIcon} alt="success" className="success-icon" />
          <span>Employee record submitted successfully.</span>
          <img
            src={closeIcon}
            alt="close"
            className="close-popup"
            onClick={() => setShowPopup(false)}
          />
        </div>
      )}
    </div>
  );
}

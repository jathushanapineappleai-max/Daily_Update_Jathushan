import React from "react";
import "../styles/edit_employee.css";

import backIcon from "../assets/icons/back.png";
import editIcon from "../assets/icons/edit.png";
import uploadIcon from "../assets/icons/upload.png";
import calendarIcon from "../assets/icons/calender_icon.png";
import dropdownIcon from "../assets/icons/dropdown.png";
import profilePic from "../assets/icons/profile.jpg";

export default function EditEmployee() {
  return (
    <div className="edit-wrapper">

      {/* ==== HEADER BOX ==== */}
      <div className="edit-header-box">
        <button className="back-btn">
          <img src={backIcon} alt="Back" />
        </button>
        <h2>Edit Employee</h2>
      </div>

      <div className="edit-grid">

        {/* ==== LEFT PANEL ==== */}
        <div className="left-col">

          {/* Profile Picture */}
          <div className="profile-card">
            <img src={profilePic} alt="Employee" className="profile-img" />

            <button className="profile-edit-btn">
              <img src={editIcon} alt="edit" />
            </button>
          </div>

          {/* Uploaded Documents */}
          <div className="doc-card">
            <h4>Uploaded Documents</h4>

            {[
              { label: "NIC", placeholder: "NIC document", error: true },
              { label: "Birth Certificate", placeholder: "Birth Certificate" },
              {
                label: "Educational Certificate",
                placeholder: "Educational Certificate",
                error: true,
              },
              { label: "Transcript", placeholder: "Transcript", error: true },
            ].map((item, index) => (
              <div className={`doc-field ${item.error ? "error" : ""}`} key={index}>
                <label>{item.label}</label>
                <div className="doc-input">
                  <span>{item.placeholder}</span>
                  <img src={uploadIcon} alt="upload" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==== RIGHT PANEL ==== */}
        <div className="right-col">

          {/* Employee Info */}
          <div className="info-card">
            <h3>Employee Information</h3>

            <div className="info-grid">

              {/* Name */}
              <div className="info-field success">
                <label>Name</label>
                <p>S.Sanjeevan</p>
              </div>

              {/* Start Date */}
              <div className="info-field success">
                <label>Starts on</label>
                <p>14 Apr 2025</p>
                <img src={calendarIcon} className="icon" alt="" />
              </div>

              {/* End Date */}
              <div className="info-field success">
                <label>Ends on</label>
                <p>DD/MM/YYYY</p>
                <img src={calendarIcon} className="icon" alt="" />
              </div>

              {/* Employment Status */}
              <div className="info-field normal">
                <label>Employment Status</label>
                <p>Active</p>
                <img src={dropdownIcon} className="icon" alt="" />
              </div>

              {/* DOB */}
              <div className="info-field success">
                <label>Date of Birth</label>
                <p>20 Jan 1999</p>
                <img src={calendarIcon} className="icon" alt="" />
              </div>

              {/* Gender */}
              <div className="info-field success">
                <label>Gender</label>
                <p>Male</p>
                <img src={dropdownIcon} className="icon" alt="" />
              </div>

              {/* Email */}
              <div className="info-field success">
                <label>Email</label>
                <p>sample@gmail.com</p>
              </div>

              {/* Phone */}
              <div className="info-field success">
                <label>Phone Number</label>
                <p>+94 75 744 8876</p>
              </div>

              {/* Address */}
              <div className="info-field success">
                <label>Address</label>
                <p>Jaffna</p>
              </div>

              {/* Position */}
              <div className="info-field success">
                <label>Position</label>
                <p>Senior</p>
                <img src={dropdownIcon} className="icon" alt="" />
              </div>

              {/* Designation */}
              <div className="info-field success">
                <label>Designation</label>
                <p>UI/UX Engineer</p>
                <img src={dropdownIcon} className="icon" alt="" />
              </div>

              {/* Management Role */}
              <div className="info-field success">
                <label>Management Role</label>
                <p>CFO / Team Lead</p>
                <img src={dropdownIcon} className="icon" alt="" />
              </div>
            </div>
          </div>

          {/* ==== 3-Column Lower Section ==== */}
          <div className="bottom-info">

            {/* Professional Info */}
            <div className="small-card">
              <h3>Professional Information</h3>

              <div className="small-field">
                <label>Position</label>
                <p>None</p>
              </div>

              <div className="small-field">
                <label>Company Name</label>
                <p>None</p>
              </div>

              <div className="small-field">
                <label>Year of Experience</label>
                <p>None</p>
              </div>

              <button className="view-btn">
                <img src={dropdownIcon} alt="" />
                View more
              </button>
            </div>

            {/* Educational Info */}
            <div className="small-card">
              <h3>Educational Information</h3>

              <div className="small-field">
                <label>Educational Qualification</label>
                <p>Degree</p>
              </div>

              <div className="small-field">
                <label>Name of the Institute</label>
                <p>The Open University of Sri Lanka</p>
              </div>

              <div className="small-field">
                <label>Year of completion</label>
                <p>Present</p>
              </div>

              <button className="view-btn">
                <img src={dropdownIcon} alt="" />
                View more
              </button>
            </div>

            {/* Project Info */}
            <div className="small-card">
              <h3>Project Information</h3>

              <div className="small-field">
                <label>Team Lead</label>
                <p>Kishana</p>
              </div>

              <div className="small-field">
                <label>Current Project</label>
                <p>ERP System</p>
              </div>

              <div className="small-field">
                <label>Start Date</label>
                <p>16 Apr 2025</p>
                <img src={calendarIcon} className="icon" alt="" />
              </div>

              <button className="view-btn">
                <img src={dropdownIcon} alt="" />
                View more
              </button>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="footer-btns">
            <button className="cancel-btn">Cancel</button>
            <button className="save-btn">Save Changes</button>
          </div>

        </div>

      </div>
    </div>
  );
}



import React from "react";
import { useNavigate } from "react-router-dom";

import "../styles/employee_overview.css";

import backIcon from "../assets/icons/back.png";
import mailIcon from "../assets/icons/mail.png";
import copyIcon from "../assets/icons/copy.png";
import uploadIcon from "../assets/icons/epand_red.png";
import expandIcon from "../assets/icons/expand.png";
import profilePic from "../assets/icons/profile.jpg";
import attendanceIcon from "../assets/icons/attendance.png";
import structureIcon from "../assets/icons/structure.png";
import ratingIcon from "../assets/icons/rating.png";
import breakfastIcon from "../assets/icons/breakfast.png";

export default function EmployeeOverview() {
  const navigate = useNavigate();

  return (
    <div className="eov-page">
      <div className="eov-width">

        {/* HEADER */}
        <div className="eov-header">
          <button type="button" className="eov-back-btn" onClick={() => navigate("/employees")}>
            <img src={backIcon} alt="Back" className="eov-back-icon" />
          </button>
          <h2 className="eov-title">Employee Overview</h2>
        </div>

        {/* MAIN CONTENT */}
        <div className="eov-container">

          {/* LEFT PANEL */}
          <div className="eov-left">
            <div className="eov-profile-card">
              <img src={profilePic} alt="Profile" className="eov-profile-img" />
            </div>

            <div className="eov-basic">
              <div>
                <h3 className="eov-name">S. Sanjeevan</h3>
                <p className="eov-role">UI/UX Engineer</p>
              </div>
              <div className="eov-id-badge">52</div>
            </div>

            <div className="eov-promotions">
              <h4 className="eov-promotions-title">Promotions</h4>

              <div className="eov-timeline">
                <div className="eov-timeline-item">
                  <div className="eov-dot" />
                  <div className="eov-txt">
                    <h5>UI/UX Engineer Team Lead</h5>
                    <span>14th Oct 2025</span>
                  </div>
                </div>

                <div className="eov-timeline-item">
                  <div className="eov-dot" />
                  <div className="eov-txt">
                    <h5>Senior UI/UX Engineer</h5>
                    <span>13th Jun 2025</span>
                  </div>
                </div>

                <div className="eov-timeline-item">
                  <div className="eov-dot" />
                  <div className="eov-txt">
                    <h5>Associate UI/UX Engineer</h5>
                    <span>13th Jun 2025</span>
                  </div>
                </div>

                <div className="eov-timeline-item">
                  <div className="eov-dot" />
                  <div className="eov-txt">
                    <h5>UI/UX Engineer Intern</h5>
                    <span>13th Apr 2025</span>
                  </div>
                </div>
              </div>
            </div>

       <div className="eov-buttons">
            <button
              className="eov-green-btn"
                onClick={() => navigate("/attendance")}   
               >
               <img src={attendanceIcon} alt="" />
              <span>Attendance</span>
              </button>

           <button
  className="eov-green-btn"
  onClick={() => navigate("/org-hierarchy")}
>
  <img src={structureIcon} alt="" />
  <span>Reporting Structure</span>
</button>


              <button className="eov-green-btn">
                <img src={ratingIcon} alt="" />
                <span>Ratings</span>
              </button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="eov-right">

            {/* STATUS ROW */}
            <div className="eov-status-row">
              <div className="eov-status-card">
                <span className="eov-green-txt">Away for Breakfast</span>
                <img src={breakfastIcon} alt="" />
              </div>

              <div className="eov-status-card">
                <span className="eov-dark-txt">Employment Status</span>
                <div className="eov-status-pill">Active</div>
              </div>

              <div className="eov-status-card eov-docs">
                <span className="eov-red-txt">Uploaded Documents</span>
                <img src={uploadIcon} alt="" />
              </div>
            </div>

            {/* CARDS */}
            {/* Employee Information */}
            <section className="eov-card">
              <div className="eov-card-header">
                <h3>Employee Information</h3>
              </div>

              <div className="eov-grid">
                <div className="eov-info">
                  <label>Gender</label>
                  <p>Male</p>
                </div>

                <div className="eov-info">
                  <label>Date of Birth</label>
                  <p>20 Jan 1999</p>
                </div>

                <div className="eov-info eov-has-icon">
                  <label>Email</label>
                  <p>sample@gmail.com</p>
                  <img src={mailIcon} alt="" />
                </div>

                <div className="eov-info eov-has-icon">
                  <label>Phone Number</label>
                  <p>+94 75 744 8876</p>
                  <img src={copyIcon} alt="" />
                </div>

                <div className="eov-info">
                  <label>Address</label>
                  <p>Jaffna</p>
                </div>

                <div className="eov-info">
                  <label>Starts on</label>
                  <p>14 Apr 2025</p>
                </div>

                <div className="eov-info">
                  <label>Management Role</label>
                  <p>CFO</p>
                </div>

                <div className="eov-info">
                  <label>Designation</label>
                  <p>UI/UX Engineer</p>
                </div>

                <div className="eov-info">
                  <label>Department</label>
                  <p>UI/UX Design</p>
                </div>
              </div>
            </section>

            {/* Professional */}
            <section className="eov-card">
              <div className="eov-card-header">
                <h3>Professional Information</h3>
                <img src={expandIcon} alt="" />
              </div>

              <div className="eov-grid">
                <div className="eov-info">
                  <label>Position</label>
                  <p>None</p>
                </div>

                <div className="eov-info">
                  <label>Company Name</label>
                  <p>None</p>
                </div>

                <div className="eov-info">
                  <label>Year of Experience</label>
                  <p>None</p>
                </div>
              </div>
            </section>

            {/* Education */}
            <section className="eov-card">
              <div className="eov-card-header">
                <h3>Educational Information</h3>
                <img src={expandIcon} alt="" />
              </div>

              <div className="eov-grid">
                <div className="eov-info">
                  <label>Educational Qualification</label>
                  <p>Bachelor of Software Engineering</p>
                </div>

                <div className="eov-info">
                  <label>Name of the Institute</label>
                  <p>The Open University of Sri Lanka</p>
                </div>

                <div className="eov-info">
                  <label>Year of Completion</label>
                  <p>Present</p>
                </div>
              </div>
            </section>

            {/* Project */}
            <section className="eov-card">
              <div className="eov-card-header">
                <h3>Project Information</h3>
                <img src={expandIcon} alt="" />
              </div>

              <div className="eov-grid">
                <div className="eov-info">
                  <label>Team Lead</label>
                  <p>Kishana</p>
                </div>

                <div className="eov-info">
                  <label>Current Project</label>
                  <p>ERP System</p>
                </div>

                <div className="eov-info">
                  <label>Start Date</label>
                  <p>16 Apr 2025</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

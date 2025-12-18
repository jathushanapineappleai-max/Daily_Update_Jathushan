import React, { useState } from "react";
import "../styles/add_employee_step2.css";
import { useNavigate } from "react-router-dom";

// ✅ Local PNG icons
import backIcon from "../assets/icons/back.png";
import dropdownIcon from "../assets/icons/dropdown.png";
import plusIcon from "../assets/icons/plus.png";

export default function AddEmployeeStep2() {
  const navigate = useNavigate();

  const [education, setEducation] = useState({
    qualification: "",
    institution: "",
    year: "",
  });

  const [experience, setExperience] = useState({
    position: "",
    company: "",
    years: "",
  });

  return (
    <div className="employee-step2-page">
      {/* ===== HEADER ===== */}
      <div className="employee-header">
        <div className="header-left" onClick={() => navigate("/employees/new")}>
          <img src={backIcon} alt="Back" className="back-icon" />
          <h2>New Employee</h2>
        </div>

        <div className="pagination">
          <div className="circle active">1</div>
          <div className="line active"></div>
          <div className="circle active">2</div>
          <div className="line"></div>
          <div className="circle"></div>
        </div>
      </div>

      {/* ===== EDUCATIONAL INFO ===== */}
      <div className="info-box">
        <div className="info-header">
          <h3>Educational Information</h3>
          <button className="add-btn">
            <img src={plusIcon} alt="Add" className="plus-icon" />
          </button>
        </div>
        <hr />

        <div className="form-grid">
          <div className="form-group">
            <label>Educational Qualification</label>
            <div className="input-icon">
              <select
                name="qualification"
                value={education.qualification}
                onChange={(e) =>
                  setEducation({ ...education, qualification: e.target.value })
                }
              >
                <option value="">Choose a qualification</option>
                <option>Bachelor’s Degree</option>
                <option>Master’s Degree</option>
                <option>Diploma</option>
                <option>Other</option>
              </select>
              <img src={dropdownIcon} alt="Dropdown" className="dropdown-icon" />
            </div>
          </div>

          <div className="form-group">
            <label>Name of Institution</label>
            <input
              type="text"
              name="institution"
              placeholder="e.g., Jaffna University"
              value={education.institution}
              onChange={(e) =>
                setEducation({ ...education, institution: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Year of completion</label>
            <div className="input-icon">
              <select
                name="year"
                value={education.year}
                onChange={(e) =>
                  setEducation({ ...education, year: e.target.value })
                }
              >
                <option>Present</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
                <option>Before 2022</option>
              </select>
              <img src={dropdownIcon} alt="Dropdown" className="dropdown-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== PROFESSIONAL INFO ===== */}
      <div className="info-box">
        <div className="info-header">
          <h3>Professional Information</h3>
          <button className="add-btn">
            <img src={plusIcon} alt="Add" className="plus-icon" />
          </button>
        </div>
        <hr />

        <div className="form-grid">
          <div className="form-group">
            <label>Position / Role</label>
            <input
              type="text"
              name="position"
              placeholder="e.g., Software Engineer"
              value={experience.position}
              onChange={(e) =>
                setExperience({ ...experience, position: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              name="company"
              placeholder="e.g., Microsoft Corporation"
              value={experience.company}
              onChange={(e) =>
                setExperience({ ...experience, company: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Years of Experience</label>
            <div className="input-icon">
              <select
                name="years"
                value={experience.years}
                onChange={(e) =>
                  setExperience({ ...experience, years: e.target.value })
                }
              >
                <option>None</option>
                <option>1–2 years</option>
                <option>3–5 years</option>
                <option>5+ years</option>
              </select>
              <img src={dropdownIcon} alt="Dropdown" className="dropdown-icon" />
            </div>
          </div>
        </div>

        <div className="button-row">
          <button className="cancel-btn" onClick={() => navigate("/employees")}>
            Cancel
          </button>
          <button
            className="create-btn"
            onClick={() => navigate("/employees/step3")}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

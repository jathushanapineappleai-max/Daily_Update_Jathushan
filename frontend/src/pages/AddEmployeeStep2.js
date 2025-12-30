import React, { useState } from "react";
import "../styles/add_employee_step2.css";
import { useNavigate } from "react-router-dom";
import employeeAPI from "../integration/employeeAPI"; // Import the employee API

// ✅ Local PNG icons
import backIcon from "../assets/icons/back.png";
import dropdownIcon from "../assets/icons/dropdown.png";

export default function AddEmployeeStep2() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

  // Handle education form submission
  const handleAddEducation = async () => {
    const employeeId = sessionStorage.getItem("newEmployeeId");
    if (!employeeId) {
      alert("Employee ID not found. Please start the process again.");
      navigate("/employees/new");
      return;
    }

    if (!education.qualification || !education.institution || !education.year) {
      alert("Please fill all education fields.");
      return;
    }

    setLoading(true);
    try {
      const educationData = {
        qualification: education.qualification,
        institution: education.institution,
        year_of_completion: education.year,
      };

      const response = await employeeAPI.addEmployeeEducation(
        employeeId,
        educationData
      );

      if (response.success) {
        alert("Education information added successfully!");
        // Reset form
        setEducation({
          qualification: "",
          institution: "",
          year: "",
        });
      } else {
        alert(response.message || "Failed to add education information");
      }
    } catch (error) {
      console.error("Error adding education:", error);
      alert(
        "An error occurred while adding education information: " +
          (error.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle experience form submission
  const handleAddExperience = async () => {
    const employeeId = sessionStorage.getItem("newEmployeeId");
    if (!employeeId) {
      alert("Employee ID not found. Please start the process again.");
      navigate("/employees/new");
      return;
    }

    if (!experience.position || !experience.company || !experience.years) {
      alert("Please fill all experience fields.");
      return;
    }

    setLoading(true);
    try {
      const experienceData = {
        position: experience.position,
        company_name: experience.company,
        years_of_experience: experience.years,
      };

      const response = await employeeAPI.addEmployeeProfessional(
        employeeId,
        experienceData
      );

      if (response.success) {
        alert("Professional experience added successfully!");
        // Reset form
        setExperience({
          position: "",
          company: "",
          years: "",
        });
      } else {
        alert(response.message || "Failed to add professional experience");
      }
    } catch (error) {
      console.error("Error adding experience:", error);
      alert(
        "An error occurred while adding professional experience: " +
          (error.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle continue to next step
  const handleContinue = () => {
    const employeeId = sessionStorage.getItem("newEmployeeId");
    if (!employeeId) {
      alert("Employee ID not found. Please start the process again.");
      navigate("/employees/new");
      return;
    }
    navigate("/employees/step3");
  };

  return (
    <div className="employee-step2-page">
      {/* ===== HEADER ===== */}
      <div className="employee-header">
        <div className="header-left" onClick={() => navigate("/employees/new")}>
          <img src={backIcon} alt="Back" className="back-icon" />
          <h2>New Employee</h2>
        </div>

        <div className="pagination">
          <div className="circle done">1</div>
          <div className="line active"></div>
          <div className="circle active">2</div>
          <div className="line"></div>
          <div className="circle">3</div>
        </div>
      </div>

      {/* ===== EDUCATIONAL INFO ===== */}
      <div className="info-box">
        <div className="info-header">
          <h3>Educational Information</h3>
          <button
            className="add-btn"
            onClick={handleAddEducation}
            disabled={loading}
          >
            <span className="plus-icon">+</span>
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
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Diploma">Diploma</option>
                <option value="Other">Other</option>
              </select>
              <img
                src={dropdownIcon}
                alt="Dropdown"
                className="dropdown-icon"
              />
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
                <option value="">Select Year</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="Before 2020">Before 2020</option>
              </select>
              <img
                src={dropdownIcon}
                alt="Dropdown"
                className="dropdown-icon"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== PROFESSIONAL INFO ===== */}
      <div className="info-box">
        <div className="info-header">
          <h3>Professional Information</h3>
          <button
            className="add-btn"
            onClick={handleAddExperience}
            disabled={loading}
          >
            <span className="plus-icon">+</span>
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
                <option value="">Select Experience</option>
                <option value="None">None</option>
                <option value="1-2 years">1-2 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
              <img
                src={dropdownIcon}
                alt="Dropdown"
                className="dropdown-icon"
              />
            </div>
          </div>
        </div>

        <div className="button-row">
          <button
            className="cancel-btn"
            onClick={() => navigate("/employees")}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="create-btn"
            onClick={handleContinue}
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

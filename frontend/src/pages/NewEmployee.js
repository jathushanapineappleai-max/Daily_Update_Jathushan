import React, { useState, useRef } from "react";
import "../styles/new_employee.css";
import { useNavigate } from "react-router-dom";
import employeeAPI from "../integration/employeeAPI"; // Import the employee API

// ✅ Local icon imports
import backIcon from "../assets/icons/back.png";
import calendarIcon from "../assets/icons/calender.png";
import refreshIcon from "../assets/icons/password.png";
import defaultProfile from "../assets/icons/profile_default.png";

export default function NewEmployee() {
  const navigate = useNavigate();
  const dateInputRef = useRef(null); // For calendar
  const fileInputRef = useRef(null); // ✅ For image upload

  const [preview, setPreview] = useState(null); // ✅ Image preview state
  const [loading, setLoading] = useState(false); // Loading state for API calls

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    phone: "",
    address: "",
    email: "",
    empId: "",
    password: "",
    userEmail: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ Password Generator
  const generatePassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let newPass = "";
    for (let i = 0; i < 8; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password: newPass }));
  };

  // ✅ Open File Explorer
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // ✅ Handle Image Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageURL = URL.createObjectURL(file);
      setPreview(imageURL);
    }
  };

  // ✅ Simple Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.dob) newErrors.dob = "Date of Birth is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.empId.trim()) newErrors.empId = "Employee ID is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    if (!formData.userEmail.trim())
      newErrors.userEmail = "User Email is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Submit
  const handleCreate = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        // Prepare data for API call
        const employeeData = {
          first_name: formData.name,
          email: formData.userEmail,
          emp_id: formData.empId,
          gender: formData.gender,
          dob: formData.dob,
          phone: formData.phone,
          address: formData.address,
          password: formData.password,
        };

        // Call the API to create employee personal information
        const response = await employeeAPI.createEmployeePersonal(employeeData);

        if (response.success) {
          // Store the user ID in session storage for the next steps
          sessionStorage.setItem("newEmployeeId", response.data.user_id);

          // Navigate to step 2
          navigate("/employees/step2");
        } else {
          alert(response.message || "Failed to create employee");
        }
      } catch (error) {
        console.error("Error creating employee:", error);
        alert(
          "An error occurred while creating the employee: " +
            (error.message || "Unknown error")
        );
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please fill all required fields correctly.");
    }
  };

  return (
    <div className="employee-page">
      {/* ===== HEADER ===== */}
      <div className="employee-header">
        <div className="header-left" onClick={() => navigate("/employees")}>
          <img src={backIcon} alt="Back" className="back-icon" />
          <h2>New Employee</h2>
        </div>

        <div className="pagination">
          <div className={`circle ${true ? "active" : ""}`}>1</div>
          <div className="line"></div>
          <div className="circle">2</div>
          <div className="line"></div>
          <div className="circle">3</div>
        </div>
      </div>

      {/* ===== PERSONAL INFO ===== */}
      <div className="info-box">
        <div className="info-header">
          <h3>Personal Information</h3>

          <div className="upload-section">
            <button
              type="button"
              className="upload-btn"
              onClick={handleUploadClick}
            >
              Upload Picture
            </button>

            {/* ✅ Hidden Only-Image File Input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileChange}
            />

            {/* ✅ Profile Image Preview */}
            <div className="profile-box">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              ) : (
                <img
                  src={defaultProfile}
                  alt="Default Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <hr />

        <div className="form-grid">
          {/* Name */}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Sanjeevan"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <small className="error">{errors.name}</small>}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Choose your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <small className="error">{errors.gender}</small>}
          </div>

          {/* DOB */}
          <div className="form-group">
            <label>Date of Birth</label>
            <div className="input-icon">
              <input
                ref={dateInputRef}
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
              <img
                src={calendarIcon}
                alt="Calendar"
                className="calendar-icon"
                onClick={() =>
                  dateInputRef.current && dateInputRef.current.showPicker()
                }
              />
            </div>
            {errors.dob && <small className="error">{errors.dob}</small>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone number</label>
            <input
              type="text"
              name="phone"
              placeholder="e.g., +94 XX XXXXXXX"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <small className="error">{errors.phone}</small>}
          </div>

          {/* Address */}
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="e.g., Urumpirai east, urumpirai"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && (
              <small className="error">{errors.address}</small>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="e.g., example@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>
        </div>
      </div>

      {/* ===== USER CREDENTIALS ===== */}
      <div className="info-box">
        <div className="info-header">
          <h3>User Credentials</h3>
        </div>
        <hr />

        <div className="form-grid">
          {/* Employee ID */}
          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              name="empId"
              placeholder="52"
              value={formData.empId}
              onChange={handleChange}
            />
            {errors.empId && <small className="error">{errors.empId}</small>}
          </div>

          {/* ✅ Password */}
          <div className="form-group password-group">
            <label>Password</label>

            <div className="input-icon password-input-wrapper">
              <input
                type="text"
                name="password"
                placeholder="tyexdkrws"
                value={formData.password}
                onChange={handleChange}
                className="password-input"
              />

              <img
                src={refreshIcon}
                alt="Refresh"
                className="password-refresh-icon"
                onClick={generatePassword}
              />
            </div>

            {errors.password && (
              <small className="error">{errors.password}</small>
            )}
          </div>

          {/* User Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="userEmail"
              placeholder="example.pineappleai@gmail.com"
              value={formData.userEmail}
              onChange={handleChange}
            />
            {errors.userEmail && (
              <small className="error">{errors.userEmail}</small>
            )}
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
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

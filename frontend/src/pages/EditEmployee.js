import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import "../styles/edit_employee.css";
import employeeAPI from "../integration/employeeAPI";

import backIcon from "../assets/icons/back.png";
import editIcon from "../assets/icons/edit.png";
import uploadIcon from "../assets/icons/upload.png";
import calendarIcon from "../assets/icons/calender_icon.png";
import dropdownIcon from "../assets/icons/dropdown.png";
import profilePic from "../assets/icons/profile.jpg";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    dob: "",
    phone: "",
    address: "",
    designation: "",
    management_role: "",
    role: "",
    department: ""
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await employeeAPI.getEmployeeById(id);
        const user = res.data.user;

        setEmployeeData(user);
        setFormData({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          gender: user.EmployeeDetail?.gender || "",
          dob: user.EmployeeDetail?.dob || "",
          phone: user.EmployeeDetail?.phone || "",
          address: user.EmployeeDetail?.address || "",
          designation: user.designation || "",
          management_role: user.management_role || "",
          role: user.role || "",
          department: user.department_id || ""
        });
      } catch (error) {
        console.error("Error fetching employee:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNameChange = (e) => {
    const [first, ...last] = e.target.value.split(" ");
    setFormData({ ...formData, first_name: first || "", last_name: last.join(" ") || "" });
  };

  const handleProfileImageClick = () => {
    document.getElementById('profileImageUpload').click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image format
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload image to backend (you might want to implement this separately)
      // employeeAPI.uploadEmployeeProfilePhoto(id, uploadFormData);
    }
  };

  const handleSave = async () => {
    setUpdateLoading(true);
    try {
      await employeeAPI.updateEmployeePersonal(id, {
        ...formData,
        emp_id: employeeData?.emp_id || ""
      });
      
      // Update the employeeData state with the response
      const updatedUserData = {
        ...employeeData,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        designation: formData.designation,
        management_role: formData.management_role,
        role: formData.role,
        department_id: formData.department,
        EmployeeDetail: {
          ...employeeData.EmployeeDetail,
          gender: formData.gender,
          dob: formData.dob,
          phone: formData.phone,
          address: formData.address
        }
      };
      
      setEmployeeData(updatedUserData);
      
      alert('Employee information updated successfully!');
      navigate('/employees', { state: { refresh: true } });
    } catch (error) {
      console.error("Error updating employee:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <div className="edit-wrapper">Loading...</div>;

  return (
    <div className="edit-wrapper">

      {/* ==== HEADER BOX ==== */}
      <div className="edit-header-box">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <img src={backIcon} alt="Back" />
        </button>
        <h2>Edit Employee</h2>
      </div>

      <div className="edit-grid">

        {/* ==== LEFT PANEL ==== */}
        <div className="left-col">

          {/* Profile Picture */}
          <div className="profile-card">
            <img 
              src={imagePreview || (employeeData?.EmployeeDetail?.image_path ? 
                `${process.env.REACT_APP_API_BASE_URL?.replace("/api", "")}${employeeData.EmployeeDetail.image_path}` : 
                profilePic)} 
              alt="Employee" 
              className="profile-img" 
            />

            <button className="profile-edit-btn" onClick={handleProfileImageClick}>
              <img src={editIcon} alt="edit" />
            </button>
            
            {/* Hidden file input for image upload */}
            <input
              type="file"
              id="profileImageUpload"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
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
                <input
                  type="text"
                  value={`${formData.first_name} ${formData.last_name}`.trim()}
                  onChange={handleNameChange}
                  placeholder="Full Name"
                />
              </div>

              {/* Start Date */}
              <div className="info-field success">
                <label>Starts on</label>
                <input
                  type="date"
                  name="joined_date"
                  value={formData.joined_date}
                  onChange={handleChange}
                />
                <img src={calendarIcon} className="icon" alt="" />
              </div>

              {/* End Date */}
              <div className="info-field success">
                <label>Ends on</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                />
                <img src={calendarIcon} className="icon" alt="" />
              </div>

              {/* Employment Status */}
              <div className="info-field normal">
                <label>Employment Status</label>
                <select
                  name="status"
                  value={formData.status || 'Active'}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Terminated">Terminated</option>
                </select>
                <img src={dropdownIcon} className="icon" alt="" />
              </div>

              {/* DOB */}
              <div className="info-field success">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
                <img src={calendarIcon} className="icon" alt="" />
              </div>

              {/* Gender */}
              <div className="info-field success">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <img src={dropdownIcon} className="icon" alt="" />
              </div>

              {/* Email */}
              <div className="info-field success">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </div>

              {/* Phone */}
              <div className="info-field success">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                />
              </div>

              {/* Address */}
              <div className="info-field success">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                />
              </div>

              {/* Role */}
              <div className="info-field success">
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="CMO">CMO</option>
                  <option value="PM">PM</option>
                  <option value="Senior">Senior</option>
                  <option value="Team Leader">Team Leader</option>
                  <option value="Associate">Associate</option>
                  <option value="Intern">Intern</option>
                </select>
                <img src={dropdownIcon} className="icon" alt="" />
              </div>

              {/* Designation */}
              <div className="info-field success">
                <label>Designation</label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                >
                  <option value="">Select Designation</option>
                  <option value="UI/UX Engineer">UI/UX Engineer</option>
                  <option value="QA Engineer">QA Engineer</option>
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="Back end Developer">Back end Developer</option>
                  <option value="Mobile App Developer">Mobile App Developer</option>
                  <option value="React Developer">React Developer</option>
                </select>
                <img src={dropdownIcon} className="icon" alt="" />
              </div>

              {/* Management Role */}
              <div className="info-field success">
                <label>Management Role</label>
                <select
                  name="management_role"
                  value={formData.management_role}
                  onChange={handleChange}
                >
                  <option value="">Select Management Role</option>
                  <option value="CMO">CMO</option>
                  <option value="PM">PM</option>
                  <option value="Senior">Senior</option>
                  <option value="Team Leader">Team Leader</option>
                  <option value="Associate">Associate</option>
                  <option value="Intern">Intern</option>
                </select>
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
            <button 
              className="cancel-btn"
              onClick={() => {
                // Reset form data to original values
                setFormData({
                  first_name: employeeData?.first_name || '',
                  last_name: employeeData?.last_name || '',
                  email: employeeData?.email || '',
                  gender: employeeData?.EmployeeDetail?.gender || '',
                  dob: employeeData?.EmployeeDetail?.dob || '',
                  phone: employeeData?.EmployeeDetail?.phone || '',
                  address: employeeData?.EmployeeDetail?.address || '',
                  designation: employeeData?.designation || '',
                  management_role: employeeData?.management_role || '',
                  role: employeeData?.role || '',
                  department: employeeData?.department_id || '',
                  joined_date: employeeData?.EmployeeDetail?.joined_date || '',
                  end_date: employeeData?.EmployeeDetail?.end_date || ''
                });
              }}
            >
              Cancel
            </button>
            <button 
              className="save-btn"
              onClick={handleSave}
              disabled={updateLoading}
            >
              {updateLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
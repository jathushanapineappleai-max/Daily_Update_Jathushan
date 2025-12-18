import React, { useRef, useState, useEffect, useRef as useRef2 } from "react";
import "../../styles/service_letter_template.css";
import calendarIcon from "../../assets/icons/calender_icon.png";
import dropdownIcon from "../../assets/icons/dropdown.png";
import searchIcon from "../../assets/icons/search.png";

const RESPONSIBILITIES_OPTIONS = [
  "Developing and maintaining mobile and web applications using JavaScript, React Native, React.js, Node.js and Laravel.",
  "Working on both front-end and back-end development.",
  "Designing and managing databases MySQL and MongoDB.",
  "Collaborating with cross-functional teams for project success.",
  "Ensuring high-quality code and best development practices.",
  "Designing user-friendly and responsive interfaces for Android platform.",
  "Implementing APIs and integrating third-party services.",
  "Web and mobile hosting responsibility.",
  "Project Management responsibility.",
  "Collaborating with UI/UX designers and backend developers to ensure seamless functionality."
];

const DESIGNATION_OPTIONS = [
  "Full Stack Engineer",
  "Frontend Developer",
  "Backend Developer"
];

const ROLE_OPTIONS = [
  "Intern",
  "Employee",
  "Team Lead"
];

/**
 * Inline custom select (no extra file/component required)
 *
 * Props:
 * - name: string (form field name)
 * - value: string
 * - onChange: function (expects an event-like object: { target: { name, value } })
 * - placeholder: string
 * - options: array of strings
 */
function InlineCustomSelect({ name, value, onChange, placeholder, options = [] }) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const wrapperRef = useRef2(null);
  const toggleRef = useRef2(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) setHighlighted(-1);
  }, [open]);

  const handleToggle = () => setOpen((s) => !s);

  const handleSelect = (opt) => {
    onChange && onChange({ target: { name, value: opt } });
    setOpen(false);
    toggleRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      setHighlighted((h) => Math.min(options.length - 1, h + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(0, h - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open && highlighted >= 0) {
        handleSelect(options[highlighted]);
      } else {
        setOpen((s) => !s);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="custom-dropdown" ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
      <button
        ref={toggleRef}
        type="button"
        className={`custom-dropdown-toggle ${open ? "open" : ""} ${value ? "has-value" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        <span className="custom-dropdown-text">{value || placeholder}</span>
        <img
          src={dropdownIcon}
          alt="toggle"
          className="dropdown-icon custom-dropdown-icon"
          /* <-- inverted rotation: closed -> 0deg (point down), open -> 180deg (point up) */
          style={{
            transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`
          }}
        />
      </button>

      {open && (
        <div className="custom-dropdown-menu" role="listbox" tabIndex={-1}>
          {options.map((opt, i) => {
            const isSelected = opt === value;
            const isHighlighted = i === highlighted;
            return (
              <div
                key={i}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                className={`custom-dropdown-item ${isSelected ? "selected" : ""} ${isHighlighted ? "highlighted" : ""}`}
                onMouseEnter={() => setHighlighted(i)}
                onMouseLeave={() => setHighlighted(-1)}
                onClick={() => handleSelect(opt)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(opt);
                  }
                }}
              >
                {opt}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ServiceLetterTemplate() {
  const date1 = useRef();
  const date2 = useRef();
  const date3 = useRef();

  const [form, setForm] = useState({
    name: "",
    designation: "",
    role: "",
    date: "",
    endDate: "",
    joinDate: ""
  });

  const [responsibilities, setResponsibilities] = useState(
    new Array(RESPONSIBILITIES_OPTIONS.length).fill(false)
  );

  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");

  const openCalendar = (ref) => {
    const el = ref.current;
    if (!el) return;
    if (el.type !== "date") el.type = "date";
    el.showPicker ? el.showPicker() : el.focus();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleResponsibilityChange = (index) => {
    const updated = [...responsibilities];
    updated[index] = !updated[index];
    setResponsibilities(updated);

    if (updated.some(Boolean)) {
      setErrors((prev) => ({ ...prev, responsibilities: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.designation) newErrors.designation = "Designation is required";
    if (!form.role) newErrors.role = "Role is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.endDate) newErrors.endDate = "End Date is required";
    if (!form.joinDate) newErrors.joinDate = "Join Date is required";

    if (!responsibilities.some(Boolean)) {
      newErrors.responsibilities = "Select at least one responsibility";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    if (validateForm()) {
      console.log("✅ Preview", form, responsibilities);
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      console.log("✅ Save", form, responsibilities);
    }
  };

  return (
    <div className="service-page-wrapper">
      <div className="service-template-wrapper">

        {/* HEADER WITH SEARCH */}
        <div className="service-template-header service-header-with-search">
          <h3>Service Letter</h3>

          <div className="service-search-box">
            <img src={searchIcon} className="service-search-icon" alt="search" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <form className="service-template-form">

          <div className="service-grid">

            {/* NAME */}
            <div className="service-group">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="e.g., Sanjeevan"
                className={errors.name ? "error-input" : ""} />
              {errors.name && <small className="error-text">{errors.name}</small>}
            </div>

            {/* DESIGNATION -> InlineCustomSelect */}
            <div className="service-group">
              <label>Designation</label>
              <div className="custom-select-wrapper">
                <InlineCustomSelect
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  placeholder="e.g,FullStack Engineer"
                  options={DESIGNATION_OPTIONS}
                />
              </div>
              {errors.designation && <small className="error-text">{errors.designation}</small>}
            </div>

            {/* ROLE -> InlineCustomSelect */}
            <div className="service-group">
              <label>Role</label>
              <div className="custom-select-wrapper">
                <InlineCustomSelect
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="e.g., Intern"
                  options={ROLE_OPTIONS}
                />
              </div>
              {errors.role && <small className="error-text">{errors.role}</small>}
            </div>

            {/* DATE */}
            <div className="service-group">
              <label>Date</label>
              <div className="date-input-wrapper">
                <input ref={date1} name="date" value={form.date}
                  onChange={handleChange}
                  placeholder="DD/MM/YYYY"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => !e.target.value && (e.target.type = "text")}
                  className={errors.date ? "error-input" : ""} />
                <img src={calendarIcon} className="date-icon"
                  onClick={() => openCalendar(date1)} alt="cal" />
              </div>
              {errors.date && <small className="error-text">{errors.date}</small>}
            </div>

            {/* END DATE */}
            <div className="service-group">
              <label>Date of Ending</label>
              <div className="date-input-wrapper">
                <input ref={date2} name="endDate" value={form.endDate}
                  onChange={handleChange} placeholder="DD/MM/YYYY"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => !e.target.value && (e.target.type = "text")}
                  className={errors.endDate ? "error-input" : ""} />
                <img src={calendarIcon} className="date-icon"
                  onClick={() => openCalendar(date2)} alt="cal" />
              </div>
              {errors.endDate && <small className="error-text">{errors.endDate}</small>}
            </div>

            {/* JOIN DATE */}
            <div className="service-group">
              <label>Date of Joining</label>
              <div className="date-input-wrapper">
                <input ref={date3} name="joinDate" value={form.joinDate}
                  onChange={handleChange} placeholder="DD/MM/YYYY"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => !e.target.value && (e.target.type = "text")}
                  className={errors.joinDate ? "error-input" : ""} />
                <img src={calendarIcon} className="date-icon"
                  onClick={() => openCalendar(date3)} alt="cal" />
              </div>
              {errors.joinDate && <small className="error-text">{errors.joinDate}</small>}
            </div>

          </div>

          {/* RESPONSIBILITIES */}
          <div className={"service-responsibilities" + (errors.responsibilities ? " resp-error" : "")}>
            <label className="resp-label">Responsibilities</label>
            <div className="checkbox-list">
              {RESPONSIBILITIES_OPTIONS.map((task, index) => (
                <label key={index} className="checkbox-item">
                  <input type="checkbox"
                    checked={responsibilities[index]}
                    onChange={() => handleResponsibilityChange(index)} />
                  <span>{task}</span>
                </label>
              ))}
            </div>
            {errors.responsibilities && <small className="error-text">{errors.responsibilities}</small>}
          </div>

          {/* PREVIEW + CANCEL */}
          <div className="service-inner-footer">
            <button className="cancel-btn" type="button">Cancel</button>
            <button className="preview-btn" type="button" onClick={handlePreview}>Preview</button>
          </div>

        </form>
      </div>

      {/* SAVE */}
      <div className="service-save-outside">
        <button className="save-btn" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

import React, { useRef, useState, useEffect, useRef as useRef2 } from "react";
import "../../styles/offer_letter_template.css";
import calendarIcon from "../../assets/icons/calender_icon.png";
import dropdownIcon from "../../assets/icons/dropdown.png";

export default function OfferLetterTemplate() {
  // Inline custom select component (no separate file)
  function InlineCustomSelect({ name, value, onChange, placeholder, options = [] }) {
    const [open, setOpen] = useState(false);
    const [highlighted, setHighlighted] = useState(-1);
    const wrapperRef = useRef2(null);
    const toggleRef = useRef2(null);

    useEffect(() => {
      function onDocClick(e) {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
      }
      document.addEventListener("mousedown", onDocClick);
      return () => document.removeEventListener("mousedown", onDocClick);
    }, [wrapperRef]);

    useEffect(() => { if (!open) setHighlighted(-1); }, [open]);

    const handleToggle = () => setOpen((s) => !s);

    const handleSelect = (opt) => {
      if (onChange) onChange({ target: { name, value: opt } });
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
        if (open && highlighted >= 0) handleSelect(options[highlighted]);
        else setOpen((s) => !s);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };

    return (
      <div className="inline-custom-select" ref={wrapperRef}>
        <button
          ref={toggleRef}
          type="button"
          className={`inline-select-toggle ${open ? "open" : ""} ${value ? "has-value" : ""}`}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="inline-select-text">{value || placeholder}</span>
          <img
            src={dropdownIcon}
            alt=""
            className="inline-select-icon"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            aria-hidden
          />
        </button>

        {open && (
          <div className="inline-select-menu" role="listbox" tabIndex={-1}>
            {options.map((opt, i) => {
              const isSelected = opt === value;
              const isHighlighted = i === highlighted;
              return (
                <div
                  key={opt + i}
                  role="option"
                  aria-selected={isSelected}
                  className={
                    "inline-select-item" +
                    (isSelected ? " selected" : "") +
                    (isHighlighted ? " highlighted" : "")
                  }
                  onMouseEnter={() => setHighlighted(i)}
                  onMouseLeave={() => setHighlighted(-1)}
                  onClick={() => handleSelect(opt)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelect(opt);
                    }
                  }}
                  tabIndex={0}
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

  // --- main OfferLetterTemplate state & functions (unchanged) ---
  const date1 = useRef();
  const date2 = useRef();
  const date3 = useRef();

  const [form, setForm] = useState({
    name: "",
    address: "",
    date: "",
    role: "",
    joiningDate: "",
    endingDate: "",
    department: "",
    manager: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  // Open native date picker
  const openCalendar = (ref) => {
    const el = ref.current;
    if (!el) return;
    if (el.type !== "date") el.type = "date";
    if (el.showPicker) el.showPicker();
    else {
      el.focus();
      el.click();
    }
  };

  // Handle change (works with InlineCustomSelect because it follows same event shape)
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.role) newErrors.role = "Role is required";
    if (!form.joiningDate) newErrors.joiningDate = "Joining date is required";
    if (!form.endingDate) newErrors.endingDate = "Ending date is required";
    if (!form.department.trim()) newErrors.department = "Department is required";
    if (!form.manager.trim()) newErrors.manager = "Manager is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    alert("✅ Offer Letter Saved Successfully!");
    console.log(form);
  };

  // Role options
  const ROLE_OPTIONS = ["Developer", "Designer", "HR Manager"];

  return (
    <div className="offer-page-wrapper">
      <div className="offer-template-wrapper">
        <div className="offer-template-header">
          <h3>Offer Letter</h3>
        </div>

        <form className="offer-template-form">
          <div className="offer-grid">
            {/* Name */}
            <div className="offer-group">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? "error-input" : ""}
                placeholder="e.g., Sanjeevan"
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            {/* Address */}
            <div className="offer-group">
              <label>Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className={errors.address ? "error-input" : ""}
                placeholder="e.g., Inuvil, Jaffna"
              />
              {errors.address && <p className="error-text">{errors.address}</p>}
            </div>

            {/* Date */}
            <div className="offer-group">
              <label>Date</label>
              <div className="date-input-wrapper">
                <input
                  ref={date1}
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  type="text"
                  className={`figma-date ${errors.date ? "error-input" : ""}`}
                  placeholder="DD/MM/YYYY"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => !e.target.value && (e.target.type = "text")}
                />
                <img src={calendarIcon} className="date-icon" alt="calendar" onClick={() => openCalendar(date1)} />
              </div>
              {errors.date && <p className="error-text">{errors.date}</p>}
            </div>

            {/* Role (INLINE CUSTOM SELECT) */}
            <div className="offer-group">
              <label>Role</label>
              <div className="custom-select-wrapper">
                <InlineCustomSelect
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="Select Role"
                  options={ROLE_OPTIONS}
                />
              </div>
              {errors.role && <p className="error-text">{errors.role}</p>}
            </div>

            {/* Date of Joining */}
            <div className="offer-group">
              <label>Date of Joining</label>
              <div className="date-input-wrapper">
                <input
                  ref={date2}
                  name="joiningDate"
                  value={form.joiningDate}
                  onChange={handleChange}
                  type="text"
                  className={`figma-date ${errors.joiningDate ? "error-input" : ""}`}
                  placeholder="DD/MM/YYYY"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => !e.target.value && (e.target.type = "text")}
                />
                <img src={calendarIcon} className="date-icon" alt="" onClick={() => openCalendar(date2)} />
              </div>
              {errors.joiningDate && <p className="error-text">{errors.joiningDate}</p>}
            </div>

            {/* Date of Ending */}
            <div className="offer-group">
              <label>Date of Ending</label>
              <div className="date-input-wrapper">
                <input
                  ref={date3}
                  name="endingDate"
                  value={form.endingDate}
                  onChange={handleChange}
                  type="text"
                  className={`figma-date ${errors.endingDate ? "error-input" : ""}`}
                  placeholder="DD/MM/YYYY"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => !e.target.value && (e.target.type = "text")}
                />
                <img src={calendarIcon} className="date-icon" alt="" onClick={() => openCalendar(date3)} />
              </div>
              {errors.endingDate && <p className="error-text">{errors.endingDate}</p>}
            </div>

            {/* Department */}
            <div className="offer-group">
              <label>Department</label>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                className={errors.department ? "error-input" : ""}
                placeholder="e.g., IT Department"
              />
              {errors.department && <p className="error-text">{errors.department}</p>}
            </div>

            {/* Reporting Manager */}
            <div className="offer-group">
              <label>Reporting Manager</label>
              <input
                name="manager"
                value={form.manager}
                onChange={handleChange}
                className={errors.manager ? "error-input" : ""}
                placeholder="e.g., Sanjeevan"
              />
              {errors.manager && <p className="error-text">{errors.manager}</p>}
            </div>

            {/* Reporting Manager Email */}
            <div className="offer-group">
              <label>Reporting Manager Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "error-input" : ""}
                placeholder="e.g., example@pineappleai.com"
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
          </div>

          <div className="offer-inner-footer">
            <button className="cancel-btn" type="button">Cancel</button>
            <button className="preview-btn" type="button">Preview</button>
          </div>
        </form>
      </div>

      <div className="offer-save-outside">
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}
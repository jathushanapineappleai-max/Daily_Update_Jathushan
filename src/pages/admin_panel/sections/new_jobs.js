// src/components/admin_panel/NewJobs.js
import React, { useState, useRef } from "react";
import "../../../styles/admin_panel/new_jobs.css";
import greenAdd from "../../../assets/icons/greenAdd.png";
import PostButton from "../../../components/admin_panel/buttons/post_button";
import Popup from "../../../components/admin_panel/popups/success";

// Validation functions
function validateJobTitle(title) {
  const s = (title || "").trim();
  if (!s) return "Job Title is required";
  // Allow letters, diacritics, numbers, spaces, and common punctuation used in job titles
  if (!/^[\p{L}\p{M}\p{N}\s'.\-&/()]+$/u.test(s)) return "Job Title contains invalid characters";
  return null;
}

function validateJobDescription(desc) {
  const s = (desc || "").trim();
  if (!s) return "Job Description is required";
  return null;
}

function validateListItem(value, fieldName) {
  const s = (value || "").trim();
  if (!s) return null; // Allow empty for individual items
  if (!/^[\p{L}\p{M}\p{N}\s'.\-&/()]+$/u.test(s)) return `${fieldName} contains invalid characters`;
  return null;
}

// JobTitleField component
function JobTitleField({ value, setValue, error, setError, shake, setShake }) {
  const id = "jobTitleInput";
  const errId = `${id}-error`;

  const handleBlur = () => {
    const err = validateJobTitle(value);
    setError(err);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    if (error) setError(null);
    if (shake) setShake(false); // Reset shake if typing
  };

  return (
    <div className="nj-field">
      <label className="nj-label" htmlFor={id}>
        Job Title
      </label>

      <input
        id={id}
        name="jobTitle"
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`nj-input nj-input-title ${error ? "error" : ""} ${shake ? "shake" : ""}`}
        placeholder="Add a job title"
        autoComplete="off"
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errId : undefined}
        aria-required="true"
      />

      {error && (
        <span id={errId} className="field-error" role="alert" aria-live="assertive">
          {error}
        </span>
      )}
    </div>
  );
}

// JobDescriptionField component
function JobDescriptionField({ value, setValue, error, setError, shake, setShake }) {
  const id = "jobDescriptionInput";
  const errId = `${id}-error`;

  const handleBlur = () => {
    const err = validateJobDescription(value);
    setError(err);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    if (error) setError(null);
    if (shake) setShake(false); // Reset shake if typing
  };

  return (
    <div className="nj-field">
      <label className="nj-label" htmlFor={id}>
        Job Description
      </label>

      <textarea
        id={id}
        name="jobDescription"
        className={`nj-textarea nj-textarea-desc ${error ? "error" : ""} ${shake ? "shake" : ""}`}
        placeholder="Write a description about the company project"
        rows={5}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errId : undefined}
        aria-required="true"
      />

      {error && (
        <span id={errId} className="field-error" role="alert" aria-live="assertive">
          {error}
        </span>
      )}
      <div className="nj-divider" />
    </div>
  );
}

const NewJobs = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [skills, setSkills] = useState([""]);
  const [responsibilities, setResponsibilities] = useState([""]);
  const [benefits, setBenefits] = useState([""]);
  const [showPopup, setShowPopup] = useState(false);
  const [jobTitleError, setJobTitleError] = useState(null);
  const [jobDescriptionError, setJobDescriptionError] = useState(null);
  const [shakeTitle, setShakeTitle] = useState(false);
  const [shakeDescription, setShakeDescription] = useState(false);

  // Additional states for list fields
  const [skillsErrors, setSkillsErrors] = useState([null]);
  const [skillsSectionError, setSkillsSectionError] = useState(null);
  const [shakeSkills, setShakeSkills] = useState([false]);

  const [responsibilitiesErrors, setResponsibilitiesErrors] = useState([null]);
  const [responsibilitiesSectionError, setResponsibilitiesSectionError] = useState(null);
  const [shakeResponsibilities, setShakeResponsibilities] = useState([false]);

  const [benefitsErrors, setBenefitsErrors] = useState([null]);
  const [benefitsSectionError, setBenefitsSectionError] = useState(null);
  const [shakeBenefits, setShakeBenefits] = useState([false]);

  const wrapperRef = useRef(null);

  // Handlers for skills
  const handleSkillsChange = (idx, value) => {
    const copy = [...skills];
    copy[idx] = value;
    setSkills(copy);

    if (skillsErrors[idx]) {
      const errCopy = [...skillsErrors];
      errCopy[idx] = null;
      setSkillsErrors(errCopy);
    }

    if (shakeSkills[idx]) {
      const shakeCopy = [...shakeSkills];
      shakeCopy[idx] = false;
      setShakeSkills(shakeCopy);
    }

    if (skillsSectionError) setSkillsSectionError(null);
  };

  const handleSkillsBlur = (idx) => {
    const err = validateListItem(skills[idx], "Skill & Requirement");
    const copy = [...skillsErrors];
    copy[idx] = err;
    setSkillsErrors(copy);
  };

  const handleAddSkill = () => {
    const newIndex = skills.length;
    setSkills([...skills, ""]);
    setSkillsErrors([...skillsErrors, null]);
    setShakeSkills([...shakeSkills, false]);
    setTimeout(() => {
      const element = document.getElementById(`skillsInput-${newIndex}`);
      if (element) element.focus();
    }, 0);
  };

  // Handlers for responsibilities
  const handleResponsibilitiesChange = (idx, value) => {
    const copy = [...responsibilities];
    copy[idx] = value;
    setResponsibilities(copy);

    if (responsibilitiesErrors[idx]) {
      const errCopy = [...responsibilitiesErrors];
      errCopy[idx] = null;
      setResponsibilitiesErrors(errCopy);
    }

    if (shakeResponsibilities[idx]) {
      const shakeCopy = [...shakeResponsibilities];
      shakeCopy[idx] = false;
      setShakeResponsibilities(shakeCopy);
    }

    if (responsibilitiesSectionError) setResponsibilitiesSectionError(null);
  };

  const handleResponsibilitiesBlur = (idx) => {
    const err = validateListItem(responsibilities[idx], "Key Responsibility");
    const copy = [...responsibilitiesErrors];
    copy[idx] = err;
    setResponsibilitiesErrors(copy);
  };

  const handleAddResponsibility = () => {
    const newIndex = responsibilities.length;
    setResponsibilities([...responsibilities, ""]);
    setResponsibilitiesErrors([...responsibilitiesErrors, null]);
    setShakeResponsibilities([...shakeResponsibilities, false]);
    setTimeout(() => {
      const element = document.getElementById(`responsibilitiesInput-${newIndex}`);
      if (element) element.focus();
    }, 0);
  };

  // Handlers for benefits
  const handleBenefitsChange = (idx, value) => {
    const copy = [...benefits];
    copy[idx] = value;
    setBenefits(copy);

    if (benefitsErrors[idx]) {
      const errCopy = [...benefitsErrors];
      errCopy[idx] = null;
      setBenefitsErrors(errCopy);
    }

    if (shakeBenefits[idx]) {
      const shakeCopy = [...shakeBenefits];
      shakeCopy[idx] = false;
      setShakeBenefits(shakeCopy);
    }

    if (benefitsSectionError) setBenefitsSectionError(null);
  };

  const handleBenefitsBlur = (idx) => {
    const err = validateListItem(benefits[idx], "Benefit");
    const copy = [...benefitsErrors];
    copy[idx] = err;
    setBenefitsErrors(copy);
  };

  const handleAddBenefit = () => {
    const newIndex = benefits.length;
    setBenefits([...benefits, ""]);
    setBenefitsErrors([...benefitsErrors, null]);
    setShakeBenefits([...shakeBenefits, false]);
    setTimeout(() => {
      const element = document.getElementById(`benefitsInput-${newIndex}`);
      if (element) element.focus();
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate title and description
    const titleErr = validateJobTitle(jobTitle);
    const descErr = validateJobDescription(jobDescription);
    setJobTitleError(titleErr);
    setJobDescriptionError(descErr);

    if (titleErr) {
      setShakeTitle(true);
      setTimeout(() => setShakeTitle(false), 400);
    }
    if (descErr) {
      setShakeDescription(true);
      setTimeout(() => setShakeDescription(false), 400);
    }

    // Validate skills
    const skillsItemErrs = skills.map((s) => validateListItem(s, "Skill & Requirement"));
    setSkillsErrors(skillsItemErrs);
    const filteredSkills = skills.filter((s) => s.trim() !== "").length;
    let skillsSectionErr = null;
    if (filteredSkills === 0) {
      skillsSectionErr = "At least one skill or requirement is required";
      setSkillsSectionError(skillsSectionErr);
    } else {
      setSkillsSectionError(null);
    }
    const hasSkillsItemErr = skillsItemErrs.some((err) => err !== null);
    const hasSkillsErr = hasSkillsItemErr || skillsSectionErr !== null;
    let skillsShakes = skillsItemErrs.map((err) => err !== null);
    if (skillsSectionErr !== null) {
      skillsShakes = skillsShakes.map(() => true); // Shake all if section error
    }
    setShakeSkills(skillsShakes);
    if (hasSkillsErr) {
      setTimeout(() => setShakeSkills(Array(skills.length).fill(false)), 400);
    }

    // Validate responsibilities
    const responsibilitiesItemErrs = responsibilities.map((r) =>
      validateListItem(r, "Key Responsibility")
    );
    setResponsibilitiesErrors(responsibilitiesItemErrs);
    const filteredResponsibilities = responsibilities.filter((r) => r.trim() !== "").length;
    let responsibilitiesSectionErr = null;
    if (filteredResponsibilities === 0) {
      responsibilitiesSectionErr = "At least one key responsibility is required";
      setResponsibilitiesSectionError(responsibilitiesSectionErr);
    } else {
      setResponsibilitiesSectionError(null);
    }
    const hasResponsibilitiesItemErr = responsibilitiesItemErrs.some((err) => err !== null);
    const hasResponsibilitiesErr = hasResponsibilitiesItemErr || responsibilitiesSectionErr !== null;
    let responsibilitiesShakes = responsibilitiesItemErrs.map((err) => err !== null);
    if (responsibilitiesSectionErr !== null) {
      responsibilitiesShakes = responsibilitiesShakes.map(() => true);
    }
    setShakeResponsibilities(responsibilitiesShakes);
    if (hasResponsibilitiesErr) {
      setTimeout(() => setShakeResponsibilities(Array(responsibilities.length).fill(false)), 400);
    }

    // Validate benefits
    const benefitsItemErrs = benefits.map((b) => validateListItem(b, "Benefit"));
    setBenefitsErrors(benefitsItemErrs);
    const filteredBenefits = benefits.filter((b) => b.trim() !== "").length;
    let benefitsSectionErr = null;
    if (filteredBenefits === 0) {
      benefitsSectionErr = "At least one benefit is required";
      setBenefitsSectionError(benefitsSectionErr);
    } else {
      setBenefitsSectionError(null);
    }
    const hasBenefitsItemErr = benefitsItemErrs.some((err) => err !== null);
    const hasBenefitsErr = hasBenefitsItemErr || benefitsSectionErr !== null;
    let benefitsShakes = benefitsItemErrs.map((err) => err !== null);
    if (benefitsSectionErr !== null) {
      benefitsShakes = benefitsShakes.map(() => true);
    }
    setShakeBenefits(benefitsShakes);
    if (hasBenefitsErr) {
      setTimeout(() => setShakeBenefits(Array(benefits.length).fill(false)), 400);
    }

    // Prevent submit if any errors
    if (
      titleErr ||
      descErr ||
      hasSkillsErr ||
      hasResponsibilitiesErr ||
      hasBenefitsErr
    ) {
      return;
    }

    const payload = {
      id: Date.now().toString(),
      jobTitle: jobTitle.trim(),
      jobDescription: jobDescription.trim(),
      skills: skills.filter((s) => s.trim() !== ""),
      responsibilities: responsibilities.filter((r) => r.trim() !== ""),
      benefits: benefits.filter((b) => b.trim() !== ""),
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem("postedJobs")) || [];
      existing.unshift(payload);
      localStorage.setItem("postedJobs", JSON.stringify(existing));

      // notify other parts of app if needed
      window.dispatchEvent(new CustomEvent("jobsUpdated", { detail: payload }));

      // reset form
      setJobTitle("");
      setJobDescription("");
      setSkills([""]);
      setResponsibilities([""]);
      setBenefits([""]);
      setJobTitleError(null);
      setJobDescriptionError(null);
      setSkillsErrors([null]);
      setSkillsSectionError(null);
      setShakeSkills([false]);
      setResponsibilitiesErrors([null]);
      setResponsibilitiesSectionError(null);
      setShakeResponsibilities([false]);
      setBenefitsErrors([null]);
      setBenefitsSectionError(null);
      setShakeBenefits([false]);

      // Show success popup instead of alert
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (err) {
      console.error("Failed to save posted job", err);
      alert("Failed to post job. See console for details.");
    }
  };

  const handleWrapperWheel = (e) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // allow smooth vertical scroll when content overflows
    if (wrapper.scrollHeight > wrapper.clientHeight) {
      wrapper.scrollBy({ top: e.deltaY, left: 0, behavior: "smooth" });
      e.preventDefault();
    }
  };

  return (
    <div
      className="nj-form-wrapper"
      ref={wrapperRef}
      onWheel={handleWrapperWheel}
      aria-label="New job form wrapper"
    >
      <h2 className="nj-title">New Jobs</h2>

      <form className="nj-form" onSubmit={handleSubmit}>
        {/* Job Title */}
        <JobTitleField
          value={jobTitle}
          setValue={setJobTitle}
          error={jobTitleError}
          setError={setJobTitleError}
          shake={shakeTitle}
          setShake={setShakeTitle}
        />

        {/* Job Description */}
        <JobDescriptionField
          value={jobDescription}
          setValue={setJobDescription}
          error={jobDescriptionError}
          setError={setJobDescriptionError}
          shake={shakeDescription}
          setShake={setShakeDescription}
        />

        {/* Skills & Requirements */}
        <div className="nj-field nj-skill-row">
          <label className="nj-label" htmlFor="skillsInput-0">
            Skills &amp; Requirements
          </label>
          <div className="nj-items">
            {skills.map((val, idx) => (
              <div className="nj-skill-item" key={`skill-${idx}`}>
                <input
                  id={`skillsInput-${idx}`}
                  name={`skills[${idx}]`}
                  className={`nj-input nj-input-skills ${skillsErrors[idx] || skillsSectionError ? "error" : ""} ${
                    shakeSkills[idx] ? "shake" : ""
                  }`}
                  placeholder="Write a skill or requirement"
                  type="text"
                  aria-label={`Skill ${idx + 1}`}
                  value={val}
                  onChange={(e) => handleSkillsChange(idx, e.target.value)}
                  onBlur={() => handleSkillsBlur(idx)}
                  aria-invalid={(skillsErrors[idx] || skillsSectionError) ? "true" : "false"}
                  aria-describedby={
                    skillsErrors[idx] ? `skillsInput-${idx}-error` : undefined
                  }
                />
                {skillsErrors[idx] && (
                  <span
                    id={`skillsInput-${idx}-error`}
                    className="field-error"
                    role="alert"
                    aria-live="assertive"
                  >
                    {skillsErrors[idx]}
                  </span>
                )}
                {idx === skills.length - 1 && (
                  <button
                    type="button"
                    className="nj-add-btn"
                    aria-label="Add skill"
                    onClick={handleAddSkill}
                  >
                    <img src={greenAdd} alt="Add skill" className="add-icon" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {skillsSectionError && (
            <span
              id="skills-section-error"
              className="field-error"
              role="alert"
              aria-live="assertive"
            >
              {skillsSectionError}
            </span>
          )}
          <div className="nj-divider" />
        </div>

        {/* Key Responsibilities */}
        <div className="nj-field nj-skill-row">
          <label className="nj-label" htmlFor="responsibilitiesInput-0">
            Key Responsibilities
          </label>
          <div className="nj-items">
            {responsibilities.map((val, idx) => (
              <div className="nj-skill-item" key={`resp-${idx}`}>
                <input
                  id={`responsibilitiesInput-${idx}`}
                  name={`responsibilities[${idx}]`}
                  className={`nj-input nj-input-responsibilities ${
                    responsibilitiesErrors[idx] || responsibilitiesSectionError ? "error" : ""
                  } ${shakeResponsibilities[idx] ? "shake" : ""}`}
                  placeholder="Write about key responsibilities"
                  type="text"
                  aria-label={`Responsibility ${idx + 1}`}
                  value={val}
                  onChange={(e) => handleResponsibilitiesChange(idx, e.target.value)}
                  onBlur={() => handleResponsibilitiesBlur(idx)}
                  aria-invalid={(responsibilitiesErrors[idx] || responsibilitiesSectionError) ? "true" : "false"}
                  aria-describedby={
                    responsibilitiesErrors[idx]
                      ? `responsibilitiesInput-${idx}-error`
                      : undefined
                  }
                />
                {responsibilitiesErrors[idx] && (
                  <span
                    id={`responsibilitiesInput-${idx}-error`}
                    className="field-error"
                    role="alert"
                    aria-live="assertive"
                  >
                    {responsibilitiesErrors[idx]}
                  </span>
                )}
                {idx === responsibilities.length - 1 && (
                  <button
                    type="button"
                    className="nj-add-btn"
                    aria-label="Add responsibility"
                    onClick={handleAddResponsibility}
                  >
                    <img
                      src={greenAdd}
                      alt="Add responsibility"
                      className="add-icon"
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
          {responsibilitiesSectionError && (
            <span
              id="responsibilities-section-error"
              className="field-error"
              role="alert"
              aria-live="assertive"
            >
              {responsibilitiesSectionError}
            </span>
          )}
          <div className="nj-divider" />
        </div>

        {/* Benefits */}
        <div className="nj-field nj-skill-row">
          <label className="nj-label" htmlFor="benefitsInput-0">
            Benefits
          </label>
          <div className="nj-items">
            {benefits.map((val, idx) => (
              <div className="nj-skill-item" key={`benefit-${idx}`}>
                <input
                  id={`benefitsInput-${idx}`}
                  name={`benefits[${idx}]`}
                  className={`nj-input nj-input-benefits ${benefitsErrors[idx] || benefitsSectionError ? "error" : ""} ${
                    shakeBenefits[idx] ? "shake" : ""
                  }`}
                  placeholder="Write about benefits"
                  type="text"
                  aria-label={`Benefit ${idx + 1}`}
                  value={val}
                  onChange={(e) => handleBenefitsChange(idx, e.target.value)}
                  onBlur={() => handleBenefitsBlur(idx)}
                  aria-invalid={(benefitsErrors[idx] || benefitsSectionError) ? "true" : "false"}
                  aria-describedby={
                    benefitsErrors[idx] ? `benefitsInput-${idx}-error` : undefined
                  }
                />
                {benefitsErrors[idx] && (
                  <span
                    id={`benefitsInput-${idx}-error`}
                    className="field-error"
                    role="alert"
                    aria-live="assertive"
                  >
                    {benefitsErrors[idx]}
                  </span>
                )}
                {idx === benefits.length - 1 && (
                  <button
                    type="button"
                    className="nj-add-btn"
                    aria-label="Add benefit"
                    onClick={handleAddBenefit}
                  >
                    <img src={greenAdd} alt="Add benefit" className="add-icon" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {benefitsSectionError && (
            <span
              id="benefits-section-error"
              className="field-error"
              role="alert"
              aria-live="assertive"
            >
              {benefitsSectionError}
            </span>
          )}
          <div className="nj-divider" />
        </div>

        <PostButton type="submit" />
      </form>

      {showPopup && (
        <div className="popup-container">
          <Popup title="Post Success!" message="Your job has been posted successfully." />
        </div>
      )}
    </div>
  );
};

export default NewJobs;
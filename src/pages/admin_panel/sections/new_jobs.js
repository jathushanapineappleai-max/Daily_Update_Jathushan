// src/components/admin_panel/NewJobs.js
import React, { useState, useRef } from "react";
import "../../../styles/admin_panel/new_jobs.css";
import greenAdd from "../../../assets/icons/greenAdd.png";
import PostButton from "../../../components/admin_panel/buttons/post_button";
import Popup from "../../../components/admin_panel/popups/success";

const NewJobs = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [skills, setSkills] = useState([""]);
  const [responsibilities, setResponsibilities] = useState([""]);
  const [benefits, setBenefits] = useState([""]);
  const [showPopup, setShowPopup] = useState(false);

  const wrapperRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

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

      // Show success popup instead of alert
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (err) {
      console.error("Failed to save posted job", err);
      alert("Failed to post job. See console for details.");
    }
  };

  const updateArrayValue = (setFn, arr, idx, value) => {
    const copy = [...arr];
    copy[idx] = value;
    setFn(copy);
  };

  const addArrayItem = (setFn, arr, baseId) => {
    const newIndex = arr.length;
    setFn([...arr, ""]);

    // focus the newly added input after it appears in DOM
    setTimeout(() => {
      const element = document.getElementById(`${baseId}-${newIndex}`);
      if (element) element.focus();
    }, 0);
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
        <div className="nj-field">
          <label className="nj-label" htmlFor="jobTitleInput">
            Job Title
          </label>
          <input
            id="jobTitleInput"
            name="jobTitle"
            className="nj-input nj-input-title"
            placeholder="Add a job title"
            type="text"
            aria-label="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        {/* Job Description */}
        <div className="nj-field">
          <label className="nj-label" htmlFor="jobDescriptionInput">
            Job Description
          </label>
          <textarea
            id="jobDescriptionInput"
            name="jobDescription"
            className="nj-textarea nj-textarea-desc"
            placeholder="Write a description about the company project"
            rows={5}
            aria-label="Job Description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="nj-divider" />
        </div>

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
                  className="nj-input nj-input-skills"
                  placeholder="Write a skill or requirement"
                  type="text"
                  aria-label={`Skill ${idx + 1}`}
                  value={val}
                  onChange={(e) =>
                    updateArrayValue(setSkills, skills, idx, e.target.value)
                  }
                />
                {idx === skills.length - 1 && (
                  <button
                    type="button"
                    className="nj-add-btn"
                    aria-label="Add skill"
                    onClick={() => addArrayItem(setSkills, skills, "skillsInput")}
                  >
                    <img src={greenAdd} alt="Add skill" className="add-icon" />
                  </button>
                )}
              </div>
            ))}
          </div>
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
                  className="nj-input nj-input-responsibilities"
                  placeholder="Write about key responsibilities"
                  type="text"
                  aria-label={`Responsibility ${idx + 1}`}
                  value={val}
                  onChange={(e) =>
                    updateArrayValue(
                      setResponsibilities,
                      responsibilities,
                      idx,
                      e.target.value
                    )
                  }
                />
                {idx === responsibilities.length - 1 && (
                  <button
                    type="button"
                    className="nj-add-btn"
                    aria-label="Add responsibility"
                    onClick={() =>
                      addArrayItem(setResponsibilities, responsibilities, "responsibilitiesInput")
                    }
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
                  className="nj-input nj-input-benefits"
                  placeholder="Write about benefits"
                  type="text"
                  aria-label={`Benefit ${idx + 1}`}
                  value={val}
                  onChange={(e) =>
                    updateArrayValue(setBenefits, benefits, idx, e.target.value)
                  }
                />
                {idx === benefits.length - 1 && (
                  <button
                    type="button"
                    className="nj-add-btn"
                    aria-label="Add benefit"
                    onClick={() => addArrayItem(setBenefits, benefits, "benefitsInput")}
                  >
                    <img src={greenAdd} alt="Add benefit" className="add-icon" />
                  </button>
                )}
              </div>
            ))}
          </div>
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
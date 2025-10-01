import React, { useState } from "react";
import "../../../styles/admin_panel/new_jobs.css";

const NewJobs = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // initialize each group with one empty string so one input shows by default
  const [skills, setSkills] = useState([""]);
  const [responsibilities, setResponsibilities] = useState([""]);
  const [benefits, setBenefits] = useState([""]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      jobTitle,
      jobDescription,
      skills: skills.filter(s => s.trim() !== ""),
      responsibilities: responsibilities.filter(r => r.trim() !== ""),
      benefits: benefits.filter(b => b.trim() !== ""),
    };
    console.log("Posting job payload:", payload);
    // TODO: send payload to API / state management
  };

  /* generic helpers to update arrays */
  const updateArrayValue = (setFn, arr, idx, value) => {
    const copy = [...arr];
    copy[idx] = value;
    setFn(copy);
  };

  const addArrayItem = (setFn, arr) => {
    setFn([...arr, ""]);
  };

  return (
    <>
      <h2 className="nj-title">New Jobs</h2>

      <div className="nj-form-wrapper">
        <form className="nj-form" onSubmit={handleSubmit}>
          <div className="nj-field">
            <label className="nj-label" htmlFor="jobTitleInput">Job Title</label>
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

          <div className="nj-field">
            <label className="nj-label" htmlFor="jobDescriptionInput">Job Description</label>
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
            <label className="nj-label" htmlFor="skillsInput">Skills &amp; Requirements</label>

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
                    onChange={(e) => updateArrayValue(setSkills, skills, idx, e.target.value)}
                  />

                  {/* Only show the add button on the last item in the list (keeps UI tidy) */}
                  {idx === skills.length - 1 && (
                    <button
                      type="button"
                      className="nj-add-btn"
                      aria-label="Add skill"
                      onClick={() => addArrayItem(setSkills, skills)}
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="nj-divider" />
          </div>

          {/* Key Responsibilities */}
          <div className="nj-field nj-skill-row">
            <label className="nj-label" htmlFor="responsibilitiesInput">Key Responsibilities</label>

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
                    onChange={(e) => updateArrayValue(setResponsibilities, responsibilities, idx, e.target.value)}
                  />

                  {idx === responsibilities.length - 1 && (
                    <button
                      type="button"
                      className="nj-add-btn"
                      aria-label="Add responsibility"
                      onClick={() => addArrayItem(setResponsibilities, responsibilities)}
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="nj-divider" />
          </div>

          {/* Benefits */}
          <div className="nj-field nj-skill-row">
            <label className="nj-label" htmlFor="benefitsInput">Benefits</label>

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
                    onChange={(e) => updateArrayValue(setBenefits, benefits, idx, e.target.value)}
                  />

                  {idx === benefits.length - 1 && (
                    <button
                      type="button"
                      className="nj-add-btn"
                      aria-label="Add benefit"
                      onClick={() => addArrayItem(setBenefits, benefits)}
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="nj-divider" />
          </div>

          {/* bottom border element to ensure divider is visible under content */}
          <div className="nj-bottom-border" />

          {/* Post button bottom-right */}
          <button className="nj-post-button" type="submit">Post</button>
        </form>
      </div>
    </>
  );
};

export default NewJobs;
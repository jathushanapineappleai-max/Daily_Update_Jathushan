// src/pages/admin_panel/posted_jobs.js
import React, { useEffect, useState } from "react";
import "../../../styles/admin_panel/posted_jobs.css";

// icons (keep your existing paths)
import EditIcon from "../../../assets/icons/Frame.png";
import DeleteIcon from "../../../assets/icons/Vector.png";
import redX from "../../../assets/icons/redX.png";

// view more button component
import ViewMoreButton from "../../../components/admin_panel/buttons/viewmore_button";

const PostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [removing, setRemoving] = useState(new Set());
  const [editingJob, setEditingJob] = useState(null);

  const loadJobs = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("postedJobs")) || [];
      setJobs(stored);
    } catch (err) {
      console.error("Failed to parse postedJobs from localStorage", err);
      setJobs([]);
    }
  };

  useEffect(() => {
    loadJobs();
    const handler = () => loadJobs();
    window.addEventListener("jobsUpdated", handler);
    return () => window.removeEventListener("jobsUpdated", handler);
  }, []);

  const formatDate = (iso) => {
    try {
      const d = new Date(iso || Date.now());
      return d.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const handleEdit = (job) => {
    setEditingJob({ ...job }); // Copy to avoid mutating original
  };

  const handleDelete = (jobId, idx) => {
    if (!window.confirm("Delete this job? This action cannot be undone.")) return;

    const key = jobId ?? `idx-${idx}`;
    setRemoving((prev) => new Set(prev).add(key));

    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem("postedJobs")) || [];
        let remaining;
        if (jobId !== undefined && jobId !== null) {
          remaining = existing.filter((j) => j.id !== jobId);
        } else {
          remaining = existing.slice();
          if (idx >= 0 && idx < remaining.length) remaining.splice(idx, 1);
        }
        localStorage.setItem("postedJobs", JSON.stringify(remaining));
        setJobs(remaining);
        setRemoving((prev) => {
          const copy = new Set(prev);
          copy.delete(key);
          return copy;
        });
        window.dispatchEvent(new Event("jobsUpdated"));
      } catch (err) {
        console.error("Failed to delete job", err);
      }
    }, 260);
  };

  const handleViewMore = () => {
    window.dispatchEvent(new Event("viewMoreJobs"));
  };

  const handleUpdate = (updated) => {
    try {
      const existing = JSON.parse(localStorage.getItem("postedJobs")) || [];
      const index = existing.findIndex((j) => j.id === updated.id);
      if (index > -1) {
        existing[index] = updated;
        localStorage.setItem("postedJobs", JSON.stringify(existing));
        setJobs(existing);
        window.dispatchEvent(new Event("jobsUpdated"));
        setEditingJob(null);
        alert("Job updated successfully.");
      }
    } catch (err) {
      console.error("Failed to update job", err);
      alert("Failed to update job. See console for details.");
    }
  };

  return (
    <section className="posted_jobs-section">
      <div className="posted_jobs-inner">
        <h2 className="posted_jobs-title">Posted Jobs</h2>

        {jobs.length === 0 ? (
          <div className="posted_jobs-empty">No jobs posted yet.</div>
        ) : (
          <div className="posted_jobs-list">
            {jobs.map((job, idx) => {
              const keyId = job.id ?? `idx-${idx}`;
              const isRemoving = removing.has(job.id ?? `idx-${idx}`);
              return (
                <article
                  className={`job-card ${isRemoving ? "removing" : ""}`}
                  key={job.id ?? idx}
                >
                  <div className="job-left">
                    <h3 className="job-title">{job.jobTitle || "(No title)"}</h3>
                    <div className="job-date">
                      {formatDate(job.createdAt || job.date || job.created)}
                    </div>
                  </div>

                  <div className="job-actions">
                    <button
                      type="button"
                      className="job-action-btn edit"
                      onClick={() => handleEdit(job)}
                      aria-label="Edit job"
                    >
                      <img src={EditIcon} alt="Edit" />
                    </button>

                    <button
                      type="button"
                      className="job-action-btn delete"
                      onClick={() => handleDelete(job.id, idx)}
                      aria-label="Delete job"
                    >
                      <img src={DeleteIcon} alt="Delete" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="posted_jobs-footer">
          <ViewMoreButton label="View More" onClick={handleViewMore} showPopup={true} />
        </div>
      </div>

      {editingJob && (
        <div className="ej-modal" onClick={() => setEditingJob(null)}>
          <div className="ej-form-wrapper" onClick={(e) => e.stopPropagation()}>
            <EditJobForm job={editingJob} onUpdate={handleUpdate} />
          </div>
        </div>
      )}
    </section>
  );
};

const EditJobForm = ({ job, onUpdate }) => {
  const [jobTitle, setJobTitle] = useState(job.jobTitle || "");
  const [jobDescription, setJobDescription] = useState(job.jobDescription || "");
  const [skills, setSkills] = useState(job.skills && job.skills.length ? job.skills : [""]);
  const [responsibilities, setResponsibilities] = useState(job.responsibilities && job.responsibilities.length ? job.responsibilities : [""]);
  const [benefits, setBenefits] = useState(job.benefits && job.benefits.length ? job.benefits : [""]);

  const updateArrayValue = (setFn, arr, idx, value) => {
    const copy = [...arr];
    copy[idx] = value;
    setFn(copy);
  };

  const removeArrayItem = (setFn, arr, idx) => {
    setFn(arr.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...job, // Preserve id, createdAt, etc.
      jobTitle: jobTitle.trim(),
      jobDescription: jobDescription.trim(),
      skills: skills.filter((s) => s.trim() !== ""),
      responsibilities: responsibilities.filter((r) => r.trim() !== ""),
      benefits: benefits.filter((b) => b.trim() !== ""),
    };

    onUpdate(payload);
  };

  return (
    <>
      <h2 className="ej-title">Edit Jobs</h2>

      <form className="ej-form" onSubmit={handleSubmit}>
        <div className="ej-field">
          <label className="ej-label" htmlFor="jobTitleInput">Job Title</label>
          <input
            id="jobTitleInput"
            name="jobTitle"
            className="ej-input ej-input-title"
            placeholder="Add a job title"
            type="text"
            aria-label="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        <div className="ej-field">
          <label className="ej-label" htmlFor="jobDescriptionInput">Job Description</label>
          <textarea
            id="jobDescriptionInput"
            name="jobDescription"
            className="ej-textarea ej-textarea-desc"
            placeholder="Write a description about the company project"
            rows={5}
            aria-label="Job Description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="ej-divider" />
        </div>

        {/* Skills & Requirements */}
        <div className="ej-field ej-skill-row">
          <label className="ej-label" htmlFor="skillsInput">Skills & Requirements</label>

          <div className="ej-items">
            {skills.map((val, idx) => (
              <div className="ej-skill-item" key={`skill-${idx}`}>
                <input
                  id={`skillsInput-${idx}`}
                  name={`skills[${idx}]`}
                  className="ej-input ej-input-skills"
                  placeholder="Write a skill or requirement"
                  type="text"
                  aria-label={`Skill ${idx + 1}`}
                  value={val}
                  onChange={(e) => updateArrayValue(setSkills, skills, idx, e.target.value)}
                />

                <button
                  type="button"
                  className="ej-remove-btn"
                  aria-label="Remove skill"
                  onClick={() => removeArrayItem(setSkills, skills, idx)}
                >
                  <img src={redX} alt="Remove skill" className="remove-icon" />
                </button>
              </div>
            ))}
          </div>

          <div className="ej-divider" />
        </div>

        {/* Key Responsibilities */}
        <div className="ej-field ej-skill-row">
          <label className="ej-label" htmlFor="responsibilitiesInput">Key Responsibilities</label>

          <div className="ej-items">
            {responsibilities.map((val, idx) => (
              <div className="ej-skill-item" key={`resp-${idx}`}>
                <input
                  id={`responsibilitiesInput-${idx}`}
                  name={`responsibilities[${idx}]`}
                  className="ej-input ej-input-responsibilities"
                  placeholder="Write about key responsibilities"
                  type="text"
                  aria-label={`Responsibility ${idx + 1}`}
                  value={val}
                  onChange={(e) => updateArrayValue(setResponsibilities, responsibilities, idx, e.target.value)}
                />

                <button
                  type="button"
                  className="ej-remove-btn"
                  aria-label="Remove responsibility"
                  onClick={() => removeArrayItem(setResponsibilities, responsibilities, idx)}
                >
                  <img src={redX} alt="Remove responsibility" className="remove-icon" />
                </button>
              </div>
            ))}
          </div>

          <div className="ej-divider" />
        </div>

        {/* Benefits */}
        <div className="ej-field ej-skill-row">
          <label className="ej-label" htmlFor="benefitsInput">Benefits</label>

          <div className="ej-items">
            {benefits.map((val, idx) => (
              <div className="ej-skill-item" key={`benefit-${idx}`}>
                <input
                  id={`benefitsInput-${idx}`}
                  name={`benefits[${idx}]`}
                  className="ej-input ej-input-benefits"
                  placeholder="Write about benefits"
                  type="text"
                  aria-label={`Benefit ${idx + 1}`}
                  value={val}
                  onChange={(e) => updateArrayValue(setBenefits, benefits, idx, e.target.value)}
                />

                <button
                  type="button"
                  className="ej-remove-btn"
                  aria-label="Remove benefit"
                  onClick={() => removeArrayItem(setBenefits, benefits, idx)}
                >
                  <img src={redX} alt="Remove benefit" className="remove-icon" />
                </button>
              </div>
            ))}
          </div>

          <div className="ej-divider" />
        </div>

        <div className="ej-update-row">
          <button className="ej-update-button" type="submit">Update</button>
        </div>
      </form>
    </>
  );
};

export default PostedJobs;
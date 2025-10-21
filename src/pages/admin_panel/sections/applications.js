// applications.js
import React, { useState, useEffect, useRef } from "react";
import "../../../styles/admin_panel/applications.css";
import ViewMoreButton from "../../../components/admin_panel/buttons/viewmore_button";
import expand from "../../../assets/icons/expand.png";
import downloadCV from "../../../assets/icons/downloadCV.png";

export default function Applications() {
  const handleViewMore = () => {
    window.dispatchEvent(new Event("viewMoreJobs"));
  };

  // Load applications from localStorage
  const applications = JSON.parse(localStorage.getItem("applications")) || [];

  const [selectedApp, setSelectedApp] = useState(null);
  const closeBtnRef = useRef(null);

  const openModal = (app) => {
    setSelectedApp(app);
  };

  const closeModal = () => {
    setSelectedApp(null);
  };

  // Accessibility & keyboard handling
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && selectedApp) {
        closeModal();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedApp]);

  // Focus the close button when modal opens
  useEffect(() => {
    if (selectedApp && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [selectedApp]);

  return (
    <div className={`applications-section ${selectedApp ? "modal-open" : ""}`}>
      <div
        className="applications-inner"
        aria-hidden={!!selectedApp} /* hide background from assistive tech when modal open */
      >
        <h2 className="applications-title">Applications</h2>

        <div className="applications-content">
          {applications.length === 0 ? (
            <p>No applications yet.</p>
          ) : (
            applications.map((app, index) => (
              <div key={index} className="application-card">
                <div className="card-left">
                  <h3>
                    {app.firstName ? `${app.firstName[0]}.` : ""} {app.lastName || ""}
                  </h3>
                  <p>{app.language}</p>
                </div>
                <img
                  src={expand}
                  alt="Expand"
                  className="expand-icon"
                  onClick={() => openModal(app)}
                />
              </div>
            ))
          )}
        </div>

        <div className="application-footer">
          <ViewMoreButton label="View More" onClick={handleViewMore} showPopup={true} />
        </div>
      </div>

      {selectedApp && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label="Application details"
          onClick={(e) => {
            // close when clicking backdrop (only if clicked the overlay, not the panel)
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="modal-content" role="document">
            <button
              ref={closeBtnRef}
              className="modal-close"
              onClick={closeModal}
              aria-label="Close modal"
            >
              &times;
            </button>

            <div className="modal-grid">
              <div className="modal-row">
                <div className="modal-label">First Name</div>
                <div className="modal-value">{selectedApp.firstName || "-"}</div>
              </div>

              <div className="modal-row">
                <div className="modal-label">Last Name</div>
                <div className="modal-value">{selectedApp.lastName || "-"}</div>
              </div>

              <div className="modal-row">
                <div className="modal-label">Address</div>
                <div className="modal-value">{selectedApp.address || selectedApp.adress || "-"}</div>
              </div>

              <div className="modal-row">
                <div className="modal-label">District</div>
                <div className="modal-value">{selectedApp.district || "-"}</div>
              </div>

              <div className="modal-row">
                <div className="modal-label">Email</div>
                <div className="modal-value">{selectedApp.email || "-"}</div>
              </div>

              <div className="modal-row">
                <div className="modal-label">Phone Number</div>
                <div className="modal-value">{selectedApp.phone || "-"}</div>
              </div>

              <div className="modal-row">
                <div className="modal-label">LinkedIn</div>
                <div className="modal-value">
                  {selectedApp.linkedin ? (
                    <a
                      href={selectedApp.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-link"
                    >
                      {selectedApp.linkedin}
                    </a>
                  ) : (
                    "-"
                  )}
                </div>
              </div>

              <div className="modal-row">
                <div className="modal-label">Language</div>
                <div className="modal-value">{selectedApp.language || "-"}</div>
              </div>

              {/* Divider appears when CV exists (visually separates language and download area) */}
              {selectedApp.cvDataUrl && (
                <>
                  <div className="modal-divider" role="separator" aria-hidden="true" />

                  <div className="modal-row modal-actions">
                    <div className="modal-label" aria-hidden="true" />
                    <div className="modal-value--actions">
                      <a
                        className="cv-download-btn"
                        href={selectedApp.cvDataUrl}
                        download={selectedApp.cvName || "cv"}
                        aria-label={`Download CV for ${selectedApp.firstName || ""} ${
                          selectedApp.lastName || ""
                        }`}
                        title="Download CV"
                      >
                        <img src={downloadCV} alt="Download CV" className="cv-download-img" />
                        <span className="sr-only">Download CV</span>
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
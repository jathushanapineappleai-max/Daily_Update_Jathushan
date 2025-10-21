// client_review.js
import React, { useState, useRef } from "react";
import "../../../styles/admin_panel/client_review.css"; // adjust path if needed
import UploadIcon from "../../../assets/icons/uploadIcon.png";
import editIconSrc from "../../../assets/icons/Frame.png";
import deleteIconSrc from "../../../assets/icons/Vector.png";
import leftArrow from "../../../assets/icons/leftArrow.png";
import rightArrow from "../../../assets/icons/rightArrow.png";
import sort from "../../../assets/icons/sort_arrows.png";
import PostButton from "../../../components/admin_panel/buttons/post_button";
import UpdateButton from "../../../components/admin_panel/buttons/update_button";
import PaginationBar from "../../../components/admin_panel/pagination";


const ClientReview = ({ externalOnSubmit }) => {
  const [clientName, setClientName] = useState("");
  const [clientRole, setClientRole] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileObj, setFileObj] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editClientName, setEditClientName] = useState("");
  const [editClientRole, setEditClientRole] = useState("");
  const [editReviewText, setEditReviewText] = useState("");
  const [editFileName, setEditFileName] = useState("");
  const [editFileObj, setEditFileObj] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  // handle file selection for add form
  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setFileName(f.name);
      setFileObj(f);
    } else {
      setFileName("");
      setFileObj(null);
    }
  };

  // handle file selection for edit modal
  const handleEditFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setEditFileName(f.name);
      setEditFileObj(f);
    } else {
      setEditFileName("");
      setEditFileObj(null);
    }
  };

  // reset add form
  const resetForm = () => {
    setClientName("");
    setClientRole("");
    setReviewText("");
    setFileName("");
    setFileObj(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // submit for add (top form)
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert("Please enter a client name.");
      return;
    }
    if (!reviewText.trim()) {
      alert("Please write a review.");
      return;
    }

    const id = Date.now().toString();
    const fileUrl = fileObj ? URL.createObjectURL(fileObj) : null;

    const newReview = {
      id,
      name: clientName.trim(),
      role: clientRole.trim(),
      review: reviewText.trim(),
      fileName: fileObj ? fileObj.name : null,
      fileObj: fileObj || null,
      fileUrl,
    };

    setReviews((prev) => [newReview, ...prev]);

    // go to first page so user sees the new item
    setCurrentPage(1);

    // optional external submit handler (FormData)
    if (typeof externalOnSubmit === "function") {
      const fd = new FormData();
      fd.append("clientName", newReview.name);
      fd.append("clientRole", newReview.role);
      fd.append("reviewText", newReview.review);
      if (fileObj) fd.append("clientPhoto", fileObj);
      externalOnSubmit(fd);
    } else {
      // debug
      // console.log('New review', newReview);
    }

    resetForm();
  };

  // Open edit modal
  const handleEdit = (id) => {
    const r = reviews.find((x) => x.id === id);
    if (!r) return;
    setEditClientName(r.name || "");
    setEditClientRole(r.role || "");
    setEditReviewText(r.review || "");
    setEditFileName(r.fileName || "");
    setEditFileObj(null); // Reset file obj, user can re-upload if needed
    setEditingId(id);
    setShowModal(true);
  };

  // Submit for edit (modal)
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!editClientName.trim()) {
      alert("Please enter a client name.");
      return;
    }
    if (!editReviewText.trim()) {
      alert("Please write a review.");
      return;
    }

    const fileUrl = editFileObj ? URL.createObjectURL(editFileObj) : reviews.find((x) => x.id === editingId)?.fileUrl || null;

    const updatedReview = {
      id: editingId,
      name: editClientName.trim(),
      role: editClientRole.trim(),
      review: editReviewText.trim(),
      fileName: editFileObj ? editFileObj.name : editFileName,
      fileObj: editFileObj || null,
      fileUrl,
    };

    setReviews((prev) =>
      prev.map((r) => (r.id === editingId ? { ...r, ...updatedReview } : r))
    );

    // optional external submit handler (FormData)
    if (typeof externalOnSubmit === "function") {
      const fd = new FormData();
      fd.append("clientName", updatedReview.name);
      fd.append("clientRole", updatedReview.role);
      fd.append("reviewText", updatedReview.review);
      if (editFileObj) fd.append("clientPhoto", editFileObj);
      externalOnSubmit(fd);
    } else {
      // debug
      // console.log('Updated review', updatedReview);
    }

    setShowModal(false);
    setEditingId(null);
  };

  // Close modal without saving
  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  // delete existing
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    setReviews((prev) => {
      const newReviews = prev.filter((r) => r.id !== id);
      const newTotalPages = Math.max(1, Math.ceil(newReviews.length / rowsPerPage));
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
      return newReviews;
    });
  };

  // pagination helpers
  const total = reviews.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const start = total > 0 ? startIndex + 1 : 0;
  const end = total > 0 ? Math.min(startIndex + rowsPerPage, total) : 0;
  const currentSlice = reviews.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (p) => {
    setCurrentPage(p);
  };

  const handleRowsPerPageChange = (size) => {
    setRowsPerPage(size);
  };

  // Avatar helper (image preview or initials)
  const Avatar = ({ name, fileUrl }) => {
    const initials = (name || "")
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    return (
      <div className="cr-avatar">
        {fileUrl ? <img src={fileUrl} alt={name} /> : <div className="cr-avatar-initials">{initials || "U"}</div>}
      </div>
    );
  };

  return (
    <div className="client-review-container">
      <div className={`cr-main-content ${showModal ? 'blurred' : ''}`}>
        {/* Title & Add Form */}
        <div className="cr-title">Client Reviews</div>

        <form className="cr-form" onSubmit={handleAddSubmit} aria-labelledby="cr-title">
          <div className="cr-row-top">
            <div className="cr-field">
              <label className="cr-label" htmlFor="clientName">
                Name
              </label>
              <input
                id="clientName"
                className="cr-input"
                placeholder="Add client name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                name="clientName"
                type="text"
                autoComplete="off"
              />
            </div>

            <div className="cr-field">
              <label className="cr-label" htmlFor="clientRole">
                Role
              </label>
              <input
                id="clientRole"
                className="cr-input"
                placeholder="Add client role"
                value={clientRole}
                onChange={(e) => setClientRole(e.target.value)}
                name="clientRole"
                type="text"
              />
            </div>

            <div className="cr-field">
              <label className="cr-label" htmlFor="clientPhoto">
                Client Photo
              </label>

              <div
                className="cr-file-wrap"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current && fileInputRef.current.click();
                  }
                }}
              >
                <input ref={fileInputRef} id="clientPhoto" type="file" accept="image/*" onChange={handleFileChange} />
                <span className="cr-file-placeholder">{fileName || "Upload client photo"}</span>
                <span className="cr-upload-icon">
                  <img src={UploadIcon} alt="upload" />
                </span>
              </div>
            </div>
          </div>

          <div className="cr-row-bottom">
            <div className="cr-field cr-field-full">
              <label className="cr-label" htmlFor="reviewText">
                Review
              </label>
              <textarea
                id="reviewText"
                className="cr-textarea"
                placeholder="Write a review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                name="reviewText"
                rows={4}
              />
            </div>
          </div>

          <div className="cr-hr" />
          <div className="cr-actions">
            <PostButton type="submit">Post</PostButton>
          </div>
        </form>

        {/* Reviews list */}
        <div className="cr-list-box">
          <div className="cr-list-header">
            <div className="cr-list-title">All Client Reviews</div>

            {/* Updated metadata rendering with separate range + muted text */}
            <div className="cr-list-meta">
              <span className="cr-range">{start} - {end}</span>
              <span className="cr-muted"> of {total}</span>
            </div>
          </div>

          <div className="cr-table-head">
            <div>Name <img src={sort} alt="sort" className="cr-sort-icon" /></div>
            <div>Role <img src={sort} alt="sort" className="cr-sort-icon" /></div>
            <div>Review <img src={sort} alt="sort" className="cr-sort-icon" /></div>
            <div style={{ textAlign: "right", paddingRight: "20px" }}>Action</div>
          </div>

          <div className="cr-table">
            {currentSlice.length === 0 ? (
              <div className="cr-empty">No client reviews yet.</div>
            ) : (
              currentSlice.map((r) => (
                <div className="cr-table-row" key={r.id}>
                  <div className="cr-cell-name">
                    <div className="cr-name-role">
                      <Avatar name={r.name} fileUrl={r.fileUrl} />
                      <div>
                        <div className="cr-name">{r.name}</div>
                      </div>
                    </div>
                  </div>

                  <div className="cr-cell-role">
                    <div className="cr-role-strong">{r.role || "-"}</div>
                  </div>

                  <div className="cr-cell-review">
                    <div className="cr-review-text">{r.review}</div>
                  </div>

                  <div className="cr-cell-action">
                    <div className="cr-actions-cell">
                      <button className="cr-action-btn" title="Edit" onClick={() => handleEdit(r.id)}>
                        <img src={editIconSrc} alt="edit" />
                      </button>
                      <button className="cr-action-btn" title="Delete" onClick={() => handleDelete(r.id)}>
                        <img src={deleteIconSrc} alt="delete" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Separate pagination box */}
        <PaginationBar
          currentPage={currentPage}
          total={total}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          leftIcon={leftArrow}
          rightIcon={rightArrow}
          resetPageOnRowsChange={true}
        />
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="cr-modal-overlay" onClick={closeModal}>
          <div className="cr-modal-content" onClick={(e) => e.stopPropagation()}>
            <form className="cr-modal-form" onSubmit={handleUpdateSubmit}>
              <div className="cr-modal-row">
                <label className="cr-modal-label" htmlFor="editClientName">
                  Name
                </label>
                <input
                  id="editClientName"
                  className="cr-modal-input"
                  placeholder="Add client name"
                  value={editClientName}
                  onChange={(e) => setEditClientName(e.target.value)}
                  type="text"
                  autoComplete="off"
                />
              </div>

              <div className="cr-modal-row">
                <label className="cr-modal-label" htmlFor="editClientRole">
                  Role
                </label>
                <input
                  id="editClientRole"
                  className="cr-modal-input"
                  placeholder="Add client role"
                  value={editClientRole}
                  onChange={(e) => setEditClientRole(e.target.value)}
                  type="text"
                />
              </div>

              <div className="cr-modal-row">
                <label className="cr-modal-label" htmlFor="editClientPhoto">
                  Client Photo
                </label>
                <div
                  className="cr-file-wrap"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      editFileInputRef.current && editFileInputRef.current.click();
                    }
                  }}
                >
                  <input ref={editFileInputRef} id="editClientPhoto" type="file" accept="image/*" onChange={handleEditFileChange} />
                  <span className="cr-file-placeholder">{editFileName || "Upload client photo"}</span>
                  <span className="cr-upload-icon">
                    <img src={UploadIcon} alt="upload" />
                  </span>
                </div>
              </div>

              <div className="cr-modal-row">
                <label className="cr-modal-label" htmlFor="editReviewText">
                  Review
                </label>
                <textarea
                  id="editReviewText"
                  className="cr-modal-textarea"
                  placeholder="Write a review"
                  value={editReviewText}
                  onChange={(e) => setEditReviewText(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="cr-modal-actions">
                <UpdateButton type="submit">Update</UpdateButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientReview;
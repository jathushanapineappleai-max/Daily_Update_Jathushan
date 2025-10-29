// client_review.js
import React, { useState, useRef, useEffect } from "react";
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
import Popup from "../../../components/admin_panel/popups/success"; // Assuming this path for the success popup
import DeleteConfirmPopup from "../../../components/admin_panel/popups/delete_confirm";
import DeletePopup from "../../../components/admin_panel/popups/delete";

const ClientReview = ({ externalOnSubmit }) => {
  const [clientName, setClientName] = useState("");
  const [clientRole, setClientRole] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileObj, setFileObj] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Errors for add form
  const [errors, setErrors] = useState({
    clientName: null,
    clientRole: null,
    reviewText: null,
    clientPhoto: null,
  });

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editClientName, setEditClientName] = useState("");
  const [editClientRole, setEditClientRole] = useState("");
  const [editReviewText, setEditReviewText] = useState("");
  const [editFileName, setEditFileName] = useState("");
  const [editFileObj, setEditFileObj] = useState(null);

  // Errors for edit modal
  const [editErrors, setEditErrors] = useState({
    clientName: null,
    clientRole: null,
    reviewText: null,
    clientPhoto: null,
  });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Popup state
  const [visible, setVisible] = useState(false);

  // Delete popup state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Delete success popup state
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  // Popup auto-hide effect
  useEffect(() => {
    if (!visible) return undefined;
    const t = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(t);
  }, [visible]);

  // Delete success auto-hide effect
  useEffect(() => {
    if (!showDeleteSuccess) return undefined;
    const t = setTimeout(() => setShowDeleteSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [showDeleteSuccess]);

  // Validation functions
  const validateName = (name) => {
    const s = (name || "").trim();
    if (!s) return "Name is required";
    if (/\d/.test(s)) return "Name cannot contain numbers";
    if (!/^[\p{L}\p{M}\s'.\-]+$/u.test(s)) return "Name contains invalid characters";
    return null;
  };

  const validateRole = (role) => {
    const s = (role || "").trim();
    if (!s) return "Role is required";
    if (s.length < 2) return "Role must be at least 2 characters";
    if (s.length > 120) return "Role is too long";
    if (!/^[\p{L}\p{M}\s'.\-\d]+$/u.test(s)) return "Role contains invalid characters";
    return null;
  };

  const validateReview = (text) => {
    const s = (text || "").trim();
    if (!s) return "Review is required";
    if (s.length > 2000) return "Review is too long";
    return null;
  };

  const validatePhotoSync = ({ file = null, previewUrl = null, required = true, maxSizeBytes = 5 * 1024 * 1024 }) => {
    if (!file && !previewUrl) {
      return required ? "Client photo is required" : null;
    }
    if (file) {
      if (!file.type || !file.type.startsWith("image/")) return "File must be an image (PNG/JPG/etc.)";
      if (file.size > maxSizeBytes) return `File too large (max ${(maxSizeBytes / (1024 * 1024)).toFixed(1)} MB)`;
    }
    return null;
  };

  // Handle file selection for add form
  const handleFileChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    setFileName(f ? f.name : "");
    setFileObj(f);
    const err = validatePhotoSync({ file: f, previewUrl: fileName, required: true });
    setErrors((prev) => ({ ...prev, clientPhoto: err }));
  };

  // Handle file selection for edit modal
  const handleEditFileChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    setEditFileName(f ? f.name : editFileName);
    setEditFileObj(f);
    const err = validatePhotoSync({ file: f, previewUrl: editFileName, required: true });
    setEditErrors((prev) => ({ ...prev, clientPhoto: err }));
  };

  // Blur handlers for add form
  const handleNameBlur = () => {
    const err = validateName(clientName);
    setErrors((prev) => ({ ...prev, clientName: err }));
  };

  const handleRoleBlur = () => {
    const err = validateRole(clientRole);
    setErrors((prev) => ({ ...prev, clientRole: err }));
  };

  const handleReviewBlur = () => {
    const err = validateReview(reviewText);
    setErrors((prev) => ({ ...prev, reviewText: err }));
  };

  // Blur handlers for edit modal
  const handleEditNameBlur = () => {
    const err = validateName(editClientName);
    setEditErrors((prev) => ({ ...prev, clientName: err }));
  };

  const handleEditRoleBlur = () => {
    const err = validateRole(editClientRole);
    setEditErrors((prev) => ({ ...prev, clientRole: err }));
  };

  const handleEditReviewBlur = () => {
    const err = validateReview(editReviewText);
    setEditErrors((prev) => ({ ...prev, reviewText: err }));
  };

  // reset add form
  const resetForm = () => {
    setClientName("");
    setClientRole("");
    setReviewText("");
    setFileName("");
    setFileObj(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setErrors({
      clientName: null,
      clientRole: null,
      reviewText: null,
      clientPhoto: null,
    });
  };

  // submit for add (top form)
  const handleAddSubmit = (e) => {
    e.preventDefault();

    const nameError = validateName(clientName);
    const roleError = validateRole(clientRole);
    const reviewError = validateReview(reviewText);
    const photoError = validatePhotoSync({ file: fileObj, previewUrl: fileName, required: true });

    setErrors({
      clientName: nameError,
      clientRole: roleError,
      reviewText: reviewError,
      clientPhoto: photoError,
    });

    if (nameError || roleError || reviewError || photoError) {
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
    setVisible(true); // Show success popup
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
    // Reset edit errors
    setEditErrors({
      clientName: null,
      clientRole: null,
      reviewText: null,
      clientPhoto: null,
    });
  };

  // Submit for edit (modal)
  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    const nameError = validateName(editClientName);
    const roleError = validateRole(editClientRole);
    const reviewError = validateReview(editReviewText);
    const photoError = validatePhotoSync({
      file: editFileObj,
      previewUrl: editFileObj ? null : editFileName,
      required: true,
    });

    setEditErrors({
      clientName: nameError,
      clientRole: roleError,
      reviewText: reviewError,
      clientPhoto: photoError,
    });

    if (nameError || roleError || reviewError || photoError) {
      return;
    }

    const oldReview = reviews.find((x) => x.id === editingId);
    let fileUrl = oldReview?.fileUrl || null;
    if (editFileObj) {
      if (oldReview?.fileUrl) {
        URL.revokeObjectURL(oldReview.fileUrl);
      }
      fileUrl = URL.createObjectURL(editFileObj);
    }

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
    setDeleteId(id);
    setShowDeletePopup(true);
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
      <div className={`cr-main-content ${showModal || showDeletePopup ? 'blurred' : ''}`}>
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
                className={`cr-input ${errors.clientName ? 'error' : ''}`}
                placeholder="Add client name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                onBlur={handleNameBlur}
                name="clientName"
                type="text"
                autoComplete="off"
              />
              {errors.clientName && <span className="field-error">{errors.clientName}</span>}
            </div>

            <div className="cr-field">
              <label className="cr-label" htmlFor="clientRole">
                Role
              </label>
              <input
                id="clientRole"
                className={`cr-input ${errors.clientRole ? 'error' : ''}`}
                placeholder="Add client role"
                value={clientRole}
                onChange={(e) => setClientRole(e.target.value)}
                onBlur={handleRoleBlur}
                name="clientRole"
                type="text"
              />
              {errors.clientRole && <span className="field-error">{errors.clientRole}</span>}
            </div>

            <div className="cr-field">
              <label className="cr-label" htmlFor="clientPhoto">
                Client Photo
              </label>

              <div
                className={`cr-file-wrap ${errors.clientPhoto ? 'error' : ''}`}
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
              {errors.clientPhoto && <span className="field-error">{errors.clientPhoto}</span>}
            </div>
          </div>

          <div className="cr-row-bottom">
            <div className="cr-field cr-field-full">
              <label className="cr-label" htmlFor="reviewText">
                Review
              </label>
              <textarea
                id="reviewText"
                className={`cr-textarea ${errors.reviewText ? 'error' : ''}`}
                placeholder="Write a review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                onBlur={handleReviewBlur}
                name="reviewText"
                rows={4}
              />
              {errors.reviewText && <span className="field-error">{errors.reviewText}</span>}
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
        <div className="cr-pagination-wrapper">
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
                <div style={{ flex: 1 }}>
                  <input
                    id="editClientName"
                    className={`cr-modal-input ${editErrors.clientName ? 'error' : ''}`}
                    placeholder="Add client name"
                    value={editClientName}
                    onChange={(e) => setEditClientName(e.target.value)}
                    onBlur={handleEditNameBlur}
                    type="text"
                    autoComplete="off"
                  />
                  {editErrors.clientName && <span className="field-error">{editErrors.clientName}</span>}
                </div>
              </div>

              <div className="cr-modal-row">
                <label className="cr-modal-label" htmlFor="editClientRole">
                  Role
                </label>
                <div style={{ flex: 1 }}>
                  <input
                    id="editClientRole"
                    className={`cr-modal-input ${editErrors.clientRole ? 'error' : ''}`}
                    placeholder="Add client role"
                    value={editClientRole}
                    onChange={(e) => setEditClientRole(e.target.value)}
                    onBlur={handleEditRoleBlur}
                    type="text"
                  />
                  {editErrors.clientRole && <span className="field-error">{editErrors.clientRole}</span>}
                </div>
              </div>

              <div className="cr-modal-row">
                <label className="cr-modal-label" htmlFor="editClientPhoto">
                  Client Photo
                </label>
                <div style={{ flex: 1 }}>
                  <div
                    className={`cr-file-wrap ${editErrors.clientPhoto ? 'error' : ''}`}
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
                    <span className="cr-file-placeholder">{editFileObj ? editFileObj.name : editFileName || "Upload client photo"}</span>
                    <span className="cr-upload-icon">
                      <img src={UploadIcon} alt="upload" />
                    </span>
                  </div>
                  {editErrors.clientPhoto && <span className="field-error">{editErrors.clientPhoto}</span>}
                </div>
              </div>

              <div className="cr-modal-row">
                <label className="cr-modal-label" htmlFor="editReviewText">
                  Review
                </label>
                <div style={{ flex: 1 }}>
                  <textarea
                    id="editReviewText"
                    className={`cr-modal-textarea ${editErrors.reviewText ? 'error' : ''}`}
                    placeholder="Write a review"
                    value={editReviewText}
                    onChange={(e) => setEditReviewText(e.target.value)}
                    onBlur={handleEditReviewBlur}
                    rows={4}
                  />
                  {editErrors.reviewText && <span className="field-error">{editErrors.reviewText}</span>}
                </div>
              </div>

              <div className="cr-modal-actions">
                <UpdateButton type="submit">Update</UpdateButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Popup */}
      {showDeletePopup && (
        <DeleteConfirmPopup
          onClose={() => setShowDeletePopup(false)}
          onConfirm={() => {
            setReviews((prev) => {
              const toDelete = prev.find((x) => x.id === deleteId);
              if (toDelete?.fileUrl) {
                URL.revokeObjectURL(toDelete.fileUrl);
              }
              const newReviews = prev.filter((r) => r.id !== deleteId);
              const newTotalPages = Math.max(1, Math.ceil(newReviews.length / rowsPerPage));
              if (currentPage > newTotalPages) {
                setCurrentPage(newTotalPages);
              }
              return newReviews;
            });
            setShowDeletePopup(false);
            setDeleteId(null);
            setShowDeleteSuccess(true);
          }}
        />
      )}

      {/* Success Popup */}
      {visible && (
        <div
          className="cr-popup-container"
          role="dialog"
          aria-live="polite"
          aria-modal="false"
        >
          <Popup title="Success" message="Review posted successfully." />
        </div>
      )}

      {/* Delete Success Popup */}
      {showDeleteSuccess && (
        <div className="delete-popup-container">
          <DeletePopup message="Review deleted successfully." />
        </div>
      )}
    </div>
  );
};

export default ClientReview;
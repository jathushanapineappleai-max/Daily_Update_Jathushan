import React, { useState, useEffect } from 'react';
import '../../../styles/admin_panel/product_selection.css';
import UploadIcon from "../../../assets/icons/uploadIcon.png";
import EditIcon from "../../../assets/icons/Frame.png";
import DeleteIcon from "../../../assets/icons/Vector.png";
import UpdateButton from "./../../../components/admin_panel/buttons/update_button";
import Pagination from "../../../components/admin_panel/pagination";
/*import leftImg from "../../../assets/icons/leftArrow.png";
import rightImg from "../../../assets/icons/rightArrow.png";*/
import sort from "../../../assets/icons/sort_arrows.png";
import Popup from "../../../components/admin_panel/popups/success";

// --------- Name validation (sync) ---------
// Returns null when valid, otherwise returns an error message string.
function validateName(name) {
  const s = (name || "").trim();
  if (!s) return "Name is required";
  if (s.length < 2) return "Name must be at least 2 characters";
  if (s.length > 120) return "Name is too long";
  // Reject digits as a simple rule; adjust if you need numbers allowed.
  if (/\d/.test(s)) return "Name cannot contain numbers";
  // Allow most punctuation used in names (.,-', spaces). Keep this conservative.
  // If you need full Unicode support, relax or remove this regex check.
  if (!/^[\p{L}\p{M}\s'.\-]+$/u.test(s)) return "Name contains invalid characters";
  return null;
}

// --------- Website validation (sync) ---------
function validateWebsite(website) {
  const s = (website || "").trim();
  if (!s) return "Website is required";
  let u = s;
  if (!u.startsWith('http://') && !u.startsWith('https://')) {
    u = 'https://' + u;
  }
  try {
    new URL(u);
    return null;
  } catch {
    return "Invalid website URL";
  }
}

// --------- Photo validation (sync) ---------
// Quick checks: presence, file type and size.
// Accepts either a File object or a previewUrl (string) when a previously uploaded image exists.
// Returns null when valid, otherwise returns error string.
function validatePhotoSync({ file = null, previewUrl = null, required = true, maxSizeBytes = 5 * 1024 * 1024 }) {
  if (!file && !previewUrl) {
    return required ? "Product photo is required" : null;
  }
  if (file) {
    if (!file.type || !file.type.startsWith("image/")) return "File must be an image (PNG/JPG/etc.)";
    if (file.size > maxSizeBytes) return `File too large (max ${(maxSizeBytes / (1024 * 1024)).toFixed(1)} MB)`;
  }
  return null;
}

// --------- Small helpers to wire file input / drag-drop into a form (React-friendly) ---------
// Usage: pass setFile, setPreviewUrl, setErrors from your component state.
function handleFileSelect(e, { setFile, setFileName, setErrors, maxSizeBytes }) {
  const f = e.target.files?.[0] ?? null;
  if (!f) return;
  const err = validatePhotoSync({ file: f, required: true, maxSizeBytes });
  if (err) {
    setErrors(prev => ({ ...prev, photo: err }));
    return;
  }
  setErrors(prev => ({ ...prev, photo: null }));
  setFile(f);
  setFileName(f.name);
}

// Call this when you remove a preview to avoid memory leaks
function revokePreview(previewUrl) {
  try { if (previewUrl) URL.revokeObjectURL(previewUrl); } catch(_) {}
}

export default function ProductSelection({ onSubmit: externalOnSubmit }) {
  const [productName, setProductName] = useState('');
  const [productWebsite, setProductWebsite] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileObj, setFileObj] = useState(null);

  // product list stored locally in component state
  const [products, setProducts] = useState([]);

  // pagination states
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalName, setModalName] = useState('');
  const [modalWebsite, setModalWebsite] = useState('');
  const [modalFileName, setModalFileName] = useState('');
  const [modalFileObj, setModalFileObj] = useState(null);

  // errors for main form and modal
  const [errors, setErrors] = useState({ name: null, website: null, photo: null });
  const [modalErrors, setModalErrors] = useState({ name: null, website: null, photo: null });

  // success popup state
  const [successVisible, setSuccessVisible] = useState(false);

  const totalProducts = products.length;

  // paginated products for display
  const paginatedProducts = products.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // For cleaning up object URLs
  useEffect(() => {
    return () => {
      products.forEach(p => {
        if (p.fileUrl) URL.revokeObjectURL(p.fileUrl);
      });
    };
  }, [products]);

  // Set modal values when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      setModalName(editingProduct.name);
      setModalWebsite(editingProduct.website);
      setModalFileName(editingProduct.fileName || '');
      setModalFileObj(null);
      setModalErrors({ name: null, website: null, photo: null });
    }
  }, [editingProduct]);

  // Auto-hide success popup after 3000ms
  useEffect(() => {
    if (!successVisible) return undefined;
    const t = setTimeout(() => setSuccessVisible(false), 3000);
    return () => clearTimeout(t);
  }, [successVisible]);

  const handleFileChange = (e) => {
    handleFileSelect(e, { setFile: setFileObj, setFileName, setErrors, maxSizeBytes: 5 * 1024 * 1024 });
  };

  const handleModalFileChange = (e) => {
    handleFileSelect(e, { setFile: setModalFileObj, setFileName: setModalFileName, setErrors: setModalErrors, maxSizeBytes: 5 * 1024 * 1024 });
  };

  const handleNameBlur = () => {
    const err = validateName(productName);
    setErrors(prev => ({ ...prev, name: err }));
  };

  const handleWebsiteBlur = () => {
    const err = validateWebsite(productWebsite);
    setErrors(prev => ({ ...prev, website: err }));
  };

  const handleModalNameBlur = () => {
    const err = validateName(modalName);
    setModalErrors(prev => ({ ...prev, name: err }));
  };

  const handleModalWebsiteBlur = () => {
    const err = validateWebsite(modalWebsite);
    setModalErrors(prev => ({ ...prev, website: err }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameError = validateName(productName);
    const websiteError = validateWebsite(productWebsite);
    const photoError = validatePhotoSync({ file: fileObj, required: true });

    if (nameError || websiteError || photoError) {
      setErrors({ name: nameError, website: websiteError, photo: photoError });
      return;
    }

    // build product object
    const id = Date.now().toString();
    const fileUrl = fileObj ? URL.createObjectURL(fileObj) : null;

    const newProduct = {
      id,
      name: productName.trim(),
      website: productWebsite.trim(),
      fileName: fileObj ? fileObj.name : null,
      fileObj: fileObj || null,
      fileUrl,
      createdAt: new Date().toISOString()
    };

    // update local list (prepend - keep existing behavior)
    const newProducts = [newProduct, ...products];
    setProducts(newProducts);

    // reset to page 1 to show new product
    setPage(1);

    // call external onSubmit if provided (FormData)
    if (typeof externalOnSubmit === 'function') {
      const fd = new FormData();
      fd.append('productName', newProduct.name);
      fd.append('productWebsite', newProduct.website);
      if (fileObj) fd.append('productPhoto', fileObj);
      externalOnSubmit(fd);
    } else {
      // default debug logging
      console.log('New product added', newProduct);
    }

    // reset form fields
    setProductName('');
    setProductWebsite('');
    setFileName('');
    setFileObj(null);
    setErrors({ name: null, website: null, photo: null });

    // show success popup
    setSuccessVisible(true);
  };

  // delete product
  const handleDelete = (id) => {
    const p = products.find(x => x.id === id);
    if (p && p.fileUrl) URL.revokeObjectURL(p.fileUrl);

    const newList = products.filter(x => x.id !== id);
    setProducts(newList);

    // adjust page if necessary (e.g., if current page is now empty)
    const maxPage = Math.ceil(newList.length / rowsPerPage);
    if (page > maxPage) {
      setPage(maxPage || 1);
    }
  };

  // open modal for edit
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  // handle update in modal
  const handleUpdate = (e) => {
    e.preventDefault();

    const nameError = validateName(modalName);
    const websiteError = validateWebsite(modalWebsite);
    const photoError = validatePhotoSync({
      file: modalFileObj,
      previewUrl: modalFileObj ? null : editingProduct?.fileUrl,
      required: true // Require photo in edit as well; if no previous, must upload
    });

    if (nameError || websiteError || photoError) {
      setModalErrors({ name: nameError, website: websiteError, photo: photoError });
      return;
    }

    const updatedProduct = {
      ...editingProduct,
      name: modalName.trim(),
      website: modalWebsite.trim(),
    };

    if (modalFileObj) {
      if (editingProduct.fileUrl) URL.revokeObjectURL(editingProduct.fileUrl);
      updatedProduct.fileName = modalFileObj.name;
      updatedProduct.fileObj = modalFileObj;
      updatedProduct.fileUrl = URL.createObjectURL(modalFileObj);
    }

    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setShowModal(false);
    setEditingProduct(null);
    setModalErrors({ name: null, website: null, photo: null });
  };

  // Calculate the display range
  const start = totalProducts > 0 ? (page - 1) * rowsPerPage + 1 : 0;
  const end = Math.min(page * rowsPerPage, totalProducts);

  return (
    <div className="product-section">
      <div className={`content-wrapper ${showModal ? 'blurred' : ''}`}>
        {/* Section Title moved inside content-wrapper so it blurs with content */}
        <h1 className="ps-section-title">Product Section</h1>

        {/* Product Form */}
        <form className="ps-form" onSubmit={handleSubmit}>
          <div className="ps-row">
            <div className="ps-field">
              <label className="ps-label" htmlFor="productName">Product Name</label>
              <input
                id="productName"
                className={`ps-input ${errors.name ? 'error' : ''}`}
                placeholder="Add product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                onBlur={handleNameBlur}
                name="productName"
                type="text"
                autoComplete="off"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="ps-field">
              <label className="ps-label" htmlFor="productWebsite">Product Website</label>
              <input
                id="productWebsite"
                className={`ps-input ${errors.website ? 'error' : ''}`}
                placeholder="Add product website URL"
                value={productWebsite}
                onChange={(e) => setProductWebsite(e.target.value)}
                onBlur={handleWebsiteBlur}
                name="productWebsite"
                type="url"
              />
              {errors.website && <span className="field-error">{errors.website}</span>}
            </div>

            <div className="ps-field">
              <label className="ps-label" htmlFor="productPhoto">Product Photo</label>

              <div
                className={`file-wrap ${errors.photo ? 'error' : ''}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    document.getElementById('productPhoto').click();
                  }
                }}
              >
                <input
                  id="productPhoto"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  aria-label="Upload product photo"
                />
                <span className="file-placeholder">{fileName || 'Upload product photo'}</span>
                <span className="upload-icon">
                  <img src={UploadIcon} alt="upload" style={{ width: 20, height: 20, display: 'block' }} />
                </span>
              </div>
              {errors.photo && <span className="field-error">{errors.photo}</span>}

            </div>
          </div>

          <div className="ps-hr" />

          <div className="ps-actions">
            <button type="submit" className="ps-post">Post</button>
          </div>
        </form>

        {/* Product List */}
        <div className="product-list">
          <div className="pl-card">
            {/* Card header: All Products + meta */}
            <div className="pl-card-header">
              <h3 className="pl-card-title">All Products</h3>
              <span className="pl-meta">
                <span className="pl-range">{start} - {end}</span> of {totalProducts}
              </span>
            </div>

            <div className="pl-table">
              <div className="pl-row pl-head">
                <div className="pl-col pl-col-name">Product Name <img src={sort} alt="sort" style={{ width: '32px', height: '32px', opacity: 0.6 }} /></div>
                <div className="pl-col pl-col-website">Product Website <img src={sort} alt="sort" style={{ width: '32px', height: '32px', opacity: 0.6 }} /></div>
                <div className="pl-col pl-col-action">Action</div>
              </div>

              {paginatedProducts.length === 0 && (
                <div className="pl-row pl-empty">
                  <div className="pl-empty-text">No products added. Use the form above and click Post.</div>
                </div>
              )}

              {paginatedProducts.map(product => (
                <div className="pl-row" key={product.id}>
                  <div className="pl-col pl-col-name">
                    <div className="pl-item">
                      <div className="pl-avatar">
                        {product.fileUrl ? (
                          <img src={product.fileUrl} alt={product.name} />
                        ) : (
                          <div className="pl-initials">{(product.name || 'P').slice(0, 2).toUpperCase()}</div>
                        )}
                      </div>
                      <div className="pl-item-text">
                        <div className="pl-name">{product.name}</div>
                        <div className="pl-filename">{product.fileName || ''}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pl-col pl-col-website">
                    {product.website ? (
                      <a href={product.website.startsWith('http') ? product.website : `https://${product.website}`} target="_blank" rel="noreferrer" className="pl-website">
                        {product.website}
                      </a>
                    ) : <span className="pl-no-website">—</span>}
                  </div>

                  <div className="pl-col pl-col-action">
                    <div className="pl-actions">
                      <button
                        title="Edit"
                        className="pl-btn pl-edit"
                        onClick={() => handleEdit(product)}
                        aria-label={`Edit ${product.name}`}
                      >
                        <img src={EditIcon} alt="Edit" />
                      </button>

                      <button
                        title="Delete"
                        className="pl-btn pl-delete"
                        onClick={() => handleDelete(product.id)}
                        aria-label={`Delete ${product.name}`}
                      >
                        <img src={DeleteIcon} alt="Delete" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Separate Pagination Box */}
          <div className="pl-pagination-wrapper">
            <Pagination
              currentPage={page}
              total={products.length}
              rowsPerPage={rowsPerPage}
              onPageChange={(p) => setPage(p)}
              onRowsPerPageChange={(size) => setRowsPerPage(size)}
              /*leftIcon={leftImg}
              rightIcon={rightImg}*/
              resetPageOnRowsChange={true}
            />
          </div>
        </div>

      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleUpdate}>
              <div className="ps-row">
                <div className="ps-field">
                  <label className="ps-label" htmlFor="modalProductName">Product Name</label>
                  <input
                    id="modalProductName"
                    className={`ps-input ${modalErrors.name ? 'error' : ''}`}
                    placeholder="Add product name"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    onBlur={handleModalNameBlur}
                    type="text"
                  />
                  {modalErrors.name && <span className="field-error">{modalErrors.name}</span>}
                </div>

                <div className="ps-field">
                  <label className="ps-label" htmlFor="modalProductWebsite">Product Website</label>
                  <input
                    id="modalProductWebsite"
                    className={`ps-input ${modalErrors.website ? 'error' : ''}`}
                    placeholder="Add product website URL"
                    value={modalWebsite}
                    onChange={(e) => setModalWebsite(e.target.value)}
                    onBlur={handleModalWebsiteBlur}
                    type="url"
                  />
                  {modalErrors.website && <span className="field-error">{modalErrors.website}</span>}
                </div>

                <div className="ps-field">
                  <label className="ps-label" htmlFor="modalProductPhoto">Product Photo</label>
                  <div
                    className={`file-wrap ${modalErrors.photo ? 'error' : ''}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        document.getElementById('modalProductPhoto').click();
                      }
                    }}
                  >
                    <input
                      id="modalProductPhoto"
                      type="file"
                      accept="image/*"
                      onChange={handleModalFileChange}
                      aria-label="Upload product photo"
                    />
                    <span className="file-placeholder">{modalFileName || 'Upload product photo'}</span>
                    <span className="upload-icon">
                      <img src={UploadIcon} alt="upload" style={{ width: 20, height: 20, display: 'block' }} />
                    </span>
                  </div>
                  {modalErrors.photo && <span className="field-error">{modalErrors.photo}</span>}
                </div>
              </div>

              <div className="ps-hr" />

              <div className="ps-actions">
                <UpdateButton type="submit" />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {successVisible && (
        <div
          className="ps-popup-container"
          role="dialog"
          aria-live="polite"
          aria-modal="false"
        >
          <Popup title="Success" message="Product added successfully." />
        </div>
      )}
    </div>
  );
}
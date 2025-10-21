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
    }
  }, [editingProduct]);

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setFileName(f.name);
      setFileObj(f);
    } else {
      setFileName('');
      setFileObj(null);
    }
  };

  const handleModalFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setModalFileName(f.name);
      setModalFileObj(f);
    } else {
      setModalFileName(editingProduct?.fileName || '');
      setModalFileObj(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productName.trim()) {
      alert('Please enter a product name.');
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
    if (!modalName.trim()) {
      alert('Please enter a product name.');
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
                className="ps-input"
                placeholder="Add product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                name="productName"
                type="text"
                autoComplete="off"
              />
            </div>

            <div className="ps-field">
              <label className="ps-label" htmlFor="productWebsite">Product Website</label>
              <input
                id="productWebsite"
                className="ps-input"
                placeholder="Add product website URL"
                value={productWebsite}
                onChange={(e) => setProductWebsite(e.target.value)}
                name="productWebsite"
                type="url"
              />
            </div>

            <div className="ps-field">
              <label className="ps-label" htmlFor="productPhoto">Product Photo</label>

              <div
                className="file-wrap"
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
                    className="ps-input"
                    placeholder="Add product name"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    type="text"
                  />
                </div>

                <div className="ps-field">
                  <label className="ps-label" htmlFor="modalProductWebsite">Product Website</label>
                  <input
                    id="modalProductWebsite"
                    className="ps-input"
                    placeholder="Add product website URL"
                    value={modalWebsite}
                    onChange={(e) => setModalWebsite(e.target.value)}
                    type="url"
                  />
                </div>

                <div className="ps-field">
                  <label className="ps-label" htmlFor="modalProductPhoto">Product Photo</label>
                  <div
                    className="file-wrap"
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
    </div>
  );
}
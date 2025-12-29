import React, { useState, useRef, useEffect } from 'react';
import '../../../../styles/Fulldaypopup.css';
import closeicon from '../../../../assets/icons/closeicon.png';
import selecticon from '../../../../assets/icons/drop.png';
import calendericon from '../../../../assets/icons/calender.png';
import inicon from '../../../../assets/icons/inicon.png';
import uploadicon from '../../../../assets/icons/upload.png';
import Submitbtn from '../../../../components/Buttons/Submit_button';
export default function LeavePopup({ onClose = () => {}, onSubmit = () => {} }) {
  const [category, setCategory] = useState('Full Day');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [dateISO, setDateISO] = useState('');
  const [displayDate, setDisplayDate] = useState('');
  const [reason, setReason] = useState('');
  const [fileName, setFileName] = useState(null);
  const [file, setFile] = useState(null);
  const [dateError, setDateError] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const selectRef = useRef(null);
  const hiddenDateRef = useRef(null);
  const visibleDateRef = useRef(null);
  const CATEGORY_OPTIONS = ['Full Day'];
  useEffect(() => {
    function handleClickOutside(e) {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    // update human display when dateISO changes (e.g., from native picker)
    if (dateISO) {
      setDisplayDate(formatIsoToDisplay(dateISO));
      setDateError(''); // if we got an ISO, clear "required" error
    }
  }, [dateISO]);
  useEffect(() => {
    // form is valid only when we have a parsed ISO date and reason valid
    const reasonOk = validateReasonSilently(reason);
    setIsFormValid(Boolean(dateISO) && reasonOk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateISO, reason]);
  function toggleCategoryDropdown() {
    setIsCategoryOpen((s) => !s);
  }
  function handleSelectOption(option) {
    setCategory(option);
    setIsCategoryOpen(false);
  }
  function handleKeyDownOnSelect(e) {
    const currentIndex = CATEGORY_OPTIONS.indexOf(category);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (currentIndex + 1) % CATEGORY_OPTIONS.length;
      setCategory(CATEGORY_OPTIONS[next]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (currentIndex - 1 + CATEGORY_OPTIONS.length) % CATEGORY_OPTIONS.length;
      setCategory(CATEGORY_OPTIONS[prev]);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsCategoryOpen((s) => !s);
    } else if (e.key === 'Escape') {
      setIsCategoryOpen(false);
    }
  }
  function handleFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setFileName(f.name);
    setFile(f);
  }
  function openDatePicker() {
    if (hiddenDateRef.current) {
      if (typeof hiddenDateRef.current.showPicker === 'function') {
        hiddenDateRef.current.showPicker();
      } else {
        hiddenDateRef.current.focus();
      }
    }
  }
  function onHiddenDateChange(e) {
    const val = e.target.value; // ISO YYYY-MM-DD or ''
    setDateISO(val);
    if (val) {
      setDisplayDate(formatIsoToDisplay(val));
      setDateError('');
    }
  }
  function onVisibleDateBlur() {
    const text = displayDate.trim();
    // if empty -> show required message
    if (!text) {
      setDateISO('');
      setDateError('Date is required.');
      return;
    }
    // try to parse; if parse success -> set dateISO; if not, do nothing visible
    const parsedISO = parseDisplayToIso(text);
    if (parsedISO) {
      setDateISO(parsedISO);
      if (hiddenDateRef.current) hiddenDateRef.current.value = parsedISO;
      setDisplayDate(formatIsoToDisplay(parsedISO));
      setDateError('');
    } else {
      // invalid format: do not show "Date is required." — keep silent per request
      setDateISO('');
      // no dateError set
    }
  }
  function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    // Ensure dateISO exists; if not, attempt to parse; only show "Date is required." if user left blank
    if (!dateISO) {
      const trimmed = displayDate.trim();
      if (!trimmed) {
        setDateError('Date is required.');
        return;
      }
      const parsed = parseDisplayToIso(trimmed);
      if (parsed) {
        setDateISO(parsed);
      } else {
        // can't parse; silently block submission (no visible error per your instruction)
        return;
      }
    }
    const rOk = validateReason(reason);
    if (!rOk) return;
    const formData = {
      category,
      date: dateISO,
      reason,
      file,
    };
    onSubmit(formData);
  }
  /*******************
   * Date helper utils
   *******************/
  function sanitizeDateInput(input) {
    return (input || '').replace(/[^0-9/]/g, '');
  }
  function handleVisibleDateChange(e) {
    const raw = e.target.value;
    const sanitized = sanitizeDateInput(raw);
    const limited = sanitized.slice(0, 10);
    setDisplayDate(limited);
    // clear required error while typing
    if (limited) setDateError('');
  }
  function handleDateKeyDown(e) {
    const ALLOWED_CONTROL_KEYS = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
      'Tab',
    ];
    if (ALLOWED_CONTROL_KEYS.includes(e.key)) return;
    if (e.key.length === 1 && !/[0-9/]/.test(e.key)) {
      e.preventDefault();
    }
  }
  function handleDatePaste(e) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text') || '';
    const sanitized = sanitizeDateInput(text);
    const limited = sanitized.slice(0, 10);
    setDisplayDate(limited);
    if (limited) setDateError('');
  }
  function formatIsoToDisplay(iso) {
    if (!iso) return '';
    const parts = iso.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      return `${m}/${d}/${y}`;
    }
    const dt = new Date(iso);
    if (!isNaN(dt)) {
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const dd = String(dt.getDate()).padStart(2, '0');
      const yyyy = dt.getFullYear();
      return `${mm}/${dd}/${yyyy}`;
    }
    return '';
  }
  function parseDisplayToIso(text) {
    if (!text) return '';
    const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
      const y = isoMatch[1], m = isoMatch[2], d = isoMatch[3];
      if (isValidDateParts(y, m, d)) return `${y}-${m}-${d}`;
      return null;
    }
    const mmddMatch = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (mmddMatch) {
      let mm = mmddMatch[1].padStart(2, '0');
      let dd = mmddMatch[2].padStart(2, '0');
      const yyyy = mmddMatch[3];
      if (isValidDateParts(yyyy, mm, dd)) {
        return `${yyyy}-${mm}-${dd}`;
      }
      return null;
    }
    const dt = new Date(text);
    if (!isNaN(dt)) {
      const yyyy = String(dt.getFullYear());
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const dd = String(dt.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
    return null;
  }
  function isValidDateParts(y, m, d) {
    const year = Number(y);
    const month = Number(m);
    const day = Number(d);
    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return false;
    if (month < 1 || month > 12) return false;
    const mdays = new Date(year, month, 0).getDate();
    if (day < 1 || day > mdays) return false;
    return true;
  }
  // Validation for reason: shows messages normally
  function validateReason(text) {
    const t = text.trim();
    if (!t) {
      setReasonError('Reason is required.');
      return false;
    }
    if (t.length < 3) {
      setReasonError('Reason too short (min 3 characters).');
      return false;
    }
    if (t.length > 400) {
      setReasonError('Reason is too long.');
      return false;
    }
    setReasonError('');
    return true;
  }
  // silent reason check used for isFormValid calc (doesn't set messages)
  function validateReasonSilently(text) {
    const t = (text || '').trim();
    if (!t) return false;
    if (t.length < 3) return false;
    if (t.length > 400) return false;
    return true;
  }
  return (
    <div className="lp-overlay" role="dialog" aria-modal="true" aria-labelledby="lp-title">
      <div className="lp-card">
        <button className="lp-close-btn" onClick={onClose} aria-label="Close">
          <span className="lp-close-circle">
            <img src={closeicon} alt="close" className="lp-close-icon" />
          </span>
        </button>
        <h2 id="lp-title" className="lp-title">New leave request</h2>
        <form className="lp-form" onSubmit={handleSubmit} noValidate>
          {/* Leave Category */}
          <label className="lp-label" htmlFor="lp-category">Leave Category</label>
          <div
            className="lp-input lp-select"
            ref={selectRef}
            onKeyDown={handleKeyDownOnSelect}
          >
            <input
              id="lp-category"
              type="text"
              readOnly
              value={category}
              aria-label="Leave category"
              aria-haspopup="listbox"
              onClick={toggleCategoryDropdown}
              tabIndex={0}
            />
            <img
              src={selecticon}
              alt=""
              className="lp-select-icon"
              aria-hidden="true"
              onClick={toggleCategoryDropdown}
            />
            {isCategoryOpen && (
              <div
                className="lp-select-dropdown"
                role="listbox"
                aria-label="Leave category options"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <div
                    key={opt}
                    role="option"
                    tabIndex={0}
                    className="lp-select-item"
                    aria-selected={opt === category}
                    onClick={() => handleSelectOption(opt)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectOption(opt);
                      }
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Date */}
          <label className="lp-label">Date</label>
          <div className="lp-input lp-date" style={{ position: 'relative' }}>
            <input
              ref={visibleDateRef}
              type="text"
              value={displayDate}
              onChange={handleVisibleDateChange}
              onBlur={onVisibleDateBlur}
              onKeyDown={handleDateKeyDown}
              onPaste={handleDatePaste}
              aria-label="Leave date"
              placeholder="MM/DD/YYYY"
              aria-invalid={!!dateError}
              style={{
                border: 0,
                outline: 'none',
                fontSize: 14,
                width: '100%',
                background: 'transparent',
              }}
            />
            <input
              ref={hiddenDateRef}
              type="date"
              className="lp-hidden-date"
              value={dateISO}
              onChange={onHiddenDateChange}
              aria-hidden="true"
              tabIndex={-1}
            />
            <div
              className="lp-date-icon-wrapper"
              onClick={openDatePicker}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openDatePicker();
                }
              }}
              aria-label="Open date picker"
            >
              <img src={calendericon} alt="" className="lp-date-icon" />
            </div>
          </div>
          {dateError && <div className="lp-error" role="alert">{dateError}</div>}
          {/* Reason */}
          <label className="lp-label">Reason</label>
          <textarea
            className="lp-textarea"
            placeholder="Enter Leave Description"
            value={reason}
            onChange={(e) => {
              const newValue = e.target.value;
              setReason(newValue);
              if (newValue.trim().length > 0) {
                setReasonError('');
              }
            }}
            onBlur={() => validateReason(reason)}
            rows="3"
            maxLength={400}
            aria-label="Reason for leave"
            aria-invalid={!!reasonError}
          />
          {reasonError && <div className="lp-error" role="alert">{reasonError}</div>}
          {/* Upload Document */}
          <div className="lp-upload-row">
            <label className="lp-label">Upload Document (Optional)</label>
            <img src={inicon} alt="" className="lp-info-icon" aria-hidden="true" />
            <div className="lp-pill">Please upload only PDF files.</div>
          </div>
          <div className="lp-input lp-upload">
            <input
              id="lp-file"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              aria-label="Upload proof document"
            />
            <label htmlFor="lp-file" className="lp-upload-fake">
              {fileName || 'Upload your proof document'}
            </label>
            <img src={uploadicon} alt="" className="lp-upload-icon" aria-hidden="true" />
          </div>
          <div className="lp-submit-wrap">
            <Submitbtn label="Submit" onClick={handleSubmit} disabled={!isFormValid} />
          </div>
        </form>
      </div>
    </div>
  );
}
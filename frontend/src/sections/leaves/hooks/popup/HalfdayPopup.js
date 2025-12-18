// halfday.js
import React, { useState, useRef, useEffect } from 'react';
import '../../../../styles/HalfdayPopup.css';
import hcloseicon from '../../../../assets/icons/closeicon.png';
import hselecticon from '../../../../assets/icons/drop.png';
import hcalendericon from '../../../../assets/icons/calender.png';
import hinicon from '../../../../assets/icons/inicon.png';
import huploadicon from '../../../../assets/icons/upload.png';
import HSubmitbtn from '../../../../components/Buttons/Submit_button';
const timeOptions = ['7.00 A.M', '12.00 P.M'];
const Halfday = ({ onClose = () => {} }) => {
  // States and refs for date
  const [dateISO, setDateISO] = useState('');
  const [displayDate, setDisplayDate] = useState('');
  const [dateError, setDateError] = useState('');
  const hiddenDateRef = useRef(null);
  const visibleDateRef = useRef(null);
  const composingRef = useRef(false); // for IME/composition handling
  // States for other fields
  const [leaveCategory, setLeaveCategory] = useState('Half Day');
  const [startTime, setStartTime] = useState('');
  const [startTimeError, setStartTimeError] = useState('');
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  // Dropdown states for start time
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const timeToggleRef = useRef(null);
  const timeMenuRef = useRef(null);
  // Keep display text in sync when the ISO date changes
  useEffect(() => {
    if (dateISO) {
      setDisplayDate(formatIsoToDisplay(dateISO));
    } else {
      setDisplayDate('');
    }
  }, [dateISO]);
  // Disable page scroll while popup is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev || '';
    };
  }, []);
  // Close on ESC (also close dropdown)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (isTimeOpen) setIsTimeOpen(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, isTimeOpen]);
  // Close time dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (
        isTimeOpen &&
        timeMenuRef.current &&
        !timeMenuRef.current.contains(e.target) &&
        timeToggleRef.current &&
        !timeToggleRef.current.contains(e.target)
      ) {
        setIsTimeOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isTimeOpen]);
  // Helper functions for date input handling
  function onCompositionStart() {
    composingRef.current = true;
  }
  function onCompositionEnd(e) {
    composingRef.current = false;
    handleSanitizeAndSet(e.target.value || '');
  }
  function sanitizeDateInput(input) {
    if (!input) return '';
    const sanitized = input.replace(/[^0-9/]/g, '');
    return sanitized.slice(0, 10);
  }
  function handleSanitizeAndSet(value) {
    const cleaned = sanitizeDateInput(value);
    setDisplayDate(cleaned);
    if (cleaned) setDateError('');
  }
  function handleVisibleDateChange(e) {
    if (composingRef.current) {
      setDisplayDate(e.target.value);
      return;
    }
    handleSanitizeAndSet(e.target.value);
  }
  function handleDateKeyDown(e) {
    const ALLOWED_CONTROL_KEYS = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab'
    ];
    if (ALLOWED_CONTROL_KEYS.includes(e.key)) return;
    if (e.key.length === 1 && !/[0-9/]/.test(e.key)) {
      e.preventDefault();
    }
    const cur = visibleDateRef.current?.value || '';
    const selectionLength = (visibleDateRef.current?.selectionEnd - visibleDateRef.current?.selectionStart) || 0;
    if (cur.length - selectionLength >= 10 && e.key.length === 1 && /[0-9/]/.test(e.key)) {
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
    const val = e.target.value;
    setDateISO(val);
    if (val) setDateError('');
  }
  function onVisibleDateBlur() {
    const text = (displayDate || '').trim();
    if (!text) {
      setDateISO('');
      setDateError('Date is required.');
      return;
    }
    const parsed = parseDisplayToIso(text);
    if (parsed) {
      setDateISO(parsed);
      if (hiddenDateRef.current) hiddenDateRef.current.value = parsed;
      setDisplayDate(formatIsoToDisplay(parsed));
      setDateError('');
    } else {
      setDateISO('');
      setDateError('Invalid date format.');
    }
  }
  function parseDisplayToIso(text) {
    if (!text) return null;
    const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
      const [, y, m, d] = isoMatch;
      if (isValidDateParts(y, m, d)) return `${y}-${m}-${d}`;
      return null;
    }
    const mmddMatch = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (mmddMatch) {
      let mm = mmddMatch[1].padStart(2, '0');
      let dd = mmddMatch[2].padStart(2, '0');
      const yyyy = mmddMatch[3];
      if (isValidDateParts(yyyy, mm, dd)) return `${yyyy}-${mm}-${dd}`;
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
    const year = Number(y), month = Number(m), day = Number(d);
    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return false;
    if (month < 1 || month > 12) return false;
    const mdays = new Date(year, month, 0).getDate();
    if (day < 1 || day > mdays) return false;
    return true;
  }
  function formatIsoToDisplay(iso) {
    if (!iso) return '';
    const parts = iso.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      return `${m.padStart(2, '0')}/${d.padStart(2, '0')}/${y}`;
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
  function onReasonBlur() {
    if (!reason.trim()) {
      setReasonError('Reason is required.');
    } else {
      setReasonError('');
    }
  }
  function onStartTimeBlur() {
    if (!startTime) {
      setStartTimeError('Start time is required.');
    } else {
      setStartTimeError('');
    }
  }
  function handleFileChange(e) {
    setUploadFile(e.target.files[0]);
  }
  function handleSubmit(e) {
    e.preventDefault();
    let hasError = false;
    if (!displayDate.trim()) {
      setDateError('Date is required.');
      hasError = true;
    } else {
      const parsed = parseDisplayToIso(displayDate.trim());
      if (!parsed) {
        setDateError('Invalid date format.');
        hasError = true;
      }
    }
    if (!startTime) {
      setStartTimeError('Start time is required.');
      hasError = true;
    }
    if (!reason.trim()) {
      setReasonError('Reason is required.');
      hasError = true;
    }
    if (hasError) return;
    console.log({ leaveCategory, dateISO, startTime, reason, uploadFile });
    // optionally close after submit:
    // onClose();
  }
  /* -------- Start time dropdown handlers -------- */
  function toggleTimeDropdown() {
    setIsTimeOpen((v) => !v);
  }
  function selectTime(option) {
    setStartTime(option);
    setStartTimeError('');
    setIsTimeOpen(false);
  }
  function onTimeToggleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTimeDropdown();
    }
  }
  return (
    <div
      className="hd-overlay"
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        className="hd-popup"
        role="dialog"
        aria-modal="true"
        aria-label="New Leave Request"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className="hd-title">New Leave Request</h2>
        <button className="hd-close-btn" onClick={onClose} aria-label="Close dialog">
          <div className="hd-close-circle">
            <img src={hcloseicon} alt="Close" className="hd-close-icon" />
          </div>
        </button>
        {/* Form now has className hd-form (wraps all labels, inputs and buttons - excludes title & close) */}
        <form className="hd-form" onSubmit={handleSubmit}>
          {/* Leave Category */}
          <label className="hd-label">Leave Category</label>
          <div className="hd-input hd-select" style={{ marginBottom: 16 }}>
            <input
              type="text"
              value={leaveCategory}
              readOnly
              aria-label="Leave category"
              placeholder="Half Day"
            />
            <img src={hselecticon} alt="" className="hd-select-icon" />
          </div>
          {/* Date + Start Time - side-by-side wrapper */}
          <div className="hd-fields-row">
            {/* Date field */}
            <div className="hd-field">
              <label className="hd-label">Date</label>
              <div className={`hd-input hd-date ${dateError ? 'hd-invalid' : ''}`}>
                <input
                  ref={visibleDateRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9/]*"
                  value={displayDate}
                  onChange={handleVisibleDateChange}
                  onInput={(e) => { if (!composingRef.current) handleSanitizeAndSet(e.target.value); }}
                  onKeyDown={handleDateKeyDown}
                  onPaste={handleDatePaste}
                  onBlur={onVisibleDateBlur}
                  onCompositionStart={onCompositionStart}
                  onCompositionEnd={onCompositionEnd}
                  aria-label="Leave date"
                  placeholder="MM/DD/YYYY"
                  aria-invalid={!!dateError}
                  maxLength={10}
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
                  className="hd-hidden-date"
                  value={dateISO}
                  onChange={onHiddenDateChange}
                  aria-hidden="true"
                  tabIndex={-1}
                />
                <div
                  className="hd-date-icon-wrapper"
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
                  <img src={hcalendericon} alt="" className="hd-date-icon" />
                </div>
              </div>
              {dateError && <span className="hd-error">{dateError}</span>}
            </div>
            {/* Start Time field (dropdown) */}
            <div className="hd-field">
              <label className="hd-label">Start Time</label>
              <div className={`hd-input hd-select ${startTimeError ? 'hd-invalid' : ''}`} style={{ paddingRight: 44 , width : 330}}>
                {/* Toggle button styled like an input */}
                <button
                  type="button"
                  className="hd-select-toggle"
                  onClick={toggleTimeDropdown}
                  onKeyDown={onTimeToggleKeyDown}
                  onBlur={onStartTimeBlur}
                  aria-haspopup="listbox"
                  aria-expanded={isTimeOpen}
                  aria-invalid={!!startTimeError}
                  aria-label="Start time"
                  ref={timeToggleRef}
                >
                  <span className={startTime ? '' : 'hd-select-placeholder'}>
                    {startTime || 'Select Time'}
                  </span>
                  <img
                    src={hselecticon}
                    alt=""
                    className={`hd-select-icon ${isTimeOpen ? 'hd-rotated' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {/* Dropdown menu */}
                {isTimeOpen && (
                  <div
                    className="hd-select-menu"
                    role="listbox"
                    aria-label="Start time options"
                    ref={timeMenuRef}
                    tabIndex={-1}
                  >
                    {timeOptions.map((opt) => (
                      <div
                        key={opt}
                        role="option"
                        aria-selected={startTime === opt}
                        className="hd-select-item"
                        onClick={() => selectTime(opt)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            selectTime(opt);
                          }
                        }}
                        tabIndex={0}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {startTimeError && <span className="hd-error">{startTimeError}</span>}
            </div>
          </div>
          {/* Reason */}
          <label className="hd-label">Reason</label>
          <textarea
            className={`hd-textarea ${reasonError ? 'hd-invalid' : ''}`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onBlur={onReasonBlur}
            aria-label="Leave reason"
            placeholder="Enter Leave Description"
            aria-invalid={!!reasonError}
          />
          {reasonError && <span className="hd-error">{reasonError}</span>}
          {/* Upload Document */}
          <div className="hd-upload-row">
            <label className="hd-label" style={{ marginBottom: 0 }}>Upload Document (Optional)</label>
            <img src={hinicon} alt="Info" className="hd-info-icon" />
            <span className="hd-pill">Please Upload only PDF</span>
          </div>
          <div className="hd-input hd-upload" style={{ marginTop: 8 }}>
            <label className="hd-upload-fake" htmlFor="file-upload">
              {uploadFile ? uploadFile.name : 'Upload your proof document'}
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <img src={huploadicon} alt="Upload" className="hd-upload-icon" />
          </div>
          {/* Submit */}
          <div className='hdsubmit-row'>
            <HSubmitbtn type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};
export default Halfday;
import React, { useState, useRef, useEffect } from 'react';
import '../../../../styles/HoursPermission.css';

import hcloseicon from '../../../../assets/icons/closeicon.png';
import hselecticon from '../../../../assets/icons/drop.png';
import hcalendericon from '../../../../assets/icons/calender.png';
import hinicon from '../../../../assets/icons/inicon.png';
import huploadicon from '../../../../assets/icons/upload.png';
import hSubmitbtn from '../../../../components/Buttons/Submit_button';

export default function HoursPermissionPopup({ onClose = () => {} }) {
  const SubmitButton = hSubmitbtn;

  // basic form state
  const [category, setCategory] = useState('Hours Permission');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');

  // Date state & refs
  const [dateISO, setDateISO] = useState('');
  const [displayDate, setDisplayDate] = useState('');
  const [dateError, setDateError] = useState('');
  const hiddenDateRef = useRef(null);
  const visibleDateRef = useRef(null);
  const composingRef = useRef(false); // IME composition guard

  // Upload
  const hiddenFileRef = useRef(null);
  const [fileName, setFileName] = useState('');

  // other validation errors
  const [timeError, setTimeError] = useState('');
  const [reasonError, setReasonError] = useState('');

  // small time options
  const timeOptions = [
    '', '08:00', '08:30'
  ];

  // keep displayDate synced when dateISO changes externally
  useEffect(() => {
    if (dateISO) {
      setDisplayDate(formatIsoToDisplay(dateISO));
    } else {
      // only clear display if iso cleared
      setDisplayDate('');
    }
  }, [dateISO]);

  /* ---------- Date helpers ---------- */
  function formatIsoToDisplay(iso) {
    if (!iso) return '';
    const parts = String(iso).split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      return `${m.padStart(2,'0')}/${d.padStart(2,'0')}/${y}`;
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

  function isValidDateParts(y, m, d) {
    const year = Number(y), month = Number(m), day = Number(d);
    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return false;
    if (month < 1 || month > 12) return false;
    const mdays = new Date(year, month, 0).getDate();
    if (day < 1 || day > mdays) return false;
    return true;
  }

  /* returns ISO YYYY-MM-DD or null if invalid */
  function parseDisplayToIso(text) {
    if (!text) return null;
    const t = text.trim();
    const isoMatch = t.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
      const [, y, m, d] = isoMatch;
      if (isValidDateParts(y, m, d)) return `${y}-${m}-${d}`;
      return null;
    }
    const mmddMatch = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (mmddMatch) {
      let mm = mmddMatch[1].padStart(2, '0');
      let dd = mmddMatch[2].padStart(2, '0');
      const yyyy = mmddMatch[3];
      if (isValidDateParts(yyyy, mm, dd)) return `${yyyy}-${mm}-${dd}`;
      return null;
    }
    // try Date parse fallback
    const dt = new Date(t);
    if (!isNaN(dt)) {
      const yyyy = String(dt.getFullYear());
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const dd = String(dt.getDate()).padStart(2, '0');
      if (isValidDateParts(yyyy, mm, dd)) return `${yyyy}-${mm}-${dd}`;
    }
    return null;
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
    setDateISO(val || '');
    if (val) {
      setDisplayDate(formatIsoToDisplay(val));
      setDateError('');
    }
  }

  /* ---------- Input sanitization & IME handling ---------- */
  function onCompositionStart() {
    composingRef.current = true;
  }
  function onCompositionEnd(e) {
    composingRef.current = false;
    handleSanitizeAndSet(e.target.value || '');
  }

  function sanitizeDateInput(input) {
    if (!input) return '';
    // allow only digits and slash
    const sanitized = input.replace(/[^0-9/]/g, '');
    // enforce mm/dd/yyyy length limit = 10
    return sanitized.slice(0, 10);
  }

  function handleSanitizeAndSet(value) {
    const cleaned = sanitizeDateInput(value);
    setDisplayDate(cleaned);
    if (cleaned) setDateError('');
  }

  function handleVisibleDateChange(e) {
    if (composingRef.current) {
      // while composing just set raw value
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
    // allow numeric keys and slash only
    if (e.key.length === 1 && !/[0-9/]/.test(e.key)) {
      e.preventDefault();
      return;
    }
    // enforce max length when typing (consider selection)
    const cur = visibleDateRef.current && visibleDateRef.current.value ? visibleDateRef.current.value : '';
    const selStart = visibleDateRef.current && visibleDateRef.current.selectionStart || 0;
    const selEnd = visibleDateRef.current && visibleDateRef.current.selectionEnd || 0;
    const selectionLength = Math.max(0, selEnd - selStart);
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

  /* blur: parse to ISO or show required message */
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
      // invalid format — per request, do not show parse error; keep typed text
      setDateISO('');
      // leave dateError alone (do not change to parse message)
    }
  }

  /* ---------- Upload handlers ---------- */
  function onFakeUploadClick() {
    if (hiddenFileRef.current) hiddenFileRef.current.click();
  }
  function onFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (f) setFileName(f.name);
    else setFileName('');
  }

  /* ---------- Validation helpers ---------- */
  function validateReason() {
    const t = (reason || '').trim();
    if (!t) {
      setReasonError('Reason is required.');
      return false;
    }
    if (t.length < 5) {
      setReasonError('Please enter at least 5 characters.');
      return false;
    }
    setReasonError('');
    return true;
  }

  function validateTimes() {
    setTimeError('');
    if (!startTime || !endTime) {
      setTimeError('Start and end times are required.');
      return false;
    }
    // simple compare HH:MM strings
    if (startTime >= endTime) {
      setTimeError('End time must be later than start time.');
      return false;
    }
    setTimeError('');
    return true;
  }

  function validateDateOnSubmit() {
    const trimmed = (displayDate || '').trim();
    if (!trimmed) {
      setDateError('Date is required.');
      return false;
    }
    const parsed = parseDisplayToIso(trimmed);
    if (!parsed) {
      // do not show explicit invalid-message per instruction; just block submit silently
      // but set dateISO to '' to avoid partial payload
      setDateISO('');
      return false;
    }
    setDateISO(parsed);
    setDateError('');
    return true;
  }

  /* ---------- Submit ---------- */
  function submitHandler(e) {
    e.preventDefault();
    const okDate = validateDateOnSubmit();
    const okReason = validateReason();
    const okTimes = validateTimes();

    if (!okDate || !okReason || !okTimes) {
      // block submission
      return;
    }

    const payload = {
      category,
      date: dateISO,
      startTime,
      endTime,
      reason,
      attached: fileName || null,
    };
    console.log('submit payload', payload);
    onClose();
  }

  return (
    <div className="h-overlay" role="dialog" aria-modal="true">
      <div className="h-popup">
        <button
          className="h-close-btn"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          <span className="h-close-circle">
            <img src={hcloseicon} alt="close" className="h-close-icon" />
          </span>
        </button>

        <h2 className="h-title">New leave request</h2>

        <form className="h-form" onSubmit={submitHandler} noValidate>
          {/* Category */}
          <label className="h-label">Leave Category</label>
          <div className="h-input h-select" style={{ position: 'relative' }}>
            <input
              type="text"
              readOnly
              value={category}
              aria-label="Leave category"
              className="h-input-text"
            />
            <img src={hselecticon} alt="" className="h-select-icon" />
          </div>

          {/* Date + Start/End time row */}
          <div className="h-row">
            <div>
              <label className="h-label">Date</label>
              <div className={`h-input h-date ${dateError ? 'h-input-invalid' : ''}`} style={{ position: 'relative' }}>
                {/* VISIBLE TEXT INPUT */}
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
                  className="h-input-text"
                />

                {/* Native date input - visually hidden but still usable programmatically */}
                <input
                  ref={hiddenDateRef}
                  type="date"
                  className="h-hidden-date"
                  value={dateISO}
                  onChange={onHiddenDateChange}
                  aria-hidden="true"
                  tabIndex={-1}
                />

                {/* Calendar icon */}
                <div
                  className="h-date-icon-wrapper"
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
                  <img src={hcalendericon} alt="" className="h-date-icon" />
                </div>
              </div>
              {dateError ? <div className="h-error" role="alert">{dateError}</div> : null}
            </div>

            <div>
              <label className="h-label">Start Time</label>
              <div className={`h-input h-time ${timeError ? 'h-input-invalid' : ''}`} style={{ position: 'relative' }}>
                <select
                  className="h-input-text"
                  value={startTime}
                  onChange={(e) => { setStartTime(e.target.value); setTimeError(''); }}
                  aria-label="Start time"
                  aria-invalid={!!timeError}
                >
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t || 'Select Time'}
                    </option>
                  ))}
                </select>
                <img src={hselecticon} alt="" className="h-select-icon h-select-icon-rot" />
              </div>
            </div>

            <div>
              <label className="h-label">End Time</label>
              <div className={`h-input h-time ${timeError ? 'h-input-invalid' : ''}`} style={{ position: 'relative' }}>
                <select
                  className="h-input-text"
                  value={endTime}
                  onChange={(e) => { setEndTime(e.target.value); setTimeError(''); }}
                  aria-label="End time"
                  aria-invalid={!!timeError}
                >
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t || 'Select Time'}
                    </option>
                  ))}
                </select>
                <img src={hselecticon} alt="" className="h-select-icon h-select-icon-rot" />
              </div>
              {timeError ? <div className="h-error" role="alert">{timeError}</div> : null}
            </div>
          </div>

          {/* Reason */}
          <label className="h-label">Reason</label>
          <div className={`h-input`} style={{ minHeight: 80 }}>
            <textarea
              className="h-input-text"
              placeholder="Enter Leave Description"
              value={reason}
              onChange={(e) => { setReason(e.target.value); if (reasonError) setReasonError(''); }}
              rows={3}
              maxLength={500}
              aria-label="Reason"
              aria-invalid={!!reasonError}
              style={{ maxHeight: 50 }}
            />
          </div>
          {reasonError ? <div className="h-error" role="alert">{reasonError}</div> : null}

          {/* Upload row label + pill */}
          <div className="h-upload-row" style={{ marginTop: 12 }}>
            <label className="h-upload-label">Upload Document (Optional)</label>
            <img src={hinicon} alt="" className="h-info-icon" />
            <span className="h-pill">Please upload only PDF files.</span>
          </div>

          <div className="h-input h-upload" style={{ position: 'relative' }}>
            <div
              className="h-upload-fake"
              onClick={onFakeUploadClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onFakeUploadClick();
              }}
            >
              {fileName || 'Upload your proof document'}
            </div>

            <input
              ref={hiddenFileRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={onFileChange}
              className="h-hidden-file"
              style={{ display: 'none' }}
            />

            <img src={huploadicon} alt="upload" className="h-upload-icon" />
          </div>

          {/* Submit button */}
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
            {SubmitButton ? <SubmitButton label="Submit" /> : <button type="submit">Submit</button>}
          </div>
        </form>
      </div>
    </div>
  );
}
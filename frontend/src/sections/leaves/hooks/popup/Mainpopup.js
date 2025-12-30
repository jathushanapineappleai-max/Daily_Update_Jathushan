// // MainPopup.js
// import React, { useState, useEffect, useRef } from 'react';
// import '../../../../styles/Mainpopup.css';
// import dropicon from '../../../../assets/icons/drop.png';
// import closeicon from '../../../../assets/icons/closeicon.png'; // close icon
// import Submitbtn from '../../../../components/Buttons/Submit_button';
// import Fulldaypopup from '../popup/FulldayPopup';
// import ExtendedLeave from './ExtendedLeave';
// import HoursPermissionPopup from './HoursPermission';
// import CompulsoryLeave from './CompulsoryLeave';

// const LEAVE_OPTIONS = [
//   'Full Day',
//   'Extended Leave',
//   'Compulsory Leave',
//   'Half Day',
//   'Hours Permission',
// ];

// export default function MainPopup({ onClose = () => {} }) {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [selected, setSelected] = useState(''); // chosen leave type
//   const [showFullDay, setShowFullDay] = useState(false);
//   const [showExtendedLeave, setShowExtendedLeave] = useState(false);
//   const [showHoursPermission, setShowHoursPermission] = useState(false);
//   const [showCompulsoryLeave, setShowCompulsoryLeave] = useState(false);
//   const [showMainContent, setShowMainContent] = useState(true);
//   const [thought, setThought] = useState(null); // used by think()
//   const dropdownRef = useRef(null);

//   // think() - user asked to include a "think" function. It stores a short debug note and logs.
//   function think(action) {
//     const note = `${action} @ ${new Date().toLocaleTimeString()}`;
//     setThought(note);
//     // keep debug console for dev
//     // eslint-disable-next-line no-console
//     console.log('think:', note, { selected, dropdownOpen });
//   }

//   useEffect(() => {
//     function handleOutsideClick(e) {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     }
//     if (dropdownOpen) {
//       document.addEventListener('mousedown', handleOutsideClick);
//     } else {
//       document.removeEventListener('mousedown', handleOutsideClick);
//     }
//     return () => document.removeEventListener('mousedown', handleOutsideClick);
//   }, [dropdownOpen]);

//   function toggleDropdown() {
//     setDropdownOpen((s) => {
//       const next = !s;
//       think(next ? 'open-dropdown' : 'close-dropdown');
//       return next;
//     });
//   }

//   function selectOption(opt) {
//     setSelected(opt);
//     setDropdownOpen(false);
//     think(`select-${opt}`);
//   }

//   function handleSubmit(e) {
//     e.preventDefault();
//     think('submit');

//     // Route to the specific popup based on selection
//     switch (selected) {
//       case 'Full Day':
//         setShowMainContent(false);
//         setShowFullDay(true);
//         return;
//       case 'Extended Leave':
//         setShowMainContent(false);
//         setShowExtendedLeave(true);
//         return;
//       case 'Hours Permission':
//         setShowMainContent(false);
//         setShowHoursPermission(true);
//         return;
//       case 'Compulsory Leave':
//         // <-- new integration
//         setShowMainContent(false);
//         setShowCompulsoryLeave(true);
//         return;
//       // for unimplemented options like Half Day fallthrough to closing or future handling
//       default:
//         // no matching popup: just close or send data outward
//         onClose();
//         return;
//     }
//   }

//   // Full Day handlers
//   function handleFullDayClose() {
//     setShowFullDay(false);
//     onClose();
//   }

//   function handleFullDaySubmit(formData) {
//     think('full-day-submitted');
//     console.log('Submitted full day leave:', formData);
//     setShowFullDay(false);
//     onClose();
//   }

//   // Extended Leave handlers
//   function handleExtendedClose() {
//     setShowExtendedLeave(false);
//     onClose();
//   }

//   function handleExtendedSubmit(formData) {
//     think('extended-leave-submitted');
//     console.log('Submitted extended leave:', formData);
//     setShowExtendedLeave(false);
//     onClose();
//   }

//   // Hours Permission handlers
//   function handleHoursPermissionClose() {
//     setShowHoursPermission(false);
//     onClose();
//   }

//   function handleHoursPermissionSubmit(formData) {
//     think('hours-permission-submitted');
//     console.log('Submitted hours permission:', formData);
//     setShowHoursPermission(false);
//     onClose();
//   }

//   // Compulsory Leave handlers (new)
//   function handleCompulsoryClose() {
//     setShowCompulsoryLeave(false);
//     onClose();
//   }

//   function handleCompulsorySubmit(formData) {
//     think('compulsory-leave-submitted');
//     console.log('Submitted compulsory leave:', formData);
//     setShowCompulsoryLeave(false);
//     onClose();
//   }

//   return (
//     <>
//       {showMainContent && (
//         <div className="mp-overlay">
//           <div
//             className="mp-container"
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="mp-title"
//           >
//             <button
//               className="mp-closebtn"
//               onClick={onClose}
//               aria-label="Close"
//             >
//               <div className="close-circle">
//                 <img src={closeicon} alt="close" />
//               </div>
//             </button>

//             <h2 id="mp-title" className="mp-title">
//               New leave request
//             </h2>

//             <form className="mp-form" onSubmit={handleSubmit}>
//               <label className="mp-label">Leave Type</label>
//               <div className="mp-dropdown" ref={dropdownRef}>
//                 <button
//                   type="button"
//                   className={`mp-select ${dropdownOpen ? 'open' : ''}`}
//                   onClick={toggleDropdown}
//                   aria-haspopup="listbox"
//                   aria-expanded={dropdownOpen}
//                 >
//                   <span
//                     className={`mp-placeholder ${selected ? 'has-value' : ''}`}
//                   >
//                     {selected || 'Choose a type for your leave'}
//                   </span>
//                   <img className="mp-dropicon" src={dropicon} alt="toggle" />
//                 </button>

//                 {dropdownOpen && (
//                   <ul className="mp-options" role="listbox" tabIndex={-1}>
//                     {LEAVE_OPTIONS.map((opt) => (
//                       <li
//                         key={opt}
//                         className={`mp-option ${selected === opt ? 'selected' : ''}`}
//                         onClick={() => selectOption(opt)}
//                         role="option"
//                         aria-selected={selected === opt}
//                       >
//                         {opt}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>

//               <div className="mp-submit-row">
//                 {/* Submitbtn assumed to pass through type="submit" */}
//                 <Submitbtn type="submit" onClick={(e) => { /* fallback if needed */ }} />
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Render conditional popups */}
//       {showFullDay && (
//         <Fulldaypopup
//           onClose={handleFullDayClose}
//           onSubmit={handleFullDaySubmit}
//         />
//       )}

//       {showExtendedLeave && (
//         <ExtendedLeave
//           onClose={handleExtendedClose}
//           onSubmit={handleExtendedSubmit}
//         />
//       )}

//       {showHoursPermission && (
//         <HoursPermissionPopup
//           onClose={handleHoursPermissionClose}
//           onSubmit={handleHoursPermissionSubmit}
//         />
//       )}

//       {/* Compulsory Leave popup */}
//       {showCompulsoryLeave && (
//         <CompulsoryLeave
//           onClose={handleCompulsoryClose}
//           onSubmit={handleCompulsorySubmit}
//         />
//       )}
//     </>
//   );
// }


// MainPopup.js
import React, { useState, useEffect, useRef } from 'react';
import '../../../../styles/Mainpopup.css';
import dropicon from '../../../../assets/icons/drop.png';
import closeicon from '../../../../assets/icons/closeicon.png'; // close icon
import Submitbtn from '../../../../components/Buttons/Submit_button';
import Fulldaypopup from '../popup/FulldayPopup';
import ExtendedLeave from './ExtendedLeave';
import HoursPermissionPopup from './HoursPermission';
import CompulsoryLeave from './CompulsoryLeave';

const LEAVE_OPTIONS = [
  'Full Day',
  'Extended Leave',
  'Compulsory Leave',
  'Half Day',
  'Hours Permission',
];

export default function MainPopup({ onClose = () => {} }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState(''); // chosen leave type
  const [showFullDay, setShowFullDay] = useState(false);
  const [showExtendedLeave, setShowExtendedLeave] = useState(false);
  const [showHoursPermission, setShowHoursPermission] = useState(false);
  const [showCompulsoryLeave, setShowCompulsoryLeave] = useState(false);
  const [showMainContent, setShowMainContent] = useState(true);
  const [, setThought] = useState(null); // used by think()
  const dropdownRef = useRef(null);

  // think() - user asked to include a "think" function. It stores a short debug note and logs.
  function think(action) {
    const note = `${action} @ ${new Date().toLocaleTimeString()}`;
    setThought(note);
    // keep debug console for dev
    // eslint-disable-next-line no-console
    console.log('think:', note, { selected, dropdownOpen });
  }

  useEffect(() => {
    function handleOutsideClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [dropdownOpen]);

  function toggleDropdown() {
    setDropdownOpen((s) => {
      const next = !s;
      think(next ? 'open-dropdown' : 'close-dropdown');
      return next;
    });
  }

  function selectOption(opt) {
    setSelected(opt);
    setDropdownOpen(false);
    think(`select-${opt}`);
  }

  function handleSubmit(e) {
    e.preventDefault();
    think('submit');

    // Route to the specific popup based on selection
    switch (selected) {
      case 'Full Day':
        setShowMainContent(false);
        setShowFullDay(true);
        return;
      case 'Extended Leave':
        setShowMainContent(false);
        setShowExtendedLeave(true);
        return;
      case 'Hours Permission':
        setShowMainContent(false);
        setShowHoursPermission(true);
        return;
      case 'Compulsory Leave':
        // <-- new integration
        setShowMainContent(false);
        setShowCompulsoryLeave(true);
        return;
      // for unimplemented options like Half Day fallthrough to closing or future handling
      default:
        // no matching popup: just close or send data outward
        onClose();
        return;
    }
  }

  // Full Day handlers
  function handleFullDayClose() {
    setShowFullDay(false);
    onClose();
  }

  function handleFullDaySubmit(formData) {
    think('full-day-submitted');
    console.log('Submitted full day leave:', formData);
    setShowFullDay(false);
    onClose();
  }

  // Extended Leave handlers
  function handleExtendedClose() {
    setShowExtendedLeave(false);
    onClose();
  }

  function handleExtendedSubmit(formData) {
    think('extended-leave-submitted');
    console.log('Submitted extended leave:', formData);
    setShowExtendedLeave(false);
    onClose();
  }

  // Hours Permission handlers
  function handleHoursPermissionClose() {
    setShowHoursPermission(false);
    onClose();
  }

  function handleHoursPermissionSubmit(formData) {
    think('hours-permission-submitted');
    console.log('Submitted hours permission:', formData);
    setShowHoursPermission(false);
    onClose();
  }

  // Compulsory Leave handlers (new)
  function handleCompulsoryClose() {
    setShowCompulsoryLeave(false);
    onClose();
  }

  function handleCompulsorySubmit(formData) {
    think('compulsory-leave-submitted');
    console.log('Submitted compulsory leave:', formData);
    setShowCompulsoryLeave(false);
    onClose();
  }

  return (
    <>
      {showMainContent && (
        <div className="mp-overlay">
          <div
            className="mp-container"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mp-title"
          >
            <button
              className="mp-closebtn"
              onClick={onClose}
              aria-label="Close"
            >
              <div className="close-circle">
                <img src={closeicon} alt="close" />
              </div>
            </button>

            <h2 id="mp-title" className="mp-title">
              New leave request
            </h2>

            <form className="mp-form" onSubmit={handleSubmit}>
              <label className="mp-label">Leave Type</label>
              <div className="mp-dropdown" ref={dropdownRef}>
                <button
                  type="button"
                  className={`mp-select ${dropdownOpen ? 'open' : ''}`}
                  onClick={toggleDropdown}
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                >
                  <span
                    className={`mp-placeholder ${selected ? 'has-value' : ''}`}
                  >
                    {selected || 'Choose a type for your leave'}
                  </span>
                  <img className="mp-dropicon" src={dropicon} alt="toggle" />
                </button>

                {dropdownOpen && (
                  <ul className="mp-options" role="listbox" tabIndex={-1}>
                    {LEAVE_OPTIONS.map((opt) => (
                      <li
                        key={opt}
                        className={`mp-option ${selected === opt ? 'selected' : ''}`}
                        onClick={() => selectOption(opt)}
                        role="option"
                        aria-selected={selected === opt}
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mp-submit-row">
                {/* Submitbtn assumed to pass through type="submit" */}
                <Submitbtn type="submit" onClick={(e) => { /* fallback if needed */ }} />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Render conditional popups */}
      {showFullDay && (
        <Fulldaypopup
          onClose={handleFullDayClose}
          onSubmit={handleFullDaySubmit}
        />
      )}

      {showExtendedLeave && (
        <ExtendedLeave
          onClose={handleExtendedClose}
          onSubmit={handleExtendedSubmit}
        />
      )}

      {showHoursPermission && (
        <HoursPermissionPopup
          onClose={handleHoursPermissionClose}
          onSubmit={handleHoursPermissionSubmit}
        />
      )}

      {/* Compulsory Leave popup */}
      {showCompulsoryLeave && (
        <CompulsoryLeave
          onClose={handleCompulsoryClose}
          onSubmit={handleCompulsorySubmit}
        />
      )}
    </>
  );
}
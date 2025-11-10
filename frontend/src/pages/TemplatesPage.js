import React, { useState } from 'react';
import './Pages.css';
import ServiceLetterTemplate from '../sections/templates/ServiceLetterTemplate';
import OfferLetterTemplate from '../sections/templates/OfferLetterTemplate';

export default function TemplatesPage() {
  const [active, setActive] = useState('service'); // 'service' | 'offer'

  return (
    <div className="page-container">
      <h1 className="page-title">Templates</h1>

      <div className="d-flex align-items-center gap-2" style={{ marginBottom: 16 }}>
        <div className="btn-group" role="group" aria-label="Template switcher">
          <button
            type="button"
            className={`btn ${active === 'service' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setActive('service')}
          >
            Service
          </button>
          <button
            type="button"
            className={`btn ${active === 'offer' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setActive('offer')}
          >
            Offer
          </button>
        </div>
      </div>

      <div>
        {active === 'service' ? <ServiceLetterTemplate /> : <OfferLetterTemplate />}
      </div>
    </div>
  );
}


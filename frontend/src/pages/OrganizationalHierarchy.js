// src/pages/OrganizationalHierarchy.js
import React from "react";
import { useNavigate } from "react-router-dom";
import backIcon from "../assets/icons/title_back.png";
import arrowLeft from "../assets/icons/arrow-left.png";
import arrowRight from "../assets/icons/arrow-right.png";
import arrowDown from "../assets/icons/arrow-down.png";
import arrowDownMultiple from "../assets/icons/arrow-down-multiple.png";
import arrowDownMultiple2 from "../assets/icons/arrow-down-multiple2.png";
import arrowDownMultiple3 from "../assets/icons/arrow-down-multiple3.png";
import arrowDownMultiple4 from "../assets/icons/arrow-down-multiple4.png"; // NEW!

import "../styles/OrganizationalHierarchy.css";

const OrganizationalHierarchy = () => {
  const navigate = useNavigate();

  const Card = ({ name, role, isCEO = false }) => (
    <div className={`org-card ${isCEO ? "org-card--ceo" : ""}`}>
      <div className="org-card__avatar">
        <img
          src={
            isCEO
              ? "https://via.placeholder.com/42/347E45/FFFFFF?text=L"
              : `https://via.placeholder.com/42/6B4199/FFFFFF?text=${name[0]}`
          }
          alt={name}
        />
      </div>
      <div className="org-card__text">
        <h3>{name}</h3>
        <p>{role}</p>
      </div>
    </div>
  );

  return (
    <div className="page-container org-hierarchy-page">
      <div className="org-header-card">
        <button className="org-back-button" onClick={() => navigate(-1)}>
          <img src={backIcon} alt="Back" />
        </button>
        <h1 className="org-header-title">Organizational Hierarchy</h1>
      </div>

      <div className="org-chart-wrapper">
        <div className="org-chart-canvas">
          {/* LEVEL 1 */}
          <div className="org-ceo"><Card name="Lakshan" role="CEO" isCEO /></div>
          <img src={arrowLeft} alt="" className="org-arrow-left" />
          <img src={arrowRight} alt="" className="org-arrow-right" />
          <div className="org-coo"><Card name="Nivethiga" role="COO" /></div>
          <div className="org-cto"><Card name="Nayanan" role="CTO" /></div>

          {/* LEVEL 2 ARROWS */}
          <img src={arrowDown} alt="" className="org-arrow-down" />
          <img src={arrowDownMultiple} alt="" className="org-arrow-down-multiple" />

          {/* LEVEL 2 CARDS */}
          <div className="org-project-manager"><Card name="Niroshan" role="Project Manager" /></div>
          <div className="org-ccoo"><Card name="Nivethiga" role="CCOO" /></div>

          {/* LEVEL 3 ARROWS */}
          <img src={arrowDown} alt="" className="org-arrow-down-level3" />
          <img src={arrowDownMultiple2} alt="" className="org-arrow-down-multiple2" />
          <img src={arrowDownMultiple3} alt="" className="org-arrow-down-multiple3" />
          <img src={arrowDownMultiple4} alt="" className="org-arrow-down-multiple4" /> {/* NEW — COO to CFOO */}

          {/* LEVEL 3 CARDS */}
          <div className="org-uiux-lead"><Card name="Sanjeevan" role="UI/UX Team Lead" /></div>
          <div className="org-chroo"><Card name="Nivethiga" role="CHROO" /></div>
          <div className="org-cmoo"><Card name="Nivethiga" role="CMOO" /></div>
          <div className="org-cfoo"><Card name="Nivethiga" role="CFOO" /></div> {/* NEW — right of CMOO */}
        </div>
      </div>
    </div>
  );
};

export default OrganizationalHierarchy;
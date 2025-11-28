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
import arrowDownMultiple4 from "../assets/icons/arrow-down-multiple4.png";

// Real profile images
import lakshan from "../assets/images/lakshan.png";
import nivethiga from "../assets/images/nivethiga.png";
import nayanan from "../assets/images/nayanan.png";
import niroshan from "../assets/images/niroshan.png";
import sanjeevan from "../assets/images/sanjeevan.png";

import "../styles/OrganizationalHierarchy.css";

const OrganizationalHierarchy = () => {
  const navigate = useNavigate();

  // Map names → images
  const profileImages = {
    Lakshan: lakshan,
    Nivethiga: nivethiga,
    Nayanan: nayanan,
    Niroshan: niroshan,
    Sanjeevan: sanjeevan,
  };

  // Card component – now supports team lead style
  const Card = ({ name, role, isCEO = false, isTeamLead = false }) => {
    const profilePic =
      profileImages[name] || "https://via.placeholder.com/42/6B4199/FFFFFF?text=?";

    return (
      <div
        className={`
          org-card 
          ${isCEO ? "org-card--ceo" : ""} 
          ${isTeamLead ? "org-card--team-lead" : ""}
        `}
      >
        <div className="org-card__avatar">
          <img
            src={profilePic}
            alt={name}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/42/6B4199/FFFFFF?text=?";
            }}
          />
        </div>

        <div className="org-card__text">
          <h3>{name}</h3>
          <p>{role}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container org-hierarchy-page">
      <div className="org-header-card">
        <button className="org-back-button" onClick={() => navigate(-1)}>
          <img src={backIcon} alt="Back" />
        </button>
        <h1 className="org-header-title">Organizational Hierarchy</h1>
      </div>

      <div className="org-chart-wrapper">
        <div className="org-chart-inner">
          <div className="org-chart-canvas">
            {/* CEO */}
            <div className="org-ceo">
              <Card name="Lakshan" role="CEO" isCEO />
            </div>

            {/* Level 1 */}
            <img src={arrowLeft} alt="" className="org-arrow-left" />
            <img src={arrowRight} alt="" className="org-arrow-right" />
            <div className="org-coo">
              <Card name="Nivethiga" role="COO" />
            </div>
            <div className="org-cto">
              <Card name="Nayanan" role="CTO" />
            </div>

            {/* Level 2 */}
            <img src={arrowDown} alt="" className="org-arrow-down" />
            <img src={arrowDownMultiple} alt="" className="org-arrow-down-multiple" />

            <div className="org-project-manager">
              <Card name="Niroshan" role="Project Manager" />
            </div>
            <div className="org-ccoo">
              <Card name="Nivethiga" role="CCOO" />
            </div>

            {/* Level 3 */}
            <img src={arrowDown} alt="" className="org-arrow-down-level3" />
            <img src={arrowDownMultiple2} alt="" className="org-arrow-down-multiple2" />
            <img src={arrowDownMultiple3} alt="" className="org-arrow-down-multiple3" />
            <img src={arrowDownMultiple4} alt="" className="org-arrow-down-multiple4" />

            {/* Sanjeevan – Team Lead with special card */}
            <div className="org-uiux-lead">
              <Card name="Sanjeevan" role="UI/UX Team Lead" isTeamLead />
            </div>

            {/* Other direct reports */}
            <div className="org-chroo">
              <Card name="Nivethiga" role="CHROO" />
            </div>
            <div className="org-cmoo">
              <Card name="Nivethiga" role="CMOO" />
            </div>
            <div className="org-cfoo">
              <Card name="Nivethiga" role="CFOO" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationalHierarchy;
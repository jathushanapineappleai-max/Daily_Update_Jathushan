// src/pages/OrganizationalHierarchy.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Tree, TreeNode } from "react-organizational-chart";
import backIcon from "../assets/icons/title_back.png";
import "./Pages.css";
import "../styles/OrganizationalHierarchy.css";

const OrganizationalHierarchy = () => {
  const navigate = useNavigate();

  const Card = ({ name, role, avatar }) => (
    <div className="org-node">
      <div className="org-avatar">
        <img
          src={avatar || `https://via.placeholder.com/80/6B4199/FFFFFF?text=${name[0]}`}
          alt={name}
        />
      </div>
      <div className="org-info">
        <h3>{name}</h3>
        <p>{role}</p>
      </div>
    </div>
  );

  return (
    <div className="page-container org-hierarchy-page">
      {/* Header */}
      <div className="org-hierarchy-header-card">
        <button className="org-hierarchy-back-button" onClick={() => navigate(-1)}>
          <img src={backIcon} alt="Back" />
        </button>
        <h1 className="org-hierarchy-header-title">Organizational Hierarchy</h1>
      </div>

      {/* Chart Body */}
      <div className="org-hierarchy-body-card">
        <div className="org-chart-wrapper">
          {/* CEO at top center */}
          <Tree
            lineWidth="3px"
            lineColor="#1e293b"
            lineBorderRadius="20px"
            label={
              <Card
                name="Lakshan"
                role="CEO"
                avatar="https://via.placeholder.com/90/347E45/FFFFFF?text=L"
              />
            }
          >
            {/* Horizontal split: COO (left) + CTO (right) */}
            <TreeNode>
              <Tree direction="horizontal" label={<Card name="Nivethiga" role="COO" />}>
                <TreeNode label={<Card name="Nivethiga" role="CCO" />} />
                <TreeNode label={<Card name="Nivethiga" role="CHRO" />} />
                <TreeNode label={<Card name="Nivethiga" role="CMO" />} />
                <TreeNode label={<Card name="Nivethiga" role="CFO" />} />
              </Tree>
            </TreeNode>

            <TreeNode>
              <Tree direction="vertical" label={<Card name="Nayanan" role="CTO" />}>
                <TreeNode>
                  <Tree direction="vertical" label={<Card name="Niroshan" role="Project Manager" />}>
                    <TreeNode label={<Card name="Sanjeevan" role="UI/UX Team Lead" />} />
                  </Tree>
                </TreeNode>
              </Tree>
            </TreeNode>
          </Tree>
        </div>
      </div>
    </div>
  );
};

export default OrganizationalHierarchy;
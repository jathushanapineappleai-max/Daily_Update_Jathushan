import React from "react";
import "../../../styles/admin_panel/contact.css";

// Arrow icon for sorting (up/down)
import sortIcon from "../../../assets/icons/sort_arrows.png";

// Action icons (Vector + Frame)
import editIcon from "../../../assets/icons/Frame.png";
import deleteIcon from "../../../assets/icons/Vector.png";

export default function Contact() {
  // Columns
  const columns = ["Name", "Email", "Phone Number", "Services", "Message", "Action"];

  // Dummy data (constructor-style)
  const contacts = [
    {
      name: "John Doe",
      email: "example@gmail.com",
      phone: "0757448876",
      service: "Web Development",
      message: "Hello, I need support regarding my project.",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "0712345678",
      service: "UI/UX Design",
      message: "Looking for a redesign for my portfolio.",
    },
    {
      name: "Michael Lee",
      email: "mike@agency.com",
      phone: "0722334455",
      service: "App Development",
      message: "Need help with a React Native app.",
    },
    {
      name: "Sophia Turner",
      email: "sophia@creative.co",
      phone: "0755332211",
      service: "E-Commerce",
      message: "Building an online store for fashion products.",
    },
    {
      name: "David Brown",
      email: "david@itfirm.com",
      phone: "0788991122",
      service: "IT Consulting",
      message: "Need consulting on cloud migration.",
    },
    {
      name: "Olivia Green",
      email: "olivia@studio.com",
      phone: "0744556677",
      service: "AI/ML Development",
      message: "Looking for AI chatbot integration.",
    },
    {
      name: "Liam Johnson",
      email: "liam@tech.com",
      phone: "0766788899",
      service: "QA Testing",
      message: "Need help with test automation setup.",
    },
    {
      name: "Emily Brown",
      email: "emilyb@example.com",
      phone: "0799223344",
      service: "Web Hosting",
      message: "Require assistance with hosting setup.",
    },
    {
      name: "Noah Patel",
      email: "noah@designs.net",
      phone: "0711885544",
      service: "UI/UX Design",
      message: "Designing dashboard for admin panel.",
    },
    {
      name: "Ava Wilson",
      email: "ava@enterprise.com",
      phone: "0788114455",
      service: "Web Development",
      message: "Corporate website revamp project.",
    },
  ];

  return (
    <div className="contact-wrapper">
      {/* Page heading */}
      <h1 className="contact-page-heading">Contact</h1>

      <div className="contact-section">
        <div className="contact-header-wrapper">
          <h2 className="contact-header">All Contacts</h2>
          <div className="contact-counter">1 - 10 of 256</div>
        </div>

        {/* Table headers */}
        <div className="contact-row header-row">
          {columns.map((col) => (
            <div key={col} className="contact-column">
              <span>{col}</span>
              {col !== "Action" && (
                <img src={sortIcon} alt="Sort" className="column-icon" />
              )}
            </div>
          ))}
        </div>

        {/* Render rows dynamically */}
        {contacts.map((contact, index) => (
          <div
            className={`contact-row ${index % 2 === 0 ? "alt-row" : ""}`}
            key={index}
          >
            <div className="contact-column">{contact.name}</div>
            <div className="contact-column">{contact.email}</div>
            <div className="contact-column">{contact.phone}</div>
            <div className="contact-column">{contact.service}</div>
            <div className="contact-column">{contact.message}</div>
            <div className="contact-column contact-actions">
              <button className="icon-btn" title="Edit">
                <img src={editIcon} alt="Edit" />
              </button>
              <button className="icon-btn" title="Delete">
                <img src={deleteIcon} alt="Delete" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
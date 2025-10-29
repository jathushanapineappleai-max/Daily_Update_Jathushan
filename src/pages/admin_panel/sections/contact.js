import React, { useState } from "react";
import "../../../styles/admin_panel/contact.css";
import Pagination from "../../../components/admin_panel/pagination";

// Arrow icon for sorting (up/down)
import sortIcon from "../../../assets/icons/sort_arrows.png";

// Action icons (Vector + Frame)
import editIcon from "../../../assets/icons/Frame.png";
import deleteIcon from "../../../assets/icons/Vector.png";

export default function Contact() {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for contacts
  const [contacts, setContacts] = useState([
    {
      name: "John Doe",
      email: "example@gmail.com",
      phone: "0757448876",
      service: "Web Development",
      message: "Enjoys adventurous travel, seeks new cultures and offbeat destinations",
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
      message: "Enjoys adventurous travel, seeks new cultures and offbeat destinations",
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
  ]);

  // Pagination logic
  const totalContacts = contacts.length;
  const paginatedContacts = contacts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handlers for pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  // Delete handler
  const handleDelete = (email) => {
    const newContacts = contacts.filter((contact) => contact.email !== email);
    setContacts(newContacts);
    // Adjust current page if necessary
    const newTotalPages = Math.max(1, Math.ceil(newContacts.length / rowsPerPage));
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  };

  // Columns
  const columns = ["Name", "Email", "Phone Number", "Services", "Message", "Action"];

  return (
    <div className="contact-wrapper">
      {/* Page heading */}
      <h1 className="contact-page-heading">Contact</h1>

      <div className="contact-section">
        <div className="contact-header-wrapper">
          <h2 className="contact-header">All Contacts</h2>
          <div className="contact-counter">
            {(currentPage - 1) * rowsPerPage + 1} -{" "}
            {Math.min(currentPage * rowsPerPage, totalContacts)} of {totalContacts}
          </div>
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

        {/* Render paginated rows dynamically */}
        {paginatedContacts.map((contact, index) => (
          <div
            className={`contact-row ${index % 2 === 0 ? "alt-row" : ""}`}
            key={contact.email} // Use email as unique key
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
              <button
                className="icon-btn"
                title="Delete"
                onClick={() => handleDelete(contact.email)}
              >
                <img src={deleteIcon} alt="Delete" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        total={totalContacts}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        showRowsPerPage={true}
        showArrows={true}
        className="contact-pagination"
      />
    </div>
  );
}
import React, { useState } from "react";
import "./coordinator-sidebar.scss";
import {
  FaHome,
  FaUserCheck,
  FaUsers,
  FaBuilding,
  FaFileAlt,
  FaBullhorn,
} from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "../buttons/primero-button";
import Modal from "../modals/modal";
import { useNavigate } from "react-router-dom";

// Import the logo image
import logo from "../../assets/logo-ojtsystem.png";
interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="business-name-container">
        {/* Logo added here */}
        <img src={logo} alt="Logo" className="sidebar-logo" />
      </div>
      <div className="sidebar-items-container">
        <button
          className={`sidebar-item ${
            activeItem === "coordinator-dashboard" ? "active" : ""
          }`}
          onClick={() => onItemClick("coordinator-dashboard")}
        >
          <FaHome className="sidebar-icon" />
          Dashboard
        </button>
        <button
          className={`sidebar-item ${
            activeItem === "attendance" ? "active" : ""
          }`}
          onClick={() => onItemClick("attendance")}
        >
          <FaUserCheck className="sidebar-icon" />
          Attendance
        </button>
        <button
          className={`sidebar-item ${
            activeItem === "coordinator-students" ? "active" : ""
          }`}
          onClick={() => onItemClick("coordinator-students")}
        >
          <FaUsers className="sidebar-icon" />
          Student
        </button>
        <button
          className={`sidebar-item ${activeItem === "company" ? "active" : ""}`}
          onClick={() => onItemClick("company")}
        >
          <FaBuilding className="sidebar-icon" />
          Company
        </button>
        <button
          className={`sidebar-item ${activeItem === "report" ? "active" : ""}`}
          onClick={() => onItemClick("report")}
        >
          <FaFileAlt className="sidebar-icon" />
          Report
        </button>
        <button
          className={`sidebar-item ${
            activeItem === "announcement" ? "active" : ""
          }`}
          onClick={() => onItemClick("announcement")}
        >
          <FaBullhorn className="sidebar-icon" />
          Announcement
        </button>
      </div>
      <div className="logout-button-container">
        <PrimaryButton
          buttonText="Logout"
          handleButtonClick={handleLogout}
          icon={<FontAwesomeIcon icon={faSignOutAlt} />}
        />
      </div>

      <Modal
        show={showLogoutModal}
        title=""
        message=""
        onCancel={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        size="small"
      >
        <div className="modal-custom-content">
          <div className="modal-custom-header">
            <div className="header-left">
              <h2 className="main-header">Log Out</h2>
              <h3 className="sub-header">Do you wish to Log Out?</h3>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;

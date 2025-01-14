import React, { useState } from "react";
import "./admin-sidebar.scss";
import {
  FaHome,
  FaUsers,
  FaBriefcase,
  FaUserTie,
  FaUserGraduate,
} from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronDown,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "../buttons/primero-button";
import Modal from "../modals/modal";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo-ojtsystem.png";
interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}
interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userManagementOpen, setUserManagementOpen] = useState(false);
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

  const handleUserManagementClick = () => {
    setUserManagementOpen(!userManagementOpen); // Toggle open state
  };

  return (
    <div className="admin-sidebar">
      <div className="business-name-container">
        {/*logo diri */}
        <img src={logo} alt="Logo" className="sidebar-logo" />
      </div>
      <div className="sidebar-items-container">
        <button
          className={`sidebar-item ${
            activeItem === "overview" ? "active" : ""
          }`}
          onClick={() => onItemClick("overview")}
        >
          <FaHome className="sidebar-icon" />
          Dashboard
        </button>
        <button
          className={`sidebar-item ${userManagementOpen ? "active" : ""}`}
          onClick={handleUserManagementClick}
        >
          <FaUsers className="sidebar-icon" />
          User Management
          <FontAwesomeIcon
            icon={userManagementOpen ? faChevronDown : faChevronRight}
            className="chevron-icon"
          />
        </button>

        {/* Sub-menu for User Management */}
        {userManagementOpen && (
          <div className="sub-menu">
            <button
              className={`sidebar-item ${
                activeItem === "coordinator" ? "active" : ""
              }`}
              onClick={() => onItemClick("coordinator")}
            >
              <FaUserTie className="sidebar-icon" />
              Coordinator
            </button>
            <button
              className={`sidebar-item ${
                activeItem === "students" ? "active" : ""
              }`}
              onClick={() => onItemClick("students")}
            >
              <FaUserGraduate className="sidebar-icon" />
              Students
            </button>
          </div>
        )}

        <button
          className={`sidebar-item ${activeItem === "program" ? "active" : ""}`}
          onClick={() => onItemClick("program")}
        >
          <FaBriefcase className="sidebar-icon" />
          Program
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

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./cd-student.scss";
import SearchBar from "../../../../shared/components/searchbar/searchbar";
import DataTable from "../../../../shared/components/table/data-table";
import { faEdit, faPlus, faEnvelope, faIdCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrimaryButton from "../../../../shared/components/buttons/primero-button";
import Modal from "../../../../shared/components/modals/modal";
import NameInputField from "../../../../shared/components/fields/unif";
import Dropdown from "../../../../shared/components/dropdowns/dropdown";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const CoordinatorStudent = () => {
  const [studentData, setStudentData] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [schoolYearOptions, setSchoolYearOptions] = useState([]);
  const [coordinatorId, setCoordinatorId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [sex, setSex] = useState("");
  const [studentId, setStudentId] = useState("");
  const [program, setProgram] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("Active");
  const [currentModal, setCurrentModal] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  useEffect(() => {
    const storedCoordinatorId = localStorage.getItem("coordinator_id");
    if (storedCoordinatorId) {
      setCoordinatorId(storedCoordinatorId);
    } else {
      alert("Coordinator ID not found. Please log in again.");
      window.location.href = "/login";
    }
  }, []);

  // Fetch data for dropdowns and students
  useEffect(() => {
    const fetchData = async () => {
      if (!coordinatorId) return;

      try {
        const [studentsRes,  companiesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/studentsni", { params: { coordinator_id: coordinatorId } }),
          axios.get("http://localhost:5000/api/companynameni", { params: { coordinator_id: coordinatorId } }),
        ]);

        setStudentData(studentsRes.data);
        setCompanyOptions(companiesRes.data.map((c) => ({ value: c.company_id, label: c.company_name })));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [coordinatorId]);

  const handleAddButtonClick = () => setShowModal(true);

  const handleModalCancel = () => {
    setShowModal(false);
    setCurrentModal(null);
    resetForm();
  };

  const handleModalRegister = () => setCurrentModal("credentials");

  const handleFinalRegistration = async () => {
    try {
      const newStudent = {
        coordinator_id: coordinatorId,
        student_name: name,
        student_address: address,
        student_contact: contact,
        student_sex: sex,
        company_id: company,
        student_status: status,
        student_email: email,
        student_schoolid: studentId,
        student_password: password,
      };

      await axios.post("http://localhost:5000/api/add-student", newStudent);
      setShowModal(false);
      setCurrentModal(null);
      resetForm();

      const updatedStudents = await axios.get("http://localhost:5000/api/studentsni", { params: { coordinator_id: coordinatorId } });
      setStudentData(updatedStudents.data);
    } catch (error) {
      console.error("Error registering student:", error);
    }
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    switch (field) {
      case "name": setName(value); break;
      case "address": setAddress(value); break;
      case "contact": setContact(value); break;
      case "sex": setSex(value); break;
      case "studentId": setStudentId(value); break;
      case "email": setEmail(value); break;
      case "password": setPassword(value); break;
      default: break;
    }
  };

  const resetForm = () => {
    setName("");
    setAddress("");
    setContact("");
    setSex("");
    setStudentId("");
    setCompany("");
    setStatus("Active");
    setEmail("");
    setPassword("");
  };

 const columns = [
    { header: "#", key: "student_id" },
    { header: "Student ID", key: "student_schoolid" },
    {
      header: "Student Info",
      key: "studentInfo",
      render: (row) => (
        <div className="student-info">
          <p><strong>Name:</strong> {row.student_name || "N/A"}</p>
          <p><strong>Address:</strong> {row.student_address || "N/A"}</p>
          <p><strong>Contact #:</strong> {row.student_contact || "N/A"}</p>
          <p><strong>Sex:</strong> {row.student_sex || "N/A"}</p>
        </div>
      ),
    },
    { header: "Company", key: "company_name" },
    { header: "Mentor", key: "company_mentor" },
    { header: "Status", key: "student_status" },
    {
      header: "Action",
      key: "action",
      render: (row) => (
        <div className="action-icons">
          <FontAwesomeIcon
            icon={faEdit}
            className="edit-icon"
            onClick={() => console.log("Edit student record with ID:", row.student_id)}
          />
        </div>
      ),
    },
  ];


  return (
    <div className="dashboard-page">
      <h1 className="page-title">Student</h1>
      <h2 className="page-subtitle">Manage Student Attendance</h2>
  
      <div className="controls-container">
        <div className="search-bar-container">
          <SearchBar
            placeholder="Search"
            onSearch={(query) => console.log(query)}
          />
        </div>
        <div className="add-button-container">
          <PrimaryButton
            buttonText="Add Student"
            handleButtonClick={handleAddButtonClick}
            icon={<FontAwesomeIcon icon={faPlus} />}
          />
        </div>
      </div>
  
      <DataTable columns={columns} data={studentData} />
  
      {/* Modals */}
      {/* Registration Modal */}
      <Modal
        show={showModal && currentModal !== "credentials"}
        title=""
        message=""
        onCancel={handleModalCancel}
        onConfirm={handleModalRegister}
        size="large"
        cancelButtonText="Cancel"
        confirmButtonText="Next"
      >
        <div className="modal-custom-content">
          <div className="modal-custom-header-student">
            <div className="header-left">
              <h2 className="main-header">Register New Student</h2>
              <h3 className="sub-header">Student Details</h3>
            </div>
          </div>
          <div className="modalbody">
            <div className="left">
              {/* Name Field */}
              <label htmlFor="name">Name</label>
              <NameInputField
                type="text"
                id="name"
                value={name}
                onChange={(e) => handleInputChange(e, "name")}
              />
  
              {/* Address Field */}
              <label htmlFor="address">Address</label>
              <NameInputField
                type="text"
                id="address"
                value={address}
                onChange={(e) => handleInputChange(e, "address")}
              />
  
              {/* Contact Number Field */}
              <label htmlFor="contact">Contact#</label>
              <NameInputField
                type="text"
                id="contact"
                value={contact}
                onChange={(e) => handleInputChange(e, "contact")}
              />

            </div>
  
            {/* Right Side */}
            <div className="right">
              <div className="left-component">
                <div className="dropdowns">
              {/* Sex Dropdown */}
              <label htmlFor="sex">Sex</label>
              <Dropdown
                options={["Male", "Female", "Other"]}
                value={sex}
                onChange={(value) => setSex(value)}
              />
  
                  {/* Company Dropdown */}
                  <label htmlFor="company">Company</label>
                  <Dropdown
                    options={companyOptions.map((c) => c.label)}
                    value={companyOptions.find((c) => c.value === company)?.label || ""}
                    onChange={(selectedLabel) =>
                      setCompany(companyOptions.find((c) => c.label === selectedLabel)?.value || "")
                    }
                  /> 
                  {/* Status Dropdown */}
                  <label htmlFor="status">Status</label>
                  <Dropdown
                    options={["Active", "Inactive"]}
                    value={status}
                    onChange={(value) => setStatus(value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
  
      {/* Credentials Modal */}
      <Modal
        show={showModal && currentModal === "credentials"}
        title=""
        message=""
        onCancel={() => setCurrentModal(null)}
        onConfirm={handleFinalRegistration}
        size="medium2"
        cancelButtonText="Back"
        confirmButtonText="Register"
      >
        <div className="modal-custom-content">
          <div className="modal-custom-header-admin-coordinator">
            <div className="header-left">
              <h2 className="main-header">Register New Student</h2>
              <h3 className="sub-header">Credentials</h3>
            </div>
          </div>
          <div className="credentials-modal-container">
            <div className="credentials-modal-body">
              <div className="name-input-field">
                <label htmlFor="email">Email</label>
                <div className="name-input-field-wrapper">
                  <NameInputField
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => handleInputChange(e, "email")}
                  />
                  <FontAwesomeIcon icon={faEnvelope} className="icon" />
                </div>
              </div>
              <div className="name-input-field">
                <label htmlFor="schoolId">School Id</label>
                <div className="name-input-field-wrapper">
                  <NameInputField
                    type="text"
                    id="schoolId"
                    value={studentId}
                    onChange={(e) => handleInputChange(e, "studentId")}
                  />
                  <FontAwesomeIcon icon={faIdCard} className="icon" />
                </div>
              </div>
              <div className="name-input-field">
                <label htmlFor="password">Password</label>
                <div className="name-input-field-wrapper">
                  <NameInputField
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => handleInputChange(e, "password")}
                  />
                  <FaLock className="icon" />
                  <div className="password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CoordinatorStudent;

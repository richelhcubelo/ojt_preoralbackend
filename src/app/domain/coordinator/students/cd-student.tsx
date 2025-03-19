import React, { useState, useEffect } from "react";
import axios from "axios";
import "./cd-student.scss";
import SearchBar from "../../../../shared/components/searchbar/searchbar";
import DataTable from "../../../../shared/components/table/data-table";
import {
  faEdit,
  faPlus,
  faEnvelope,
  faIdCard,
  faUserCircle,
  faMapLocation,
  faPhone,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrimaryButton from "../../../../shared/components/buttons/primero-button";
import Modal from "../../../../shared/components/modals/modal";
import NameInputField from "../../../../shared/components/fields/unif";
import Dropdown from "../../../../shared/components/dropdowns/dropdown";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import config from "../../../../config";
const CoordinatorStudent = () => {
  const [studentData, setStudentData] = useState([]);
  const [filteredStudentData, setFilteredStudentData] = useState([]);
  const [companyOptions, setCompanyOptions] = useState<{ value: string; label: string }[]>([]);
  const [coordinatorId, setCoordinatorId] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [sex, setSex] = useState("");
  const [studentId, setStudentId] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("Active");
  const [currentModal, setCurrentModal] = useState<null | "credentials">(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null); // New state for selected student

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

  useEffect(() => {
    const fetchData = async () => {
      if (!coordinatorId) return;

      try {
        const [studentsRes, companiesRes] = await Promise.all([
          axios.get(`${config.API_BASE_URL}/api/studentsni`, {
            params: { coordinator_id: coordinatorId },
          }),
          axios.get(`${config.API_BASE_URL}/api/companynameni`, {
            params: { coordinator_id: coordinatorId },
          }),
        ]);

        setStudentData(studentsRes.data);
        setFilteredStudentData(studentsRes.data);
        setCompanyOptions(
          companiesRes.data.map((c: { company_id: string; company_name: string }) => ({
            value: c.company_id,
            label: c.company_name,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [coordinatorId]);

  useEffect(() => {
    if (searchQuery) {
      const filteredData = studentData.filter((student: any) =>
        student.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.student_schoolid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.student_email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudentData(filteredData);
    } else {
      setFilteredStudentData(studentData);
    }
  }, [searchQuery, studentData]);

  const handleAddButtonClick = () => {
    setSelectedStudent(null); // Reset selected student when adding a new one
    setShowModal(true);
  };

  const handleEditButtonClick = (student: any) => {
    setSelectedStudent(student);
    setName(student.student_name);
    setAddress(student.student_address);
    setContact(student.student_contact);
    setSex(student.student_sex);
    setStudentId(student.student_schoolid);
    setCompany(student.company_id);
    setStatus(student.student_status);
    setEmail(student.student_email);
    setPassword(student.student_password); // Assuming you have a password field
    setShowModal(true);
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setCurrentModal(null);
    resetForm();
  };

  const validateForm = () => {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!nameRegex.test(name)) {
      setErrorMessage("Fullname contains invalid characters");
      return false;
    }

    const contactRegex = /^\d{11}$/;
    if (!contactRegex.test(contact)) {
      setErrorMessage("Contact number must be 11 digits");
      return false;
    }

    const addressRegex = /^[a-zA-Z0-9\s.,-]+$/;
    if (!addressRegex.test(address)) {
      setErrorMessage("Address contains invalid characters");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format");
      return false;
    }

    const schoolIdRegex = /^\d+$/;
    if (!schoolIdRegex.test(studentId)) {
      setErrorMessage("School ID must be numbers only");
      return false;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      return false;
    }

    return true;
  };

  const handleFinalRegistration = async () => {
    if (!validateForm()) {
      setIsErrorModalOpen(true);
      return;
    }
  
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
  
      if (selectedStudent) {
        // Update existing student
        await axios.put(
          `${config.API_BASE_URL}/api/add-student/${selectedStudent.student_id}`,
          newStudent
        );
      } else {
        // Create new student
        await axios.post(`${config.API_BASE_URL}/api/add-student`, newStudent);
      }
  
      // Clear the form and close the modal
      resetForm();
      setShowModal(false);
  
      // Refresh the student data
      const updatedStudents = await axios.get(
        `${config.API_BASE_URL}/api/studentsni`,
        { params: { coordinator_id: coordinatorId } }
      );
      setStudentData(updatedStudents.data);
      setFilteredStudentData(updatedStudents.data);
    } catch (error) {
      console.error("Error registering student:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage(error.response?.data.message || "Registration failed. Please try again.");
        }
      } else {
        setErrorMessage("An unexpected error occurred");
      }
      setIsErrorModalOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    const value = e.target.value;
    switch (field) {
      case "name":
        setName(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "contact":
        setContact(value);
        break;
      case "sex":
        setSex(value);
        break;
      case "studentId":
        setStudentId(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
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
    setSelectedStudent(null); // Clear the selected student
  };

  const columns = [
    { header: "#", key: "student_id" },
    { header: "Student ID", key: "student_schoolid" },
    {
      header: "Student Info",
      key: "studentInfo",
      render: (row: any) => (
        <div className="student-info">
          <p>
            <strong>Name:</strong> {row.student_name || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {row.student_address || "N/A"}
          </p>
          <p>
            <strong>Contact #:</strong> {row.student_contact || "N/A"}
          </p>
          <p>
            <strong>Sex:</strong> {row.student_sex || "N/A"}
          </p>
        </div>
      ),
    },
    { header: "Company", key: "company_name" },
    { header: "Email", key: "student_email" },
    { header: "Status", key: "student_status" },
    {
      header: "Action",
      key: "action",
      render: (row: any) => (
        <div className="action-icons">
          <FontAwesomeIcon
            icon={faEdit}
            className="edit-icon"
            onClick={() => handleEditButtonClick(row)}
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
            onSearch={(query) => setSearchQuery(query)}
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

      <DataTable columns={columns} data={filteredStudentData} />

      <Modal
          show={showModal && currentModal !== "credentials"}
          title=""
          message=""
          onCancel={handleModalCancel}
          onConfirm={handleFinalRegistration}
          size="coordinatorlarge"
          cancelButtonText="Cancel"
          confirmButtonText={selectedStudent ? "Update" : "Save"}
        >
        <div className="modal-custom-content">
          <div className="modal-custom-header-student">
            <div className="header-left">
              <h2 className="main-header">{selectedStudent ? "Edit Student" : "Register New Student"}</h2>
              <h3 className="sub-header">Student Details</h3>
            </div>
          </div>
          <div className="modalbody">
            <div className="leftside">
              <div className="full-Name">
                <label htmlFor="name">Fullname</label>
                <NameInputField
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => handleInputChange(e, "name")}
                />
                <FontAwesomeIcon icon={faUserCircle} className="icon" />
              </div>
              <div className="full-Name">
                <label htmlFor="address">Address</label>
                <NameInputField
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => handleInputChange(e, "address")}
                />
                <FontAwesomeIcon icon={faMapLocation} className="icon" />
              </div>
              <div className="full-Name">
                <label htmlFor="contact">Contact#</label>
                <NameInputField
                  type="text"
                  id="contact"
                  value={contact}
                  onChange={(e) => handleInputChange(e, "contact")}
                />
                <FontAwesomeIcon icon={faPhone} className="icon" />
              </div>
            </div>

            <div className="right">
              <div className="left-dropdowns">
                <div className="sex-dropdown">
                  <label htmlFor="sex">Sex</label>
                  <Dropdown
                    options={["Male", "Female", "Other"]}
                    value={sex}
                    onChange={(value) => setSex(value)}
                  />
                </div>
                <div className="company-dropdown">
                  <label htmlFor="company">Company</label>
                  <Dropdown
                    options={companyOptions.map((c) => c.label)}
                    value={
                      companyOptions.find((c) => c.value === company)?.label ||
                      ""
                    }
                    onChange={(selectedLabel) =>
                      setCompany(
                        companyOptions.find((c) => c.label === selectedLabel)
                          ?.value || ""
                      )
                    }
                  />
                </div>
                <div className="status-dropdown">
                  <label htmlFor="status">Status</label>
                  <Dropdown
                    options={["Active", "Inactive"]}
                    value={status}
                    onChange={(value) => setStatus(value)}
                  />
                </div>
              </div>
            </div>

            <div className="third-column">
              <div className="name-input-field">
                <label htmlFor="email">Email</label>
                <div className="name-input-field-wrapper">
                  <NameInputField
                    type="email"
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
                  <div
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
          show={isErrorModalOpen}
          title="Error"
          message={errorMessage}
          onCancel={() => setIsErrorModalOpen(false)}
          size="small"
          singleButton={true}
        >
          <div className="modal-custom-content">
            <div className="modal-custom-header">
              <div className="header-left">
                <h2 className="main-header">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="error-icon"
                  />
                  Error
                </h2>
                <h3 className="sub-header">{errorMessage}</h3>
              </div>
            </div>
          </div>
        </Modal>
    </div>
  );
};

export default CoordinatorStudent;
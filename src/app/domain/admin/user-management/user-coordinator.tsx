import React, { useState, useEffect } from "react";
import "./user-coordinator.scss";
import {
  faEnvelope,
  faIdCard,
  faExclamationTriangle,
  faUser,
  faUserCircle,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../../../../shared/components/searchbar/searchbar"; // Adjust the path as needed
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrimaryButton from "../../../../shared/components/buttons/primero-button";
import DataTable from "../../../../shared/components/table/data-table";
import Modal from "../../../../shared/components/modals/modal";
import {  FaLock, FaEye, FaEyeSlash, FaEdit } from "react-icons/fa";
import NameInputField from "../../../../shared/components/fields/unif";
import Dropdown from "../../../../shared/components/dropdowns/dropdown";
import axios from "axios";
import config from "../../../../config";

const Coordinator: React.FC = () => {
  const [programOptions, setProgramOptions] = useState<{ value: string | number; label: string }[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentModal, setCurrentModal] = useState<string>("details");
  const [firstName, setFirstName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [sex, setSex] = useState("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [coordinators, setCoordinators] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [program, setProgram] = useState<string | number>(""); // Allow both types
  const [isEdit, setIsEdit] = useState<boolean>(false); // New state to check edit mode
  const [currentCoordinatorId, setCurrentCoordinatorId] = useState<
    number | null
  >(null); // To store the coordinator ID

  // Fetch coordinator data from the database
  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const response = await axios.get(
          `${config.API_BASE_URL}/api/coordinators`
        );
        setCoordinators(response.data); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching coordinators:", error);
      }
    };
    fetchCoordinators();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [programsRes] = await Promise.all([
          axios.get(`${config.API_BASE_URL}/api/programname`),
        ]);
        setProgramOptions(
          programsRes.data.map((p: { program_id: string | number; program_name: string }) => ({
            value: p.program_id,
            label: p.program_name,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredCoordinators = coordinators.filter((coordinator) => {
    return (
      coordinator.coordinator_firstname
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      coordinator.coordinator_midname
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      coordinator.coordinator_lastname
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      coordinator.coordinator_email
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  const handleAddButtonClick = () => {
    openModal();
    setCurrentModal("details");
  };

  const handleModalCancel = () => {
    if (currentModal === "confirmation") {
      setCurrentModal("credentials");
    } else if (currentModal === "credentials") {
      setCurrentModal("details");
    } else {
      closeModal();
    }
  };

// Coordinator.tsx
const handleModalSave = async () => {
  // Existing validations
  if (!firstName || !lastName || !contact || !email || !username || !password) {
    setErrorMessage("Please fill in all required fields.");
    setIsErrorModalOpen(true);
    return;
  }

  if (contact.length !== 11) {
    setErrorMessage("Contact number must be exactly 11 digits.");
    setIsErrorModalOpen(true);
    return;
  }

  // New duplicate check
  try {
    const checkResponse = await axios.post(
      `${config.API_BASE_URL}/api/add-coordinator/check-duplicates`,
      {
        coordinator_contact: contact,
        coordinator_email: email,
        coordinator_user: username
      }
    );

    const { duplicates } = checkResponse.data;
    const errors = [];
    if (duplicates.contact) errors.push("Contact Number");
    if (duplicates.email) errors.push("Email");
    if (duplicates.username) errors.push("Username");

    if (errors.length > 0) {
      setErrorMessage(`${errors.join(", ")} already exist.`);
      setIsErrorModalOpen(true);
      return;
    }
  } catch (error) {
    console.error("Duplicate check failed:", error);
    setErrorMessage("Error checking for duplicates. Please try again.");
    setIsErrorModalOpen(true);
    return;
  }

  // Proceed to confirmation if no duplicates
  setCurrentModal("confirmation");
};

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value;

    switch (field) {
      case "firstName":
        // Validate first name (only letters and spaces allowed)
        if (/^[a-zA-Z\s]*$/.test(value)) {
          setFirstName(value);
        }
        break;

      case "middleName":
        // Validate middle name (only letters and spaces allowed)
        if (/^[a-zA-Z\s]*$/.test(value)) {
          setMiddleName(value);
        }
        break;

      case "lastName":
        // Validate last name (only letters and spaces allowed)
        if (/^[a-zA-Z\s]*$/.test(value)) {
          setLastName(value);
        }
        break;

      case "contact":
        // Validate contact number (only digits allowed, max 11 digits)
        if (/^\d*$/.test(value) && value.length <= 11) {
          setContact(value);
        }
        break;

      case "email":
        setEmail(value); // Allow any input, validation happens on save
        break;

      case "username":
        // Validate username (only alphanumeric and underscore allowed)
        if (/^[a-zA-Z0-9_]*$/.test(value)) {
          setUsername(value);
        }
        break;

      case "password":
        // Validate password (alphanumeric and some special characters allowed)
        if (/^[a-zA-Z0-9!@#$%^&*()]*$/.test(value)) {
          setPassword(value);
        }
        break;

      default:
        break;
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const resetForm = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setContact("");
    setProgram("");
    setSex("");
    setEmail("");
    setUsername("");
    setPassword("");
  };

  const handleConfirmSave = async () => {
    if (
      !firstName ||
      !middleName ||
      !lastName ||
      !email ||
      !username ||
      !password ||
      !contact
    ) {
      setErrorMessage("All fields are required.");
      setIsErrorModalOpen(true);
      return;
    }
  
    const coordinatorData = {
      admin_id: localStorage.getItem("admin_id"),
      coordinator_firstname: firstName,
      coordinator_midname: middleName,
      coordinator_lastname: lastName,
      coordinator_contact: contact,
      coordinator_sex: sex,
      program_id: program,
      coordinator_email: email,
      coordinator_user: username,
      coordinator_pass: password,
    };
  
    console.log("Saving Coordinator Data:", coordinatorData); // Debugging
  
    try {
      const token = localStorage.getItem("token");
  
      if (isEdit && currentCoordinatorId) {
        const response = await axios.put(
          `${config.API_BASE_URL}/api/update-coordinator/${currentCoordinatorId}`,
          coordinatorData,
          {
            headers: { Authorization: token },
          }
        );
        console.log("Update Response:", response.data); // Debugging
      } else {
        const response = await axios.post(
          `${config.API_BASE_URL}/api/add-coordinator`,
          coordinatorData,
          {
            headers: { Authorization: token },
          }
        );
        console.log("Add Response:", response.data); // Debugging
      }
  
      const fetchResponse = await axios.get(`${config.API_BASE_URL}/api/coordinators`);
      setCoordinators(fetchResponse.data);
  
      resetForm();
      setShowModal(false); // Close the modal after successful save
      setIsEdit(false);
      setCurrentCoordinatorId(null);
    } catch (error: any) {
      console.error(
        "Error saving coordinator:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to save coordinator. Please try again."
      );
      setIsErrorModalOpen(true);
    }
  };

  const handleEdit = async (id: number) => {
    const selectedCoordinator = coordinators.find(
      (coordinator) => coordinator.coordinator_id === id
    );

    if (selectedCoordinator) {
      setIsEdit(true);
      setCurrentCoordinatorId(id);
      setFirstName(selectedCoordinator.coordinator_firstname);
      setMiddleName(selectedCoordinator.coordinator_midname);
      setLastName(selectedCoordinator.coordinator_lastname);
      setContact(selectedCoordinator.coordinator_contact);
      setSex(selectedCoordinator.coordinator_sex);
      setEmail(selectedCoordinator.coordinator_email);
      setUsername(selectedCoordinator.coordinator_user);
      setPassword(selectedCoordinator.coordinator_pass);

      // Set the program_name and program_id
      setProgram(selectedCoordinator.program_name);

      // If the program name is not already populated, fetch the program data
      if (!selectedCoordinator.program_name) {
        try {
          const response = await axios.get(
            `${config.API_BASE_URL}/api/programname`
          );
          const programs = response.data;
          const matchingProgram = programs.find(
            (program: any) =>
              program.program_id === selectedCoordinator.program_id
          );

          if (matchingProgram) {
            setProgram(matchingProgram.program_name); // Set the correct program_name
          }
        } catch (error) {
          console.error("Error fetching program name:", error);
        }
      }

      setShowModal(true);
      setCurrentModal("details");
    }
  };

  return (
    <div className="dashboard-page">
      <h1 className="page-title">User Management</h1>
      <h2 className="page-subtitle">Manage Coordinator</h2>

      <div className="controls-container">
        <div className="search-bar-container">
          <SearchBar placeholder="Search" onSearch={handleSearch} />
        </div>

        <div className="add-button-container">
          <PrimaryButton
            buttonText="Add Coordinator"
            handleButtonClick={handleAddButtonClick}
            icon={<FontAwesomeIcon icon={faPlus} />}
          />
        </div>
      </div>

      <DataTable
        columns={[
          { header: "ID", key: "coordinator_id" },
          { header: "First Name", key: "coordinator_firstname" },
          { header: "Middle Name", key: "coordinator_midname" },
          { header: "Last Name", key: "coordinator_lastname" },
          { header: "Contact Number", key: "coordinator_contact" },
          { header: "Gender", key: "coordinator_sex" },
          { header: "Program", key: "program_name" },
          { header: "Email", key: "coordinator_email" },
          //{ header: "Username", key: "coordinator_user" },
          // { header: "Password", key: "coordinator_pass" },

          {
            header: "Action",
            key: "action",
            render: (row) => (
              <button
                onClick={() => handleEdit(row.coordinator_id)}
                className="edit-button"
              >
                <FaEdit />
              </button>
            ),
          },
        ]}
        data={filteredCoordinators}
      />

        <Modal
          show={showModal && currentModal === "details"}
          title=""
          message=""
          onCancel={handleModalCancel}
          onConfirm={handleModalSave}
          size="coordinatorlarge"
          cancelButtonText="Cancel"
          confirmButtonText={isEdit ? "Update" : "Save"} // Dynamic button text
        >
        <div className="modal-custom-content">
          <div className="modal-custom-header-admin-coordinator">
            <div className="header-left">
                  <h2 className="main-header">
                  {isEdit ? "Edit Coordinator" : "Register New Coordinator"}
                  </h2>
                  <h3 className="sub-header">Coordinator Details</h3>
            </div>
          </div>
          <div className="modal-body">
            <div className="modal-body-left">
              <div className="full-name">
                <label htmlFor="firstName">Firstname</label>
                <NameInputField
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => handleInputChange(e, "firstName")}
                />
                <FontAwesomeIcon icon={faUser} className="icon" />
              </div>
              <div className="full-name">
                <label htmlFor="middleName">Middlename</label>
                <NameInputField
                  type="text"
                  id="middleName"
                  value={middleName}
                  onChange={(e) => handleInputChange(e, "middleName")}
                />
                <FontAwesomeIcon icon={faUserCircle} className="icon" />
              </div>

              <div className="full-name">
                <label htmlFor="lastName">Lastname </label>
                <NameInputField
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => handleInputChange(e, "lastName")}
                />
                <FontAwesomeIcon icon={faUser} className="icon" />
              </div>
            </div>

            <div className="modal-body-right">
              <div className="call">
                <div className="contactnumber">
                  <label htmlFor="contact">Contact Number</label>
                  <NameInputField
                    type="text"
                    id="contact"
                    value={contact}
                    className="contactnumber"
                    onChange={(e) => handleInputChange(e, "contact")}
                  />
                  <FontAwesomeIcon icon={faPhone} className="icon" />
                </div>
              </div>

              <div className="gender-dropdown">
                <label htmlFor="gender">Gender</label>
                <Dropdown
                  options={["Male", "Female"]}
                  value={sex}
                  onChange={(value) => setSex(value)}
                />
              </div>

              <div className="dropdowns">
                <label htmlFor="program">Program</label>
                <Dropdown
                  options={programOptions.map((p) => p.label)}
                  value={program ? String(program) : ""} // Ensure the value is a string
                  onChange={(selectedLabel) => {
                    const selectedProgram = programOptions.find(
                      (p) => p.label === selectedLabel
                    );
                    setProgram(selectedProgram ? selectedProgram.value : ""); // Set the program_id when a program is selected
                  }}
                />
              </div>
            </div>

            <div className="modal-body-third-column">
              <div className="email-user-pass">
                <div className="email">
                  <label htmlFor="email">Email</label>
                  <div className="para-icon">
                    <NameInputField
                      type="text"
                      id="email"
                      value={email}
                      onChange={(e) => handleInputChange(e, "email")}
                    />
                    <FontAwesomeIcon icon={faEnvelope} className="icon" />
                  </div>
                </div>
              </div>
              <div className="email-user-pass">
                <div className="username">
                  <label htmlFor="username">Username</label>
                  <NameInputField
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => handleInputChange(e, "username")}
                  />
                  <FontAwesomeIcon icon={faIdCard} className="icon" />
                </div>
              </div>
              <div className="email-user-pass">
                <div className="password">
                  <label htmlFor="password">Password</label>
                  <NameInputField
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => handleInputChange(e, "password")}
                  />
                  <FaLock className="icon" />
                  <div
                    className="password-togglee"
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
        show={currentModal === "confirmation"}
        title="Confirmation"
        message=""
        onCancel={handleModalCancel}
        onConfirm={handleConfirmSave}
        size="smallmed"
        cancelButtonText="Cancel"
        confirmButtonText={isEdit ? "Update" : "Confirm"}
      >
        <div className="modal-custom-content">
          <div className="modal-custom-header">
            <div className="header-left">
              <h2 className="main-header">
                {isEdit ? "Update Coordinator" : "Add New Coordinator"}
              </h2>
              <h3 className="sub-header">
                {isEdit
                  ? "Are you sure you want to update this coordinator?"
                  : "Are you sure you want to add this coordinator?"}
              </h3>
            </div>
          </div>
          <div className="modal-custom-body">
            <p>The username and password will be sent through this email:</p>
            <strong>{email}</strong>
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
      {/*<Modal
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
              <h3 className="sub-header">
                Ensure all required fields are filled out.
              </h3>
            </div>
          </div>
        </div>
      </Modal>*/}
    </div>
  );
};

export default Coordinator;

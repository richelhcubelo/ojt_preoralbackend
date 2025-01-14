import React, { useState, useEffect } from "react";
import "./user-coordinator.scss";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../../../../shared/components/searchbar/searchbar"; // Adjust the path as needed
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrimaryButton from "../../../../shared/components/buttons/primero-button";
import DataTable from "../../../../shared/components/table/data-table";
import Modal from "../../../../shared/components/modals/modal";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEdit } from "react-icons/fa";
import NameInputField from "../../../../shared/components/fields/unif";
import Dropdown from "../../../../shared/components/dropdowns/dropdown";
import axios from "axios";

const Coordinator: React.FC = () => {
  const [programOptions, setProgramOptions] = useState([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentModal, setCurrentModal] = useState<string>("details");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [program, setProgram] = useState("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [coordinators, setCoordinators] = useState<any[]>([]);
  const [currentCoordinatorId, setCurrentCoordinatorId] = useState<
    number | null
  >(null);

  // Fetch coordinator data from the database
  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/coordinators"
        );
        setCoordinators(response.data); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching coordinators:", error);
      }
    };
    fetchCoordinators();
  }, []);

  // Fetch program names
  useEffect(() => {
    const fetchData = async () => {
      try {
        const programsRes = await axios.get(
          "http://localhost:5000/api/programname"
        );
        setProgramOptions(
          programsRes.data.map((p) => ({
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
    setCurrentCoordinatorId(null); // Reset current coordinator ID
  };

  const handleAddButtonClick = () => {
    openModal();
    setCurrentModal("details");
    resetForm(); // Reset form for new entry
  };

  const handleEditButtonClick = (id: number) => {
    openModal();
    setCurrentModal("details");

    // Fetch the current coordinator data
    const coordinatorToEdit = coordinators.find(
      (coordinator) => coordinator.coordinator_id === id
    );

    if (coordinatorToEdit) {
      setCurrentCoordinatorId(id);
      setFirstName(coordinatorToEdit.coordinator_firstname);
      setLastName(coordinatorToEdit.coordinator_lastname);
      setContact(coordinatorToEdit.coordinator_contact);
      setEmail(coordinatorToEdit.coordinator_email);
      setUsername(coordinatorToEdit.coordinator_user);
      setProgram(coordinatorToEdit.program_id); // Assuming program_id is available in data
      // Password can be left blank for security reasons; handle it separately if needed
    }
  };

  const handleModalCancel = () => {
    closeModal();
  };

  const handleModalSave = async () => {
    if (!firstName || !lastName || !contact || !email || !username) {
      setErrorMessage("Please fill in all required fields.");
      setIsErrorModalOpen(true);
      return;
    }

    if (currentCoordinatorId) {
      // Update existing coordinator
      try {
        await axios.put(
          `http://localhost:5000/api/update-coordinator/${currentCoordinatorId}`,
          {
            coordinator_firstname: firstName,
            coordinator_lastname: lastName,
            coordinator_contact: contact,
            program_id: program,
            coordinator_email: email,
            coordinator_user: username,
            // Include password only if it's being updated or required
          }
        );

        // Refresh the list of coordinators after update
        const response = await axios.get(
          "http://localhost:5000/api/coordinators"
        );
        setCoordinators(response.data);

        closeModal();
      } catch (error) {
        console.error("Error updating coordinator:", error);
        setErrorMessage("Failed to update coordinator. Please try again.");
        setIsErrorModalOpen(true);
      }
    } else {
      // Add new coordinator
      try {
        await axios.post("http://localhost:5000/api/add-coordinator", {
          admin_id: localStorage.getItem("admin_id"),
          coordinator_firstname: firstName,
          coordinator_lastname: lastName,
          coordinator_contact: contact,
          program_id: program,
          coordinator_email: email,
          coordinator_user: username,
          coordinator_pass: password,
        });

        // Refresh the list of coordinators after addition
        const response = await axios.get(
          "http://localhost:5000/api/coordinators"
        );
        setCoordinators(response.data);

        closeModal();
      } catch (error) {
        console.error("Error saving coordinator:", error);
        setErrorMessage("Failed to save coordinator. Please try again.");
        setIsErrorModalOpen(true);
      }
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setContact("");
    setProgram("");
    setEmail("");
    setUsername("");
    setPassword(""); // Reset password only for new entry
  };

  return (
    <div className="dashboard-page">
      <h1 className="page-title">User Management</h1>
      <h2 className="page-subtitle">Manage Coordinator</h2>

      <div className="controls-container">
        <div className="search-bar-container">
          <SearchBar
            placeholder="Search"
            onSearch={(query) => console.log("Search query:", query)}
          />
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
          { header: "Last Name", key: "coordinator_lastname" },
          { header: "Contact Number", key: "coordinator_contact" },
          { header: "Program", key: "program_name" },
          { header: "Email", key: "coordinator_email" },
          { header: "Username", key: "coordinator_user" },
          {
            header: "Action",
            key: "action",
            render: (row) => (
              <button
                onClick={() => handleEditButtonClick(row.coordinator_id)}
                className="edit-button"
              >
                <FaEdit />
              </button>
            ),
          },
        ]}
        data={coordinators}
      />

      {/* Modal for Coordinator Details */}
      <Modal
        show={showModal && currentModal === "details"}
        title=""
        message=""
        onCancel={handleModalCancel}
        onConfirm={handleModalSave}
        size="large"
        cancelButtonText="Cancel"
        confirmButtonText={currentCoordinatorId ? "Update" : "Next"}
      >
        <div className="modal-custom-content">
          <div className="modal-custom-header-admin-coordinator">
            <div className="header-left">
              <h2 className="main-header">
                {currentCoordinatorId
                  ? "Update Coordinator"
                  : "Register New Coordinator"}
              </h2>
              <h3 className="sub-header">Coordinator Details</h3>
            </div>
          </div>

          <div className="modal-body">
            <div className="modal-body-left">
              <label htmlFor="firstName">First Name</label>
              <NameInputField
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
              />

              <label htmlFor="lastName">Last Name</label>
              <NameInputField
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => handleInputChange(e, "lastName")}
              />
            </div>

            <div className="modal-body-right">
              <div className="left-components">
                <label htmlFor="contact">Contact</label>
                <NameInputField
                  type="text"
                  id="contact"
                  value={contact}
                  className="contactnum"
                  onChange={(e) => handleInputChange(e, "contact")}
                />
              </div>

              <div className="dropdowns">
                <label htmlFor="program">Program</label>
                <Dropdown
                  options={programOptions.map((p) => p.label)}
                  value={
                    programOptions.find((p) => p.value === program)?.label || ""
                  }
                  onChange={(selectedLabel) =>
                    setProgram(
                      programOptions.find((p) => p.label === selectedLabel)
                        ?.value || ""
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal for Credentials */}
      {/* Other modals can be added similarly */}

      {/* Error Modal */}
      {/* Uncomment and implement as needed */}
    </div>
  );
};

export default Coordinator;

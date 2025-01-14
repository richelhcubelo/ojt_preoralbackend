import React, { useState, useEffect } from "react";
import "./admin-program.scss";
import SearchBar from "../../../../shared/components/searchbar/searchbar";
import PrimaryButton from "../../../../shared/components/buttons/primero-button";
import DataTable from "../../../../shared/components/table/data-table";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../../../shared/components/modals/modal";
import NameInputField from "../../../../shared/components/fields/unif";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Program: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showYModal, setShowYModal] = useState(false);
  const [program, setProgram] = useState("");
  const [schoolyear, setSchoolyear] = useState("");
  const [description, setDescription] = useState("");
  const [requiredDuration, setRequiredDuration] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    // Fetch existing programs from the server
    const fetchPrograms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/programs");
        setPrograms(response.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };
    fetchPrograms();
  }, []);

  // Open Add Program Modal
  const handleAddButtonClick = () => {
    setShowModal(true);
  };

  // Open Add School Year Modal
  const handleAddYearButtonClick = () => {
    setShowYModal(true);
  };

  // Save school year
  const handleYearModalSave = async () => {
    const adminId = localStorage.getItem("admin_id");
  
    if (!schoolyear) {
      setErrorMessage("School year is required.");
      setIsErrorModalOpen(true);
      return;
    }
  
    const newSchoolYear = {
      admin_id: adminId,
      school_yr: schoolyear,
    };
  
    try {
      const response = await axios.post("http://localhost:5000/api/add-schoolyear", newSchoolYear);
      setSchoolyear("");
      setShowYModal(false); // Close modal after saving
    } catch (error: any) {
      console.error("Error saving school year:", error.response?.data || error.message);
      setErrorMessage("Failed to save school year. Please try again.");
      setIsErrorModalOpen(true);
    }
  };

  // Save program
  const handleModalSave = async () => {
    if (!program || !description || !requiredDuration) {
      setErrorMessage("Please fill in all required fields.");
      setIsErrorModalOpen(true);
    } else {
      confirmAddProgram();
    }
  };

  const confirmAddProgram = async () => {
    const adminId = localStorage.getItem("admin_id");
    if (!adminId) {
      setErrorMessage("Admin ID not found.");
      setIsErrorModalOpen(true);
      return;
    }

    const newProgram = {
      admin_id: adminId,
      program_name: program,
      program_description: description,
      program_hours: requiredDuration,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/add-program", newProgram);

      // Add new program to the state and close modal
      setPrograms([...programs, response.data]);
      setShowModal(false); // Close modal after saving
    } catch (error: any) {
      console.error("Error saving program:", error.response?.data || error.message);
      setErrorMessage("Failed to save program. Please try again.");
      setIsErrorModalOpen(true);
    }
  };

  // Handle input changes for both program and school year modals
  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    field: string
  ) => {
    if (field === "program") {
      setProgram(e.target.value);
    } else if (field === "description") {
      setDescription(e.target.value);
    } else if (field === "requiredDuration") {
      setRequiredDuration(e.target.value);
    } else if (field === "schoolyear") {
      setSchoolyear(e.target.value);
    }
  };

  // Close modals and reset state
  const handleModalCancel = () => {
    setShowModal(false);
    setShowYModal(false);
    setProgram("");
    setDescription("");
    setRequiredDuration("");
    setSchoolyear("");
  };

  const columns = [
    { header: "ID", key: "program_id" },
    { header: "Program", key: "program_name" },
    { header: "Description", key: "program_description" },
    { header: "Required Duration", key: "program_hours" },
    {
      header: "Action",
      key: "action",
      render: (row: any) => (
        <div className="action-icons">
          <FontAwesomeIcon icon={faEdit} className="edit-icon" />
        </div>
      ),
    },
  ];

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Program</h1>
      <h2 className="page-subtitle">Manage Academic Program</h2>

      <div className="controls-container">
        <div className="search-bar-container">
          <SearchBar
            placeholder="Search"
            onSearch={(query) => console.log(query)}
          />
        </div>

        <div className="add-button-container">
          <PrimaryButton
            buttonText="Add School Year"
            handleButtonClick={handleAddYearButtonClick}
            icon={<FontAwesomeIcon icon={faPlus} />}
          />
          <PrimaryButton
            buttonText="Add Program"
            handleButtonClick={handleAddButtonClick}
            icon={<FontAwesomeIcon icon={faPlus} />}
          />
        </div>
      </div>

      <DataTable columns={columns} data={programs} />

      {/* Add Program Modal */}
      <Modal
        show={showModal}
        message="Please fill in the details below:"
        title="Register New Program"
        onCancel={handleModalCancel}
        onConfirm={handleModalSave}
        cancelButtonText="Cancel"
        confirmButtonText="Add"
      >
        <div className="modal-custom-header-admin-program">
          <div className="header-left">
            <h2 className="main-header">Register New Program</h2>
            <h3 className="sub-header">Program Details</h3>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-program">
            <label htmlFor="program">Program</label>
            <NameInputField
              type="text"
              id="program"
              value={program}
              onChange={(e) => handleInputChange(e, "program")}
            />
            <div className="description-modal">
              <label htmlFor="description">Description</label>
            </div>
            <NameInputField
              type="text"
              id="description"
              value={description}
              onChange={(e) => handleInputChange(e, "description")}
            />

            <label htmlFor="requiredDuration">Duration</label>
            <NameInputField
              type="text"
              id="requiredDuration"
              value={requiredDuration}
              onChange={(e) => handleInputChange(e, "requiredDuration")}
            />
          </div>
        </div>
      </Modal>

      {/* Add School Year Modal */}
      <Modal
        show={showYModal}
        message="Please fill in the details below:"
        title="Register School Year"
        onCancel={handleModalCancel}
        onConfirm={handleYearModalSave}
        cancelButtonText="Cancel"
        confirmButtonText="Add"
      >
        <div className="modal-custom-header-admin-program">
          <div className="header-left">
            <h2 className="main-header">Register School Year</h2>
            <h3 className="sub-header">S:Y</h3>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-program">
            <label htmlFor="schoolyear">Add School Year</label>
            <NameInputField
              type="text"
              id="schoolyear"
              value={schoolyear}
              onChange={(e) => handleInputChange(e, "schoolyear")}
            />
          </div>
        </div>
      </Modal>

      {/* Error Modal */}
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

export default Program;

import React, { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from 'qrcode.react';
import "./cd-company.scss";
import SearchBar from "../../../../shared/components/searchbar/searchbar";
import DataTable from "../../../../shared/components/table/data-table";
import { faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrimaryButton from "../../../../shared/components/buttons/primero-button";
import Modal from "../../../../shared/components/modals/modal";
import NameInputField from "../../../../shared/components/fields/unif";
import axios from "axios";

const CoordinatorCompany = () => {
  const [companyData, setCompanyData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);
  const [formData, setFormData] = useState({ companyName: "", address: "", mentorName: "", contact: "" });
  const [qrCodeData, setQRCodeData] = useState(null);
  const [coordinatorId, setCoordinatorId] = useState(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const storedCoordinatorId = localStorage.getItem("coordinator_id");
    if (storedCoordinatorId) {
      setCoordinatorId(storedCoordinatorId);
    } else {
      alert("Coordinator ID not found. Please log in again.");
      window.location.href = "/login";
    }
  }, []);

  const fetchCompanies = async () => {
    if (!coordinatorId) return;

    try {
      const response = await axios.get("http://localhost:5000/api/companiesni", {
        params: { coordinator_id: coordinatorId },
      });
      const companies = response.data.map((company, index) => ({
        id: company.company_id,
        index: index + 1,
        companyName: company.company_name,
        address: company.company_address,
        mentorName: company.company_mentor,
        contactNo: company.company_contact,
        qrCode: company.company_qr,
      }));
      setCompanyData(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      alert("Failed to fetch company data. Please try again.");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [coordinatorId]);

  const handleEdit = (id) => {
    console.log("Edit company record with ID:", id);
  };

  const handleAddButtonClick = () => {
    setShowModal(true);
    setCurrentModal("details");
  };

  const handleInputChange = (e, field) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setCurrentModal(null);
  };

  const handleModalSave = () => {
    setCurrentModal("credentials");
  };

  const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleGenerateQRCode = () => {
    const randomStr = generateRandomString(10);
    setQRCodeData(randomStr);
  };

  const handleRegisterQRCode = async () => {
    if (!coordinatorId) {
      alert("Coordinator ID not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/add-company", {
        coordinator_id: coordinatorId,
        company_name: formData.companyName,
        company_address: formData.address,
        company_mentor: formData.mentorName,
        company_contact: formData.contact,
        company_qr: qrCodeData,
      });

      const { company_id } = response.data;

      setCompanyData((prev) => [
        ...prev,
        {
          id: company_id,
          companyName: formData.companyName,
          address: formData.address,
          mentorName: formData.mentorName,
          contactNo: formData.contact,
          qrCode: qrCodeData,
        },
      ]);

      setFormData({ companyName: "", address: "", mentorName: "", contact: "" });
      setShowModal(false);
      setQRCodeData(null);
      setCurrentModal(null);
    } catch (error) {
      console.error("Error registering company:", error);
      alert("Failed to register company. Please try again.");
    }
  };

  const downloadQRCode = (value, companyName) => {
    const canvas = document.createElement("canvas");
    const qrCodeCanvas = qrCodeRef.current;
    if (qrCodeCanvas) {
      canvas.width = qrCodeCanvas.width;
      canvas.height = qrCodeCanvas.height;
      const context = canvas.getContext("2d");
      context.drawImage(qrCodeCanvas, 0, 0);
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `${companyName}_QRCode.png`;
      link.click();
    }
  };

  const columns = [
    { header: "#", key: "index", render: (row) => row.index },
    { header: "Company Name", key: "companyName", render: (row) => row.companyName || "N/A" },
    { header: "Address", key: "address", render: (row) => row.address || "N/A" },
    { header: "Mentor Name", key: "mentorName", render: (row) => row.mentorName || "N/A" },
    { header: "Contact #", key: "contactNo", render: (row) => row.contactNo || "N/A" },
    {
      header: "QR Code",
      key: "qrCode",
      render: (row) => (
        <div className="qr-code" onClick={() => downloadQRCode(row.qrCode, row.companyName)}>
          {row.qrCode ? (
            <QRCodeCanvas ref={qrCodeRef} value={row.qrCode} size={50} />
          ) : "No QR Code"}
        </div>
      ),
    },
    { header: "Action", key: "action", render: (row) => <FontAwesomeIcon icon={faEdit} className="edit-icon" onClick={() => handleEdit(row.id)} /> },
  ];

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Company</h1>
      <h2 className="page-subtitle">Manage Company Information</h2>
      <div className="controls-container">
        <div className="search-bar-container">
          <SearchBar placeholder="Search" onSearch={(query) => console.log(query)} />
        </div>
        <div className="add-button-container">
          <PrimaryButton buttonText="Add Company" handleButtonClick={handleAddButtonClick} icon={<FontAwesomeIcon icon={faPlus} />} />
        </div>
      </div>
      <DataTable columns={columns} data={companyData} />
      <Modal show={showModal && currentModal === "details"} title="" message="" onCancel={handleModalCancel} onConfirm={handleModalSave} size="large" cancelButtonText="Cancel" confirmButtonText="Next">
        <div className="modal-custom-content">
          <div className="modal-custom-header-company">
            <div className="header-left">
              <h2 className="main-header">Register New Company</h2>
              <h3 className="sub-header">Company Details</h3>
            </div>
          </div>
          <div className="modal--body">
            <div className="modal-bodyleft">
              <h4>Company Info</h4>
              <div className="naming">
                <label htmlFor="companyName">Name</label>
              </div>
              <NameInputField type="text" id="companyName" value={formData.companyName} onChange={(e) => handleInputChange(e, "companyName")} />
              <label htmlFor="address">Address</label>
              <NameInputField type="text" id="address" value={formData.address} onChange={(e) => handleInputChange(e, "address")} />
            </div>
            <div className="modal-bodyright">
              <h4>Mentor Info</h4>
              <div className="leftcomponents">
                <label htmlFor="mentorName">Mentor Name</label>
                <NameInputField type="text" id="mentorName" value={formData.mentorName} onChange={(e) => handleInputChange(e, "mentorName")} />
                <label htmlFor="contact">Contact #</label>
                <NameInputField type="text" id="contact" value={formData.contact} onChange={(e) => handleInputChange(e, "contact")} />
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal show={showModal && currentModal === "credentials"} title="" message="" onCancel={() => setCurrentModal("details")} onConfirm={handleRegisterQRCode} size="medlarge" cancelButtonText="Back" confirmButtonText="Register">
        <div className="modal-custom-content">
          <div className="modal-custom-header-admin-coordinator">
            <div className="header-left">
              <h2 className="main-header">Register QR Code</h2>
              <h3 className="sub-header">Generate and Download Unique QR code</h3>
            </div>
          </div>
          <div className="credentials-modal-container">
            <div className="credentials-modal-body">
              <PrimaryButton buttonText="Generate QR Code" handleButtonClick={handleGenerateQRCode} icon={<FontAwesomeIcon icon={faPlus} />} />
              {qrCodeData && <div className="qr-code-container"><QRCodeCanvas value={qrCodeData} size={200} ref={qrCodeRef} /></div>}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CoordinatorCompany;

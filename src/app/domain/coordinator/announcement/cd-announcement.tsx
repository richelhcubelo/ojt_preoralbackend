// CoordinatorAnnouncement.tsx
import React, { useState, useEffect } from "react";
import AnnouncementCard from "../../../../shared/components/cards/announcemet-card";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrimaryButton from "../../../../shared/components/buttons/primero-button";
import SearchBar from "../../../../shared/components/searchbar/searchbar";
import Modal from "../../../../shared/components/modals/modal";
import Dropdown from "../../../../shared/components/dropdowns/dropdown";
import NameInputField from "../../../../shared/components/fields/unif";

interface Announcement {
  title: string;
  content: string;
  datePosted: string;
}

const CoordinatorAnnouncement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    type: "",
  });
  const [coordinatorId, setCoordinatorId] = useState<string | null>(null);

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
    if (coordinatorId) fetchAnnouncements();
  }, [coordinatorId]);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/announcementsni?coordinator_id=${coordinatorId}`);
      const data = await response.json();
      setAnnouncements(
        data.map((item: any) => ({
          title: item.announcement_type,
          content: item.announcement_content,
          datePosted: new Date().toLocaleDateString(),
        }))
      );
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    }
  };
  

  const handleAddAnnouncementClick = () => setShowModal(true);

  const handleModalCancel = () => {
    setShowModal(false);
    setNewAnnouncement({ title: "", content: "", type: "" });
  };

  const handleModalSave = async () => {
    if (!coordinatorId) return;
    const newAnnouncementData = {
      coordinator_id: coordinatorId,
      announcement_type: newAnnouncement.type,
      announcement_content: newAnnouncement.content,
    };

    try {
      await fetch("http://localhost:5000/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnnouncementData),
      });
      fetchAnnouncements();
      handleModalCancel();
    } catch (error) {
      console.error("Failed to add announcement:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setNewAnnouncement({ ...newAnnouncement, [field]: e.target.value });
  };

  const announcementTypes = ["General Announcement", "Reminder", "Urgent Announcement", "Policy Update"];

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Announcement</h1>
      <h2 className="page-subtitle">Manage Announcements</h2>
      <div className="controls-container">
        <div className="search-bar-container">
          <SearchBar placeholder="Search" onSearch={(query) => console.log(query)} />
        </div>
        <div className="add-button-container">
          <PrimaryButton buttonText="Add Announcement" handleButtonClick={handleAddAnnouncementClick} icon={<FontAwesomeIcon icon={faPlus} />} />
        </div>
      </div>
      <div className="announcement-container">
        <div className="announcement-cards-wrapper">
          <div className="announcement-cards-container">
            {announcements.map((announcement, index) => (
              <AnnouncementCard key={index} title={announcement.title} content={announcement.content} datePosted={announcement.datePosted} />
            ))}
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        message="Please fill in the details below:"
        title=""
        onCancel={handleModalCancel}
        onConfirm={handleModalSave}
        size="medlarge"
        cancelButtonText="Cancel"
        confirmButtonText="Add"
      >
        <div className="modal-custom-header-admin-program">
          <div className="header-left">
            <h2 className="main-header">Create New Announcement</h2>
            <h3 className="sub-header">Announcement Details</h3>
          </div>
        </div>
        <div className="modalbody">
          <div className="modal-announcementt">
            <Dropdown
              options={announcementTypes}
              value={newAnnouncement.type}
              onChange={(value: string) => setNewAnnouncement({ ...newAnnouncement, type: value })}
              label="Announcement Type"
            />
            <NameInputField
              type="textarea"
              id="content"
              value={newAnnouncement.content}
              onChange={(e) => handleInputChange(e, "content")}
              rows={5}
              label="Content"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CoordinatorAnnouncement;

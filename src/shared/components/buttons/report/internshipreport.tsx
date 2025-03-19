import React, { useState, useEffect } from "react";
import "./internshipreport.scss";
import DataTable from "../../../../shared/components/table/data-table";
import SearchBar from "../../searchbar/searchbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "../primero-button";
import config from "../../../../config";
const InternshipReport: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [coordinatorId, setCoordinatorId] = useState<number | null>(null);

  // Retrieve coordinator_id from localStorage
  useEffect(() => {
    const storedCoordinatorId = localStorage.getItem("coordinator_id");
    if (storedCoordinatorId) {
      setCoordinatorId(parseInt(storedCoordinatorId, 10)); // Convert to number
    } else {
      alert("Coordinator ID not found. Please log in again.");
      window.location.href = "/login";
    }
  }, []);

  // Fetch student timesheet data when searchQuery changes
  useEffect(() => {
    if (searchQuery && coordinatorId) {
      fetch(`${config.API_BASE_URL}/api/reportstudent?coordinatorId=${coordinatorId}&searchQuery=${searchQuery}`)
        .then((response) => response.json())
        .then((data) => {
          setAttendanceData(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      setAttendanceData([]); // Clear the table if the search query is empty
    }
  }, [searchQuery, coordinatorId]);

  const columns = [
    { header: "#", key: "student_id" },
    { header: "Date", key: "date" },
    {
      header: "Morning",
      key: "morning",
      render: (row: any) => (
        <div className="studenttime">
          <p>
            <strong>In:</strong> {row.am_in || "N/A"}
          </p>
          <p>
            <strong>Out:</strong> {row.am_out || "N/A"}
          </p>
        </div>
      ),
    },
    {
      header: "Afternoon",
      key: "afternoon",
      render: (row: any) => (
        <div className="studenttime">
          <p>
            <strong>In:</strong> {row.pm_in || "N/A"}
          </p>
          <p>
            <strong>Out:</strong> {row.pm_out || "N/A"}
          </p>
        </div>
      ),
    },
    { header: "Location", key: "location" },
  ];

  const handlePrintButtonClick = () => {
    window.print(); // Trigger the print dialog
  };

  return (
    <div className="internship-report-container">
      <div className="search-wrapper">
        <SearchBar
          placeholder="Search"
          onSearch={(query) => setSearchQuery(query)}
        />
      </div>

      <div className="content-wrapper">
        <DataTable columns={columns} data={attendanceData} />

        <div className="time-info">
          <p>Total Rendered Time:</p>
          <p>Required Duration:</p>
          <p>Remaining Time:</p>
          <div className="print-button-container">
            <PrimaryButton
              buttonText="Print Report"
              handleButtonClick={handlePrintButtonClick}
              icon={<FontAwesomeIcon icon={faPrint} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipReport;
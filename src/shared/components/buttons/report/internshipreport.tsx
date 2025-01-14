import React from "react";
import "./internshipreport.scss";
import DataTable from "../../../../shared/components/table/data-table";
import SearchBar from "../../searchbar/searchbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "../primero-button";

const InternshipReport: React.FC = () => {
  const attendanceData = [
    {
      id: 1,
      date: "2024-01-06",
      morning: {
        in: "7:55",
        out: "12:01",
      },
      afternoon: {
        in: "12:52",
        out: "5:20",
      },
      duration: "8 hrs",
    },
    {
      id: 1,
      date: "2024-01-05",
      morning: {
        in: "7:20",
        out: "12:30",
      },
      afternoon: {
        in: "12:50",
        out: "5:00",
      },
      duration: "8 hrs",
    },
    {
      id: 1,
      date: "2024-01-04",
      morning: {
        in: "7:33",
        out: "12:11",
      },
      afternoon: {
        in: "01:51",
        out: "5:10",
      },
      duration: "7 hrs",
    },
    {
      id: 1,
      date: "2024-01-03",
      morning: {
        in: "7:59",
        out: "12:05",
      },
      afternoon: {
        in: "12:49",
        out: "5:14",
      },
      duration: "8 hrs",
    },
    {
      id: 1,
      date: "2024-01-02",
      morning: {
        in: "7:45",
        out: "12:11",
      },
      afternoon: {
        in: "12:558",
        out: "5:25",
      },
      duration: "8 hrs",
    },
    {
      id: 1,
      date: "2024-01-01",
      morning: {
        in: "7:55",
        out: "12:35",
      },
      afternoon: {
        in: "12:49",
        out: "5:19",
      },
      duration: "8 hrs",
    },
  ];

  const columns = [
    { header: "#", key: "id" },
    { header: "Date", key: "date" },
    {
      header: "Morning",
      key: "morning",
      render: (row: any) => (
        <div className="studenttime">
          <p>
            <strong>In:</strong> {row.morning.in || "N/A"}
          </p>
          <p>
            <strong>Out:</strong> {row.morning.out || "N/A"}
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
            <strong>In:</strong> {row.afternoon.in || "N/A"}
          </p>
          <p>
            <strong>Out:</strong> {row.afternoon.out || "N/A"}
          </p>
        </div>
      ),
    },
    { header: "Duration", key: "duration" },
  ];
  const handlePrintButtonClick = () => {
    window.print(); // Trigger the print dialog
  };

  return (
    <div className="internship-report-container">
      <div className="search-wrapper">
        <SearchBar
          placeholder="Search"
          onSearch={(query) => console.log("Search query:", query)}
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

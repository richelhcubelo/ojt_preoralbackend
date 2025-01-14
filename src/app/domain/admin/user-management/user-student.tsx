// File: src/pages/UserStudent.tsx
import React, { useEffect, useState } from "react";
import "./user-student.scss";
import SearchBar from "../../../../shared/components/searchbar/searchbar"; // Adjust the path as needed
import DataTable from "../../../../shared/components/table/data-table";

const Student: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Column configuration for DataTable
  const columns = [
    { header: "Student ID", key: "student_schoolid" },
    { header: "Coordinator", key: "coordinator_name" },
    { header: "Program", key: "program_name" },
    { header: "Company", key: "company_name" },
    { header: "Required Duration", key: "program_hours" },
  ];

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/studentsall");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-page">
      <h1 className="page-title">User Management</h1>
      <h2 className="page-subtitle">Student Records</h2>

      {/* Add the SearchBar, Dropdown, and PrimaryButton side by side */}
      <div className="controls-container">
        <div className="search-bar-container">
          <SearchBar
            placeholder="Search"
            onSearch={(query) =>
              console.log("Search query:", query) // You can add filtering logic here
            }
          />
        </div>
      </div>

      {/* Render the DataTable below the controls */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
};

export default Student;

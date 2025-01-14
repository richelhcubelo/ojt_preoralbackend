import React from "react";
import DataTable from "../../../../shared/components/table/data-table"; // Adjust the import path as necessary

const SubmittedFiles: React.FC = () => {
  const submittedFilesData = [
    {
      id: 1,
      date: "2024-01-01",
      student: "John Doe",
      uploadedFiles: "file1.pdf, file2.docx",
    },
    {
      id: 2,
      date: "2024-01-02",
      student: "Jane Smith",
      uploadedFiles: "file3.pdf",
    },
  ];

  const columns = [
    { header: "#", key: "id" },
    { header: "Date", key: "date" },
    { header: "Student", key: "student" },
    { header: "Uploaded Files", key: "uploadedFiles" },
  ];

  return (
    <div className="submitted-files-container">
      {submittedFilesData.length === 0 ? (
        <p>No files submitted yet.</p>
      ) : (
        <DataTable columns={columns} data={submittedFilesData} />
      )}
    </div>
  );
};

export default SubmittedFiles;

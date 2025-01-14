// cd-report.tsx
import React, { useState } from "react";
import "./cd-report.scss";
import CustomButton from "../../../../shared/components/buttons/custom-button";
import SubmittedFiles from "../../../../shared/components/buttons/report/submittedfiles";
import InternshipReport from "../../../../shared/components/buttons/report/internshipreport";

const CoordinatorReport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Internship Report");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Report</h1>
      <h2 className="page-subtitle">Manage Reports</h2>

      {/* Internship Report and Submitted Files Buttons */}
      <div className="tab-container">
        <CustomButton
          buttonText="Internship Report"
          onClick={() => handleTabClick("Internship Report")}
          active={activeTab === "Internship Report"}
        />
        <CustomButton
          buttonText="Submitted Files"
          onClick={() => handleTabClick("Submitted Files")}
          active={activeTab === "Submitted Files"}
        />
      </div>

      {/* Conditional rendering based on active tab */}
      {activeTab === "Internship Report" && <InternshipReport />}
      {activeTab === "Submitted Files" && <SubmittedFiles />}
    </div>
  );
};

export default CoordinatorReport;

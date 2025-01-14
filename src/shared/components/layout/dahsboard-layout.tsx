import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/admin-sidebar";

const DashboardLayout: React.FC = () => {
  // State to track the currently active sidebar item
  const [activeItem, setActiveItem] = useState<string>("dashboard");

  // Function to handle item clicks in the sidebar
  const handleItemClick = (item: string) => {
    setActiveItem(item);
    // You can also add navigation or other logic here if needed
  };

  return (
    <div className="dashboard">
      <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;

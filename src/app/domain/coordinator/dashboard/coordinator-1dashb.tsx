import React, { useState, useEffect } from "react";
import "./coordinator-dashboard.scss";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../../shared/components/sidebar/coordinator-sidebar";

const CDashboard: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("overview");
  const [adminData, setAdminData] = useState<any>(null); // State to hold admin data
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/admin");
        const admins = response.data;

        // Retrieve the current user's UUID from localStorage
        const storedUserDisplayData = JSON.parse(
          localStorage.getItem("userDisplayData") || "{}"
        );
        const loggedInAdminUUID = storedUserDisplayData.uuid;

        // Find the admin with the matching UUID
        const loggedInAdmin = admins.find(
          (admin: any) => admin.adminUUID === loggedInAdminUUID
        );

        if (loggedInAdmin) {
          setAdminData(loggedInAdmin);
        } else {
          console.error("Logged-in admin not found");
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    navigate(`/cddashboard/${item}`);
  };

  return (
    <div className="dashboard">
      <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
      <div className="dashboard-container">
        <div className="dashboard-header">
          {adminData && (
            <div className="admin-info">
              <span className="admin-name">
                {`${adminData.firstName} ${
                  adminData.middleName
                    ? `${adminData.middleName.charAt(0)}. `
                    : ""
                } ${adminData.lastName}`}
              </span>
            </div>
          )}
        </div>
        <Outlet context={{ adminData }} />
      </div>
    </div>
  );
};

export default CDashboard;

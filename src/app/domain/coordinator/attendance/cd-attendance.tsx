// src/components/Attendance.tsx
import React, { useState, useEffect } from "react";
import "./cd-attendance.scss";
import SearchBar from "../../../../shared/components/searchbar/searchbar"; // Adjust path as needed
import DataTable from "../../../../shared/components/table/data-table";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import config from "../../../../config";

const Attendance: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapCoords, setMapCoords] = useState<[number, number] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedCoordinatorId = localStorage.getItem("coordinator_id");
    if (storedCoordinatorId) {
      fetch(
        `${config.API_BASE_URL}/api/timesheet?coordinator_id=${storedCoordinatorId}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // Reverse geocode each location to get addresses
          const updatedDataPromises = data.map(async (item: any) => {
            if (item.location.includes(",")) {
              const [lat, lon] = item.location.split(",").map(Number);
              const fullAddress = await fetchAddress(lat, lon);
              item.address = formatAddress(fullAddress); // Format and add address to item
            }
            return item; // Return item unchanged if no coordinates
          });

          Promise.all(updatedDataPromises).then((updatedData) => {
            setAttendanceData(updatedData);
          });
        })
        .catch((error) => {
          console.error("Error fetching attendance data:", error);
          alert("Error fetching attendance data. Please try again later.");
        });
    } else {
      alert("Coordinator ID not found. Please log in again.");
      window.location.href = "/login";
    }
  }, []);

  // Function to fetch address from coordinates
  const fetchAddress = async (lat: number, lon: number): Promise<any> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      return await response.json(); // Return the entire response for further processing
    } catch (error) {
      console.error("Error fetching address:", error);
      return { display_name: "Unknown Address" }; // Fallback if there's an error
    }
  };

  // Function to format the full address into Barangay, Municipality, Province
  const formatAddress = (addressData: any): string => {
    const barangay =
      addressData.address?.suburb || addressData.address?.neighbourhood || "";
    const municipality =
      addressData.address?.city || addressData.address?.town || "";
    const province = addressData.address?.state || "";

    // Construct the formatted address
    return [barangay, municipality, province].filter(Boolean).join(", ");
  };

  // Open modal to display Leaflet map
  const openMapModal = (location: string) => {
    if (location.includes(",")) {
      const [lat, lon] = location.split(",").map(Number);
      setMapCoords([lat, lon]);
      fetchAddress(lat, lon).then((address) =>
        setSelectedAddress(formatAddress(address))
      ); // Format address before setting it
      setShowMapModal(true);
    }
  };

  const closeMapModal = () => {
    setShowMapModal(false);
    setMapCoords(null);
    setSelectedAddress(null);
    setMessage("");
  };

  // Table columns with clickable location
  const columns = [
    { header: "#", key: "time_id" },
    { header: "Date", key: "date" },
    { header: "Student Name", key: "student_name" },
    { header: "Company", key: "company_name" },
    {
      header: "Morning",
      key: "morning",
      render: (row: any) => (
        <div>
          <p>
            <strong>In:</strong> {row.am_in || "N/A"}
          </p>
          <p>
            <strong>Out:</strong>
            {row.am_out || "N/A"}
          </p>
        </div>
      ),
    },
    {
      header: "Afternoon",
      key: "afternoon",
      render: (row: any) => (
        <div>
          <p>
            <strong>In:</strong> {row.pm_in || "N/A"}
          </p>
          <p>
            <strong>Out:</strong> {row.pm_out || "N/A"}
          </p>
        </div>
      ),
    },
    {
      header: "Location",
      key: "address", // Change this to 'address' which contains the fetched and formatted address
      render: (row: any) => (
        <span
          className="clickable-location"
          onClick={() => openMapModal(row.location)}
        >
          {row.address || row.location}{" "}
          {/* Display formatted address or fallback to location */}
        </span>
      ),
    },
  ];

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Attendance</h1>
      <h2 className="page-subtitle">Check Student Attendances</h2>

      {/* SearchBar */}
      <div className="controls-container">
        <div className="search-bar-container">
          <SearchBar
            placeholder="Search"
            onSearch={(query) => console.log(query)}
          />
        </div>
      </div>

      {/* Render the DataTable */}
      <DataTable columns={columns} data={attendanceData} />

      {/* Modal to display Leaflet map */}
      {showMapModal && mapCoords && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeMapModal}>
              &times;
            </span>
            <h3>Location: {selectedAddress}</h3>
            <MapContainer
              center={mapCoords}
              zoom={15}
              style={{ height: "600px", width: "95%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={mapCoords}>
                <Popup>{selectedAddress}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}

      {/* Embedded CSS for Modal */}
      <style>
        {`
          .modal {
            display: block;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
          }

          .modal-content {
            background-color: #fff;
            margin: 1% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 90%;
            max-width: 1200px; 
          }

          .close-button {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
          }

          .close-button:hover,
          .close-button:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
          }

          .clickable-location {
            color: blue;
            text-decoration: underline;
            cursor: pointer;
          }

          .clickable-location:hover {
            text-decoration: none;
          }
        `}
      </style>
    </div>
  );
};

export default Attendance;

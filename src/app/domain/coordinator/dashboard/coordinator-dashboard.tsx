import React, { useEffect, useState } from "react";
import axios from "axios";
import "./coordinator-dashboard.scss";
import { FaBuilding, FaGraduationCap } from "react-icons/fa";
import NewCoordinatorCard from "../../../../shared/components/new-coordinator/new-coordinator";
import Card from "../../../../shared/components/cards/card";
import BarChartCard from "../../../../shared/components/charts/bar-chart";
import welcomeGif from "../../../../shared/assets/welcome.gif";

const CoordinatorDashboard: React.FC = () => {
  const [coordinatorId, setCoordinatorId] = useState<string | null>(null);
  const [totalCompanies, setTotalCompanies] = useState<number | null>(null);
  const [coordinatorName, setCoordinatorName] = useState<string>("");
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [recentlyAddedStudents, setRecentlyAddedStudents] = useState<
    {
      id: number;
      schoolId: string;
      name: string;
      companyName: string;
    }[]
  >([]);

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
    if (!coordinatorId) return;

    const fetchTotalCompanies = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/count-companies?coordinator_id=${coordinatorId}`
        );
        setTotalCompanies(response.data.count);
      } catch (error) {
        console.error("Error fetching total companies:", error);
      }
    };

    const fetchTotalStudents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/count-students?coordinator_id=${coordinatorId}`
        );
        setTotalStudents(response.data.count);
      } catch (error) {
        console.error("Error fetching total students:", error);
      }
    };

    const fetchRecentlyAddedStudents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/recent-students?coordinator_id=${coordinatorId}`
        );
        setRecentlyAddedStudents(
          response.data.recentStudents.map((student: any) => ({
            id: student.student_id,
            schoolId: student.student_schoolid,
            name: student.student_name,
            companyName: student.company_name,
          }))
        );
      } catch (error) {
        console.error("Error fetching recently added students:", error);
      }
    };

    fetchTotalCompanies();
    fetchTotalStudents();
    fetchRecentlyAddedStudents();
  }, [coordinatorId]);

  useEffect(() => {
    if (!coordinatorId) return;

    const fetchCoordinatorName = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/coordinatorwc?coordinator_id=${coordinatorId}`
        );
        setCoordinatorName(response.data.fullName);
      } catch (error) {
        console.error("Error fetching coordinator name:", error);
      }
    };

    fetchCoordinatorName();
  }, [coordinatorId]);

  return (
    <div className="dashb">
      <div className="cards-wrapper">
        <div className="left-card">
          <h2>Welcome back, {coordinatorName}!</h2>
          <img
            src={welcomeGif}
            alt="Person using a laptop"
            className="gif-image"
            width={250}
          />
        </div>
        <div className="right-cards">
          <Card
            label={
              <span>
                <FaGraduationCap /> Total Students:{" "}
                {totalStudents !== null ? totalStudents : 0}
              </span>
            }
            width="80%"
            height="40%"
            className="total-students"
          />
          <Card
            label={
              <span>
                <FaBuilding /> Total Companies:{" "}
                {totalCompanies !== null ? totalCompanies : 0}
              </span>
            }
            width="80%"
            height="40%"
            className="total-companies"
          />
        </div>
      </div>

      <div className="content-wrapper">
    <div className="recently-added-section">
      <h2>Recently Added Students</h2>
      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>School ID</th>
              <th>Student Name</th>
            </tr>
          </thead>
          <tbody>
            {recentlyAddedStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.schoolId}</td>
                <td>{student.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

        <div className="chart-container">
          <h2>Student Company Distribution</h2>
          <BarChartCard />
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;

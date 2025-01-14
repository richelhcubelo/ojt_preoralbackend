// RecentCoordinators.tsx
import React from "react";
import "./recentcoordinator.scss";
import NewCoordinatorCard from "../../new-coordinator/new-coordinator"; // Check this import path

interface Coordinator {
  id: number;
  name: string;
  registrationDate: string;
}

interface RecentCoordinatorsProps {
  coordinators: Coordinator[];
}

const RecentCoordinators: React.FC<RecentCoordinatorsProps> = ({
  coordinators,
}) => {
  return (
    <div className="recentcoordinators">
      <h2>Recently Added Coordinators</h2>
      <div className="new-members-list">
        {coordinators.slice(0, 5).map((coordinator) => (
          <NewCoordinatorCard
            key={coordinator.id}
            name={coordinator.name}
            registrationDate={coordinator.registrationDate}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentCoordinators;

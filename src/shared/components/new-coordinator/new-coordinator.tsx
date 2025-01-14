// NewCoordinatorCard.tsx
import React from "react";
import "./new-coordinator.scss";

interface NewCoordinatorCardProps {
  name: string;
  registrationDate: string;
}

const NewCoordinatorCard: React.FC<NewCoordinatorCardProps> = ({
  name,
  registrationDate,
}) => {
  return (
    <div className="card">
      <div className="member-info">
        <span className="member-name">{name}</span>
        {registrationDate && (
          <span className="registration-date">{registrationDate}</span>
        )}
      </div>
    </div>
  );
};

export default NewCoordinatorCard;

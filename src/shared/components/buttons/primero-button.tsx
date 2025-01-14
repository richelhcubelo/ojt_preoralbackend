import React from "react";
import "./primero-button.scss";

interface PrimaryButtonProps {
  buttonText: string;
  handleButtonClick: () => void;
  icon?: React.ReactNode;
  active?: boolean; // Add 'active' prop here
  className?: string; // Optional additional class for styling
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  buttonText,
  handleButtonClick,
  icon,
  active = false, // Default active state to false
  className = "", // Default to an empty string if no class is provided
}) => {
  return (
    <button
      className={`primary-button ${active ? "active" : ""} ${className}`} // Add conditional class and optional class
      onClick={handleButtonClick}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {buttonText}
    </button>
  );
};

export default PrimaryButton;

import React from "react";
import "./secondary-button.scss";

interface PrimaryButtonProps {
  handleButtonClick: () => void;
  active?: boolean; // Add 'active' prop here
  className?: string;
  children?: React.ReactNode; // Allow children to be passed
}

const SecondaryButton: React.FC<PrimaryButtonProps> = ({
  handleButtonClick,
  active = false,
  className = "",
  children, // Accept children instead of buttonText
}) => {
  return (
    <button
      className={`secondary-button ${active ? "active" : ""} ${className}`} // Add conditional class
      onClick={handleButtonClick}
    >
      {children} {/* Render children here */}
    </button>
  );
};

export default SecondaryButton;

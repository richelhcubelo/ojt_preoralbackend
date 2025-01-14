// PrintButton.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import SecondaryButton from "./secondary-button"; // Adjust the import path as necessary
import "./print-button.scss"; // Import your SCSS file

interface PrintButtonProps {
  onClick: () => void;
}

const PrintButton: React.FC<PrintButtonProps> = ({ onClick }) => {
  return (
    <SecondaryButton handleButtonClick={onClick} className="print-button">
      <FontAwesomeIcon icon={faPrint} className="button-icon" />
      <span>Print</span>
    </SecondaryButton>
  );
};

export default PrintButton;

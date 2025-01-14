import React from "react";
import "./custom-button.scss";

interface CustomButtonProps {
  buttonText: string;
  active?: boolean;
  onClick: () => void; // Correctly defining the onClick prop
}

const CustomButton: React.FC<CustomButtonProps> = ({
  buttonText,

  active,
  onClick,
}) => {
  return (
    <button
      className={`custom-button ${active ? "active" : "default"}`}
      onClick={onClick} // Make sure it's onClick, not handleButtonClick
    >
      {buttonText}
    </button>
  );
};

export default CustomButton;

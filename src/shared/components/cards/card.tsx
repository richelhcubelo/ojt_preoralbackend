import React from "react";
import "./card.scss";

interface CardProps {
  label: string |JSX.Element;
  value?: string | number;
  icon?: React.ReactNode;
  width?: string; // Optional width prop to customize width
  height?: string; // Optional height prop to customize height
  color?: string;
  className?: string; // Add className prop
}

const Card: React.FC<CardProps> = ({
  label,
  value = "",
  icon,
  width,
  height,
  color = "",
  className = "", // Default to empty string
}) => {
  return (
    <div
      className={`card ${className}`}
      style={{ width, height, backgroundColor: color }}
    >
      <div className="label">
        {icon && <span className="icon">{icon}</span>}
        {label}
      </div>
      <div className="value">{value}</div>
    </div>
  );
};

export default Card;

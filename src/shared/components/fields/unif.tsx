import React from "react";
import "./unif.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface NameInputFieldProps {
  type: string;
  id: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  readOnly?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  label?: string;
  rows?: number;
  className?: string;
}

const NameInputField: React.FC<NameInputFieldProps> = ({
  type,
  id,
  value,
  onChange,
  readOnly = false,
  showPassword = false,
  onTogglePassword,
  label,
  rows = 3,
}) => {
  return (
    <div className="name-input-field">
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      {type === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          rows={rows}
        />
      ) : (
        <input
          type={showPassword ? "text" : type}
          id={id}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className="contactnum"
        />
      )}
      {type === "password" && onTogglePassword && (
        <div className="password-toggle" onClick={onTogglePassword}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </div>
      )}
    </div>
  );
};

export default NameInputField;

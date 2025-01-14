import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import "./inputfield.scss";

interface InputFieldProps {
  type: string;
  placeholder: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: IconDefinition;
  toggleIcon?: IconDefinition;
  onTogglePassword?: () => void;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholder,
  value,
  name,
  onChange,
  icon,
  toggleIcon,
  onTogglePassword,
  error,
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    onChange(e);
  };

  return (
    <div className="input-field">
      {icon && <FontAwesomeIcon icon={icon} className="input-icon" />}
      <input
        type={type}
        placeholder={placeholder}
        value={localValue}
        name={name}
        onChange={handleChange}
        className={error ? "input-error" : ""}
      />
      {toggleIcon && onTogglePassword && (
        <FontAwesomeIcon
          icon={toggleIcon}
          className="toggle-icon"
          onClick={onTogglePassword}
        />
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default InputField;

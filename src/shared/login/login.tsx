import React, { useState, useEffect } from "react";
import "./login.scss";
import PrimaryButton from "../components/buttons/primero-button";
import {
  faLock,
  faEye,
  faUser,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import InputField from "../components/fields/inputfield";
import logo from "../assets/logo-sidebar.png";
import config from "../../config";

const LoginForm: React.FC = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    general?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;

    // Username validation
    if (!loginData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (specialChars.test(loginData.username)) {
      newErrors.username = "Special characters are not allowed";
    }

    // Password validation
    if (!loginData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleButtonClick = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch(`${config.API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Invalid credentials');
      }

      // Handle successful login
      if (result.role === "admin") {
        localStorage.setItem("admin_id", result.user.admin_id);
        window.location.href = "/dashboard/overview";
      } else if (result.role === "coordinator") {
        localStorage.setItem("coordinator_id", result.user.coordinator_id);
        window.location.href = "/cddashboard/coordinator-dashboard";
      } else if (result.role === "student") {
        localStorage.setItem("student_id", result.user.student_id);
        window.location.href = "/student/dashboard";
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrors({
          general: error.message || "Invalid username or password",
          username: " ",
          password: " "
        });
      } else {
        setErrors({
          general: "An unknown error occurred",
          username: " ",
          password: " "
        });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleButtonClick();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [loginData]);

  return (
    <div className="login-form-container">
    <div className="container">
      <img src={logo} alt="Logo" className="logo" />
      {errors.general && (
        <div className="error-message">{errors.general}</div>
      )}
      <div className="input-container">
        <div className="input-field">
          <label htmlFor="username">Username</label>
          <InputField
            type="text"
            placeholder=""
            value={loginData.username}
            name="username"
            onChange={handleChange}
            icon={faUser}
            error={errors.username}
          />
        </div>

        <div className="input-field">
          <label htmlFor="password">Password</label>
          <InputField
            type={showPassword ? "text" : "password"}
            placeholder=""
            value={loginData.password}
            name="password"
            onChange={handleChange}
            icon={faLock}
            toggleIcon={showPassword ? faEye : faEyeSlash}
            onTogglePassword={togglePasswordVisibility}
            error={errors.password}
          />
        </div>
      </div>
      <PrimaryButton
        buttonText="Login"
        handleButtonClick={handleButtonClick}
      />
    </div>
  </div>
);
};

export default LoginForm;

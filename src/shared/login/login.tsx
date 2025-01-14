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

// Import the logo image
import logo from "../assets/logo-sidebar.png"; // Adjust the path based on your project structure

const LoginForm: React.FC = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [, setShowValidationError] = useState(false);
  const [, setValidationErrorMessage] = useState("");


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleButtonClick = async () => {
    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.message || 'Login failed');
        }

        const result = await response.json();

        // Handle user based on role
        if (result.role === "admin") {
            localStorage.setItem("admin_id", result.user.admin_id); // Save the admin_id
            window.location.href = "/dashboard/overview";
        } else if (result.role === "coordinator") {
            localStorage.setItem("coordinator_id", result.user.coordinator_id); // Save the coordinator_id
            window.location.href = "/cddashboard/coordinator-dashboard";
        } else if (result.role === "student") {
            localStorage.setItem("student_id", result.user.student_id); // Save the student_id
            window.location.href = "/student/dashboard"; // You can define the student route here
        } else {
            setErrors({
                username: "Invalid credentials",
                password: "Invalid credentials",
            });
        }
    } catch (error) {
        console.error("Error during login:", error.message);
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
        {/* Logo added here */}
        <img src={logo} alt="Logo" className="logo" />
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

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "", // Add role state
    doctorId: "", // Add doctorId state
  });
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const navigate = useNavigate(); // Use the useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const pattern = /^RGTH\d{2}$/;
      // Validate doctor's ID if role is 'doctor'
      if (formData.role === "doctor" && !pattern.test(formData.doctorId)) {
        setErrorMessage("Doctor ID format is invalid.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("Registration successful:", response.data);
      // Redirect to login page upon successful registration
      navigate("/login"); // Use navigate instead of history.push
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Registration failed:", error.response.data);
        // Set error message
        setErrorMessage(
          error.response.data.message ||
            "Registration failed. Please try again."
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Registration failed:", error.request);
        setErrorMessage(
          "No response received. Please check your network connection."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Registration failed:", error.message);
        setErrorMessage(
          "An unexpected error occurred. Please try again later."
        );
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
      >
        <option value="">Select Role</option>
        <option value="doctor">Doctor</option>
        <option value="patient">Patient</option>
      </select>
      {formData.role === "doctor" && (
        <input
          type="text"
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          placeholder="Doctor ID"
          required
        />
      )}
      {errorMessage && <p>{errorMessage}</p>}
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;

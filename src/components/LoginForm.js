import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error message
  const navigate = useNavigate();

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
      const response = await axios.post(
        "http://localhost:3000/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);

      // Redirect based on the user's role
      if (response.data.role === "doctor") {
        navigate("/prediction");
      } else if (response.data.role === "patient") {
        navigate("/chatbot");
      } else {
        console.error("Unknown role:", response.data.role);
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Server Error:", error.response.status);
        setErrorMessage("Server Error: " + error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Network Error:", error.request);
        setErrorMessage("Network Error: Unable to connect to the server.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
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
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default LoginForm;

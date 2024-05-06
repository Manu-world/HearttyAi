import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../provider/useAuth"; // Adjust the import path accordingly

const PredictionForm = () => {
  const { userEmail } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: "",
  });
  const [predictionResult, setPredictionResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const { email, ...predictionData } = formData; // Destructure email and remaining data
    try {
      const response = await axios.post(
        "http://localhost:3000/prediction",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resultWithEmail = response.data.response; // Add email to the prediction result
      setPredictionResult(resultWithEmail);
    } catch (error) {
      console.error("Prediction failed:", error);
    }
  };

  return (
    <div>
      <h1>Welcome {userEmail}</h1>
      <h2>Heart Disease Prediction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>
        {/* Render input fields for each parameter */}
        {Object.keys(formData).map((key) => {
          if (key !== "email") {
            return (
              <div key={key}>
                <label htmlFor={key}>{key}</label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                  autoComplete={key}
                />
              </div>
            );
          }
          return null;
        })}
        <button type="submit">Predict</button>
      </form>
      {predictionResult && (
        <div>
          <h3>Prediction Result</h3>
          <pre>{JSON.stringify(predictionResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;

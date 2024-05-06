// patientspage.js

import React, { useState, useEffect } from "react";
import { useAuth } from "../provider/useAuth"; // Adjust the import path accordingly
import axios from "axios";
import Modal from "./Modal"; // Assuming you have a Modal component for displaying the report
import "./PatientsPage.css";

function PatientsPage() {
  const { userEmail } = useAuth();
  const [latestResult, setLatestResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [sessionId, setSessionId] = useState(""); // Unique session ID

  function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  useEffect(() => {
    const fetchLatestResult = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/result/${userEmail}`
        );
        setLatestResult(response.data);
      } catch (error) {
        console.error("Failed to fetch latest result:", error);
      }
    };

    // initialize session ID
    const initSessionId = generateUniqueId();
    setSessionId(initSessionId);

    fetchLatestResult();
  }, [userEmail]);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const startConversation = async () => {
    try {
      // Create a new session ID (you can generate a unique ID here)
      const newSessionId = generateUniqueId();
      setSessionId(newSessionId);

      // Make a request to initiate the conversation with the chatbot
      const response = await axios.post(
        "http://127.0.0.1:8000/chat",
        { text: "", context: latestResult, session_id: sessionId },
        { headers: { "Content-Type": "application/json" } }
      );

      // Update conversation state with the initial response
      setConversation([...conversation, response.data.response]);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  const sendMessage = async () => {
    try {
      // Make a request to the backend with the user's message

      const response = await axios.post(
        "http://127.0.0.1:8000/chat",
        { text: userMessage, context: latestResult, session_id: sessionId },
        { headers: { "Content-Type": "application/json" } }
      );

      // Update conversation state with the response
      setConversation([...conversation, userMessage, response.data.response]);

      // Clear the input field after sending the message
      setUserMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="body">
      <h1>Welcome, {userEmail}!</h1>

      {latestResult && (
        <>
          <div>
            <p
              style={{
                width: "fit-content",
              }}
            >
              Status:{" "}
              <strong
                style={{
                  color: `${latestResult.Prediction === 0 ? "red" : "green"}`,
                }}
              >
                {latestResult.Status}
              </strong>
            </p>
          </div>
          <button onClick={toggleDetails}>Check Details</button>
          {showDetails && (
            <Modal onClose={toggleDetails}>
              <h2 className="modal-header">Your Vitals</h2>
              <ul>
                <li>Age in years: {latestResult["Age in years"]}</li>
                <li>
                  Sex (0: female, 1: male):{" "}
                  {latestResult["Sex (0: female, 1: male)"] === 1
                    ? "Male"
                    : "Female"}
                </li>
                <li>
                  Chest pain type (0-3): {latestResult["Chest pain type (0-3)"]}
                </li>
                <li>
                  Resting blood pressure (mm Hg):{" "}
                  {latestResult["Resting blood pressure (mm Hg)"]}
                </li>
                <li>
                  Serum cholesterol (mg/dl):{" "}
                  {latestResult["Serum cholesterol (mg/dl)"]}
                </li>
                <li>
                  Fasting blood sugar `{">"}` 120 mg/dl (1: true, 0: false):{" "}
                  {latestResult[
                    "Fasting blood sugar > 120 mg/dl (1: true, 0: false)"
                  ] === 1
                    ? "True"
                    : "False"}
                </li>
                <li>
                  Resting electrocardiographic results (0-2):{" "}
                  {latestResult["Resting electrocardiographic results (0-2)"]}
                </li>
                <li>
                  Maximum heart rate achieved:{" "}
                  {latestResult["Maximum heart rate achieved"]}
                </li>
                <li>
                  Exercise induced angina (1: yes, 0: no):{" "}
                  {latestResult["Exercise induced angina (1: yes, 0: no)"] === 1
                    ? "Yes"
                    : "No"}
                </li>
                <li>
                  ST depression induced by exercise relative to rest:{" "}
                  {
                    latestResult[
                      "ST depression induced by exercise relative to rest"
                    ]
                  }
                </li>
                <li>
                  Slope of the peak exercise ST segment:{" "}
                  {latestResult["Slope of the peak exercise ST segment"]}
                </li>
                <li>
                  Number of major vessels (0-3) colored by fluoroscopy:{" "}
                  {
                    latestResult[
                      "Number of major vessels (0-3) colored by fluoroscopy"
                    ]
                  }
                </li>
                <li>
                  Thalassemia type (0-3):{" "}
                  {latestResult["Thalassemia type (0-3)"]}
                </li>
              </ul>
              <h2 className="modal-header">Result</h2>
              <p
                style={{
                  width: "fit-content",
                }}
              >
                Status:{" "}
                <strong
                  style={{
                    color: `${latestResult.Prediction === 0 ? "red" : "green"}`,
                  }}
                >
                  {latestResult.Status}
                </strong>
              </p>
            </Modal>
          )}
        </>
      )}

      {/* Chat Section */}

      <div className="container">
        <div className="first"></div>
        <div className="chat-section">
          <button onClick={startConversation}>Start New Conversation</button>

          <div className="conversation">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={index % 2 === 0 ? "user-message" : "bot-message"}
              >
                {message}
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
            />
            <button
              onClick={sendMessage}
              type="button"
              class="send-message-button bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 inline-block mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M22 12h-4l-3 9L9 3l-3 9H2"
                ></path>
              </svg>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientsPage;

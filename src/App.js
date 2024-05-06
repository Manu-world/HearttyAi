import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorsPage from "./components/DoctorsPage";
import PatientsPage from "./components/PatientsPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import UnauthorizedPage from "./components/UnauthorizedPage";
import Error_404 from "./components/Error_404";
import Home from "./components/Home";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/chatbot" element={<PatientsPage />} />
          <Route path="/prediction" element={<DoctorsPage />} />
        </Route>
        <Route path="*" element={<Error_404 />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

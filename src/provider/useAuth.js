import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserEmail(decodedToken.email);
      setUserRole(decodedToken.role);
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return { token, userEmail, userRole };
};

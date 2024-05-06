import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };
  return (
    <div>
      Home
      <button onClick={handleClick}>Login</button>
    </div>
  );
}

export default Home;

import React from "react";
import { useNavigate } from "react-router-dom";

const SideNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Rensa localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("avatar");
    localStorage.removeItem("username");

    // Omdirigera till inloggningssidan
    navigate("/");
  };

  return (
    <div className="sidenav">
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default SideNav;

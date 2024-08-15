import React, { useEffect, useState } from "react";
import Register from "./pages/Register";
import "./style.scss";
import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";

function App() {
  const [csrfToken, setCsrfToken] = useState(null);
  useEffect(() => {
    fetch("https://chatify-api.up.railway.app/csrf", {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("csrfToken", data.csrfToken);
        setCsrfToken(data.csrfToken);
      });
  }, []);
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="register" element={<Register csrfToken={csrfToken} />} />
          <Route path="chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;

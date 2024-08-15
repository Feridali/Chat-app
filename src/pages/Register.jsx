import React, { useContext, useEffect, useState } from "react";
import Login from "./Login";
import { Link } from "react-router-dom";

function Register({ csrfToken }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleRegister = async () => {
    if (!csrfToken) {
      setMessage("CSRF token is missing");
      return;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: name,
            password: password,
            email: email,
            avatar: avatar,
            csrfToken: csrfToken,
          }),
        }
      );

      // Kontrollera om svaret är OK och innehåller data
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Kontrollera om det finns innehåll att parsa

      const data = await response.json();

      if (data && response.ok) {
        setMessage("Registration successful");
      } else {
        setMessage(data?.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(error.message);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chat-App</span>
        <span className="title">Register</span>
        <input
          type="text"
          placeholder="username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="avatar" className="form-label">
          Avatar URL
        </label>
        <input
          type="text"
          className="form-control"
          id="avatar"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />

        <button onClick={handleRegister}>Sign up</button>

        <p>{message}</p>
        <p>
          You do have an account? <Link to={"/"}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

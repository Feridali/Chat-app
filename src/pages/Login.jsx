import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: name,
            password: password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Incorrect username or password");
      }

      const data = await response.json();

      if (data && response.ok) {
        setMessage("Login successful");
        // Lagra token om inloggningen lyckades
        localStorage.setItem("token", data.token);
        navigate("/chat");
      } else {
        setMessage(data?.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.message);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chat-App</span>
        <span className="title">Login</span>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Sign in</button>
        </form>
        <p>{message}</p>
        <p>
          You don’t have an account? <Link to={"/register"}>Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

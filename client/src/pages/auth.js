import "./auth.css";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  return (
    <div className="auth">
      <Helmet>
        <style>{"body { background-color: #c95152; }"}</style>
      </Helmet>
      <Login />
      <Register />
    </div>
  );
};

const Login = () => {
  const [_, setCookies] = useCookies(["access_token"]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await axios.post(
        "https://abandoned-ship-production.up.railway.app/auth/login",
        {
          username,
          password,
        }
      );

      setCookies("access_token", result.data.token);
      window.localStorage.setItem("userID", result.data.userID);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2 className="auth-title">Login</h2>
        <div className="form-group">
          {/* <label htmlFor="username">Username:</label> */}
          <input
            type="text"
            id="username"
            value={username}
            placeholder=" Enter your user name"
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="form-group">
          {/* <label htmlFor="password">Password:</label> */}
          <input
            type="password"
            id="password"
            value={password}
            placeholder=" Enter your password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="button-holder">
          <button type="submit" id="submit" className="arrow">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        "https://abandoned-ship-production.up.railway.app/auth/register",
        {
          username,
          password,
        }
      );
      alert("Registration Completed! Now login.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2 className="auth-title">Register</h2>
        <div className="form-group">
          <input
            type="text"
            id="username"
            value={username}
            placeholder=" Enter your user name"
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            value={password}
            placeholder=" Enter your password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="button-holder">
          <button type="submit" id="submit" className="arrow">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

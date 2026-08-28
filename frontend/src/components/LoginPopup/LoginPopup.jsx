import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currentState, setCurrentState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currentState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success(`Logged in as ${data.email || 'user'}`);
        setShowLogin(false);
      } else {
        toast.error(response.data.message || "Authentication failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error. Try starting your backend.");
    }
  };

  return (
    <div className="login-popup-overlay">
      <form onSubmit={onLogin} className="login-popup-container glass-card animate-fade">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <span className="close-btn" onClick={() => setShowLogin(false)}>✕</span>
        </div>
        
        <div className="login-popup-inputs">
          {currentState === "Login" ? null : (
            <div className="input-group">
              <input
                name="name"
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                placeholder="Your name"
                required
              />
            </div>
          )}
          <div className="input-group">
            <input
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              type="email"
              placeholder="Your email"
              required
            />
          </div>
          <div className="input-group">
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type="password"
              placeholder="Your password"
              required
            />
          </div>
        </div>
        
        <button type="submit" className="submit-btn">
          {currentState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        
        <div className="login-popup-condition">
          <input type="checkbox" required id="agree" />
          <label htmlFor="agree">By continuing, I agree to the terms of use & privacy policy.</label>
        </div>

        {currentState === "Login" ? (
          <p className="toggle-state-text">
            New to BiteBolt?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>Create an account</span>
          </p>
        ) : (
          <p className="toggle-state-text">
            Already have an account?{" "}
            <span onClick={() => setCurrentState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;

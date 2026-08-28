import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Navbar = ({ setShowLogin }) => {
  const { getCartCount, token, setToken, selectedLocation, setSelectedLocation } = useContext(StoreContext);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const navigate = useNavigate();

  const locations = [
    "Connaught Place, Delhi",
    "Jubilee Hills, Hyderabad",
    "Koramangala, Bangalore",
    "Andheri West, Mumbai",
    "Indiranagar, Bangalore",
    "Salt Lake, Kolkata"
  ];

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="navbar glass-card">
      <div className="navbar-left">
        <Link to="/" className="brand-link">
          <span className="brand-logo">⚡</span>
          <span className="brand-name">Bite<span>Bolt</span></span>
        </Link>
        
        <div className="location-container">
          <div className="location-selector" onClick={() => setShowLocationDropdown(!showLocationDropdown)}>
            <span className="pin-icon">📍</span>
            <span className="current-location">{selectedLocation}</span>
            <span className="arrow-down">▼</span>
          </div>
          
          {showLocationDropdown && (
            <ul className="location-dropdown glass-card">
              {locations.map((loc) => (
                <li 
                  key={loc} 
                  onClick={() => {
                    setSelectedLocation(loc);
                    setShowLocationDropdown(false);
                    toast.info(`Location updated to ${loc}`);
                  }}
                  className={selectedLocation === loc ? "active" : ""}
                >
                  {loc}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ul className="navbar-menu">
        <Link to="/">Home</Link>
        <Link to="/search" className="search-nav-link">
          <span className="search-icon-emoji">🔍</span> Search
        </Link>
      </ul>

      <div className="navbar-right">
        <Link to="/cart" className="navbar-cart-container">
          <span className="cart-emoji">🛒</span>
          {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
        </Link>

        {!token ? (
          <button className="sign-in-btn" onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <div className="profile-trigger">
              <img src={assets.profile_icon} alt="Profile" className="profile-pic" />
            </div>
            <ul className="nav-profile-dropdown glass-card">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="" />
                <p>My Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

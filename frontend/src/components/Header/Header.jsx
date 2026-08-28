import React, { useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
    } else {
      navigate("/search");
    }
  };

  return (
    <div className="header glass-card">
      <div className="header-glow"></div>
      <div className="header-contents">
        <span className="header-tagline">🚀 Rapid food delivery</span>
        <h2>Hungry? We've got you covered.</h2>
        <p>
          Discover top-rated restaurants, sweet treats, and local favorites delivered straight to your doorstep with speed and style.
        </p>
        
        <form onSubmit={handleSearchSubmit} className="header-search-bar">
          <span className="search-icon-emoji">🔍</span>
          <input 
            type="text" 
            placeholder="Search for restaurants, cuisines, or dishes..." 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => {
              // Optionally navigate directly if empty, or let them type
            }}
          />
          <button type="submit">Find Food</button>
        </form>

        <div className="header-badges">
          <div className="badge-item">⚡ <span>Super Fast Delivery</span></div>
          <div className="badge-item">🛡️ <span>Safe & Hygienic</span></div>
          <div className="badge-item">📍 <span>Live Order Tracking</span></div>
        </div>
      </div>
    </div>
  );
};

export default Header;

import React, { useContext, useState, useEffect } from "react";
import "./RestaurantDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const RestaurantDisplay = ({ category }) => {
  const { restaurants, fetchRestaurants } = useContext(StoreContext);
  const [vegOnly, setVegOnly] = useState(false);
  const navigate = useNavigate();

  // Reload restaurants when category or veg filter changes
  useEffect(() => {
    fetchRestaurants(category, "", vegOnly);
  }, [category, vegOnly]);

  return (
    <div className="restaurant-display" id="restaurant-display">
      <div className="restaurant-display-header">
        <div className="title-section">
          <h2>Top restaurants near you</h2>
          <p className="subtitle">Discover local hot spots delivering tasty bites straight to you</p>
        </div>
        
        <div className="filters-section">
          <button 
            className={`filter-btn ${vegOnly ? "active" : ""}`}
            onClick={() => setVegOnly(!vegOnly)}
          >
            🟢 Pure Veg
          </button>
        </div>
      </div>

      {restaurants.length === 0 ? (
        <div className="no-restaurants glass-card animate-fade">
          <span className="no-restaurants-emoji">🍽️</span>
          <h3>No restaurants found</h3>
          <p>Try changing your category filter or looking for non-veg options!</p>
        </div>
      ) : (
        <div className="restaurant-grid">
          {restaurants.map((restaurant) => (
            <div 
              key={restaurant._id} 
              className="restaurant-card glass-card"
              onClick={() => navigate(`/restaurant/${restaurant._id}`)}
            >
              <div className="restaurant-card-img-container">
                {/* Dynamically build image URLs pointing to our seeded assets folder on backend */}
                <img 
                  src={`http://localhost:4000/images/${restaurant.image}`} 
                  alt={restaurant.name} 
                  className="restaurant-img"
                  onError={(e) => {
                    // Fallback to placeholder if backend upload isn't working
                    e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600";
                  }}
                />
                {restaurant.promoted && <span className="promoted-badge">Promoted</span>}
                <div className="time-badge">{restaurant.deliveryTime} mins</div>
              </div>

              <div className="restaurant-info">
                <div className="restaurant-info-header">
                  <h3>{restaurant.name}</h3>
                  <div className={`rating-badge ${restaurant.rating >= 4.2 ? "high" : ""}`}>
                    ⭐ {restaurant.rating.toFixed(1)}
                  </div>
                </div>

                <p className="cuisines-list">{restaurant.cuisines.join(", ")}</p>
                
                <div className="restaurant-details-footer">
                  <span className="cost-for-two">₹{restaurant.costForTwo} for two</span>
                  {restaurant.isVeg && <span className="veg-indicator-tag">Veg Only</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantDisplay;

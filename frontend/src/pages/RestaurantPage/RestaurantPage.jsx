import React, { useContext, useEffect, useState } from "react";
import "./RestaurantPage.css";
import { useParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import FoodItem from "../../components/FoodItem/FoodItem";

const RestaurantPage = () => {
  const { id } = useParams();
  const { url, currency, getCartCount, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${url}/api/restaurant/${id}`);
        if (response.data.success) {
          setRestaurant(response.data.data.restaurant);
          setCategories(response.data.data.categories);
          // Set first category active by default
          const keys = Object.keys(response.data.data.categories);
          if (keys.length > 0) {
            setActiveCategory(keys[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching restaurant details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="restaurant-loading">
        <div className="skeleton restaurant-hero-skeleton"></div>
        <div className="skeleton category-tabs-skeleton"></div>
        <div className="skeleton menu-item-skeleton"></div>
        <div className="skeleton menu-item-skeleton"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="restaurant-not-found glass-card">
        <h2>Restaurant not found</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="restaurant-page animate-fade">
      {/* Restaurant Header Hero */}
      <div className="restaurant-hero glass-card">
        <div className="hero-left">
          <span className="hero-veg-only">{restaurant.isVeg ? "🟢 Pure Veg" : ""}</span>
          <h1>{restaurant.name}</h1>
          <p className="hero-cuisines">{restaurant.cuisines.join(", ")}</p>
          <p className="hero-address">📍 {restaurant.address}</p>
          
          <div className="hero-stats">
            <div className="stat-box">
              <span className="stat-label">Rating</span>
              <span className="stat-value">⭐ {restaurant.rating.toFixed(1)}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Delivery Time</span>
              <span className="stat-value">🕒 {restaurant.deliveryTime} mins</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Cost For Two</span>
              <span className="stat-value">₹{restaurant.costForTwo}</span>
            </div>
          </div>
        </div>
        
        <div className="hero-right">
          <img 
            src={`${url}/images/${restaurant.image}`} 
            alt={restaurant.name} 
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600";
            }}
          />
        </div>
      </div>

      {/* Category Selection Tabs */}
      <div className="menu-container">
        <div className="category-sidebar">
          <h3>Menu Categories</h3>
          <div className="category-list">
            {Object.keys(categories).map((catName) => (
              <button 
                key={catName}
                className={`category-tab-btn ${activeCategory === catName ? "active" : ""}`}
                onClick={() => {
                  setActiveCategory(catName);
                  document.getElementById(catName)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                {catName} <span>({categories[catName].length})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items List */}
        <div className="menu-items-section">
          {Object.keys(categories).map((catName) => (
            <div key={catName} id={catName} className="menu-category-group">
              <h2 className="category-title">{catName}</h2>
              <div className="category-items-list">
                {categories[catName].map((dish) => (
                  <FoodItem 
                    key={dish._id}
                    id={dish._id}
                    name={dish.name}
                    price={dish.price}
                    description={dish.description}
                    image={dish.image}
                    isVeg={dish.isVeg}
                    isBestseller={dish.isBestseller}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Cart Banner */}
      {getCartCount() > 0 && (
        <div className="sticky-cart-banner animate-fade">
          <div className="banner-left">
            <span className="item-count">{getCartCount()} Item{getCartCount() > 1 ? "s" : ""}</span>
            <span className="divider-dot">•</span>
            <span className="cart-total">{currency}{getTotalCartAmount()}</span>
          </div>
          <button className="view-cart-btn" onClick={() => navigate("/cart")}>
            View Cart 🛒
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantPage;

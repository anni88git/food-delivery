import React, { useContext, useState, useEffect } from "react";
import "./SearchPage.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const { url, currency } = useContext(StoreContext);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ restaurants: [], dishes: [] });
  const [loading, setLoading] = useState(false);

  // Popular search items
  const popularSearches = ["Biryani", "Burger", "Pizza", "Dosa", "Desserts", "Momo"];

  useEffect(() => {
    if (!query.trim()) {
      setResults({ restaurants: [], dishes: [] });
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${url}/api/restaurant/search?q=${encodeURIComponent(query)}`);
        if (response.data.success) {
          setResults(response.data.data);
        }
      } catch (err) {
        console.error("Error searching:", err);
      } finally {
        setLoading(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="search-page animate-fade">
      {/* Search Input Box */}
      <div className="search-header glass-card">
        <span className="search-emoji">🔍</span>
        <input 
          type="text" 
          placeholder="Search for restaurants, cuisines, or dishes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <button className="clear-btn" onClick={() => setQuery("")}>✕</button>
        )}
      </div>

      {/* Popular Suggestions */}
      {!query && (
        <div className="popular-suggestions">
          <h3>Popular Cuisines</h3>
          <div className="suggestion-tags">
            {popularSearches.map((term) => (
              <button key={term} onClick={() => setQuery(term)}>
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loader */}
      {loading && (
        <div className="search-loader">
          <div className="skeleton search-item-skeleton"></div>
          <div className="skeleton search-item-skeleton"></div>
        </div>
      )}

      {/* Results Section */}
      {query && !loading && (
        <div className="search-results-container">
          {/* Restaurants Results */}
          {results.restaurants.length > 0 && (
            <div className="result-section">
              <h2>Restaurants</h2>
              <div className="restaurant-result-list">
                {results.restaurants.map((res) => (
                  <div 
                    key={res._id}
                    className="restaurant-result-item glass-card"
                    onClick={() => navigate(`/restaurant/${res._id}`)}
                  >
                    <img 
                      src={`${url}/images/${res.image}`} 
                      alt={res.name}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600";
                      }}
                    />
                    <div className="info">
                      <h3>{res.name}</h3>
                      <p>{res.cuisines.join(", ")}</p>
                      <div className="meta">
                        <span>⭐ {res.rating.toFixed(1)}</span>
                        <span>•</span>
                        <span>🕒 {res.deliveryTime} mins</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dishes Results */}
          {results.dishes.length > 0 && (
            <div className="result-section">
              <h2>Dishes</h2>
              <div className="dishes-result-list">
                {results.dishes.map((dish) => (
                  <div 
                    key={dish._id}
                    className="dish-result-item glass-card"
                    onClick={() => navigate(`/restaurant/${dish.restaurantId}`)}
                  >
                    <div className="dish-info-left">
                      <div className="indicators">
                        <span className={dish.isVeg ? "badge-veg" : "badge-nonveg"}></span>
                      </div>
                      <h3>{dish.name}</h3>
                      <p className="price">{currency}{dish.price}</p>
                      <p className="desc">{dish.description}</p>
                      {dish.restaurant && (
                        <p className="restaurant-ref">
                          From <span>{dish.restaurant.name}</span>
                        </p>
                      )}
                    </div>
                    <div className="dish-img-right">
                      <img 
                        src={`${url}/images/${dish.image}`} 
                        alt={dish.name}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300";
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty Results State */}
          {results.restaurants.length === 0 && results.dishes.length === 0 && (
            <div className="empty-search glass-card">
              <span className="sad-emoji">😔</span>
              <h3>No results matching "{query}"</h3>
              <p>Try checking your spelling or looking for other cuisines.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;

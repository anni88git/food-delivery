import React, { useContext } from "react";
import "./FoodItem.css";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image, isVeg, isBestseller }) => {
  const { cartItems, addToCart, removeFromCart, url, currency } = useContext(StoreContext);

  const quantity = cartItems[id] || 0;

  return (
    <div className="food-item-row animate-fade">
      <div className="food-item-left">
        <div className="indicators">
          <span className={isVeg ? "badge-veg" : "badge-nonveg"} title={isVeg ? "Veg" : "Non-Veg"}></span>
          {isBestseller && <span className="bestseller-tag">★ Bestseller</span>}
        </div>
        <h3 className="food-item-name">{name}</h3>
        <p className="food-item-price">{currency}{price}</p>
        <p className="food-item-desc">{description}</p>
      </div>

      <div className="food-item-right">
        <div className="food-item-img-box">
          <img 
            src={`${url}/images/${image}`} 
            alt={name} 
            className="food-item-img"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300";
            }}
          />
          
          <div className="add-btn-container">
            {quantity === 0 ? (
              <button className="add-btn" onClick={() => addToCart(id)}>
                ADD <span className="plus">+</span>
              </button>
            ) : (
              <div className="item-counter">
                <span className="counter-btn minus" onClick={() => removeFromCart(id)}>−</span>
                <span className="counter-val">{quantity}</span>
                <span className="counter-btn plus" onClick={() => addToCart(id)}>+</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;

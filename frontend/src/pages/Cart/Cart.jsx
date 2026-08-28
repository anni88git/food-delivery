import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getCartRestaurant,
    currency,
    url
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const cartRestaurant = getCartRestaurant();

  const handleCheckout = () => {
    if (getTotalCartAmount() === 0) return;
    navigate('/order');
  };

  return (
    <div className="cart-page animate-fade">
      {/* Active Restaurant Header if items present */}
      {cartRestaurant && (
        <div className="cart-restaurant-header glass-card">
          <span className="info-tag">Ordering from</span>
          <h2>{cartRestaurant.name}</h2>
          <p>📍 {cartRestaurant.address}</p>
        </div>
      )}

      <div className="cart-container">
        {/* Cart Items List */}
        <div className="cart-items-panel glass-card">
          <div className="cart-header-row">
            <span>Dish</span>
            <span className="align-center">Quantity</span>
            <span className="align-right">Price</span>
          </div>
          <hr />
          
          {getTotalCartAmount() === 0 ? (
            <div className="empty-cart-state">
              <span className="cart-empty-emoji">🛒</span>
              <h3>Your cart is empty</h3>
              <p>Add some delicious dishes to satisfy your hunger cravings!</p>
              <button onClick={() => navigate("/")}>Browse Restaurants</button>
            </div>
          ) : (
            <div className="cart-items-list">
              {food_list.map((item) => {
                const quantity = cartItems[item._id] || 0;
                if (quantity > 0) {
                  return (
                    <div key={item._id} className="cart-item-row">
                      <div className="item-meta">
                        <img 
                          src={`${url}/images/${item.image}`} 
                          alt={item.name}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300";
                          }}
                        />
                        <div className="name-box">
                          <span className={item.isVeg ? "badge-veg" : "badge-nonveg"}></span>
                          <h4>{item.name}</h4>
                        </div>
                      </div>

                      <div className="item-controls">
                        <span className="control-btn minus" onClick={() => removeFromCart(item._id)}>−</span>
                        <span className="val">{quantity}</span>
                        <span className="control-btn plus" onClick={() => addToCart(item._id)}>+</span>
                      </div>

                      <span className="item-total-price align-right">
                        {currency}{item.price * quantity}
                      </span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>

        {/* Cart Calculations Sidebar */}
        {getTotalCartAmount() > 0 && (
          <div className="cart-summary-sidebar">
            {/* Promo code */}
            <div className="promo-card glass-card">
              <p>Have a promo code?</p>
              <div className="promo-input-box">
                <input type="text" placeholder="Enter coupon code" />
                <button>Apply</button>
              </div>
            </div>

            {/* Bill Details */}
            <div className="bill-card glass-card">
              <h3>Bill Details</h3>
              <div className="bill-row">
                <span>Item Total</span>
                <span>{currency}{getTotalCartAmount()}</span>
              </div>
              <div className="bill-row">
                <span>Delivery Partner Fee</span>
                <span>{currency}20</span>
              </div>
              <div className="bill-row">
                <span>Platform Fee</span>
                <span>{currency}2</span>
              </div>
              <hr />
              <div className="bill-row total">
                <b>To Pay</b>
                <b>{currency}{getTotalCartAmount() + 22}</b>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>
                PROCEED TO CHECKOUT ➔
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

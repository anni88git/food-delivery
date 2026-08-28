import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const navigate = useNavigate();

  const { getTotalCartAmount, token, food_list, cartItems, getCartRestaurant, url, currency } =
    useContext(StoreContext);
    
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "India",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    
    const cartRestaurant = getCartRestaurant();
    const orderItems = [];
    
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item };
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    if (orderItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 22, // matching delivery/platform fee in cart
      paymentMethod,
      restaurantId: cartRestaurant?._id || null,
      restaurantName: cartRestaurant?.name || "",
    };
    
    try {
      const response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
      if (response.data.success) {
        const { orderId } = response.data;
        toast.success("Order Placed Successfully!");
        navigate(`/tracking/${orderId}`);
      } else {
        toast.error("Failed to place order.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network Error! Order placing failed.");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login to proceed to checkout");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      toast.error("Add items to your cart first");
      navigate("/");
    }
  }, [token]);

  return (
    <form className="place-order" onSubmit={handlePlaceOrder}>
      {/* Left Column: Delivery Address Form */}
      <div className="place-order-left glass-card animate-fade">
        <h3 className="title">Delivery Information</h3>
        
        <div className="multi-fields">
          <input
            required
            name="firstName"
            value={data.firstName}
            onChange={onChangeHandler}
            type="text"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            value={data.lastName}
            onChange={onChangeHandler}
            type="text"
            placeholder="Last name"
          />
        </div>
        
        <input
          required
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          type="email"
          placeholder="Email Address"
        />
        
        <input
          required
          name="street"
          value={data.street}
          onChange={onChangeHandler}
          type="text"
          placeholder="Street/Address details"
        />
        
        <div className="multi-fields">
          <input
            required
            name="city"
            value={data.city}
            onChange={onChangeHandler}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            value={data.state}
            onChange={onChangeHandler}
            type="text"
            placeholder="State"
          />
        </div>
        
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            value={data.zipcode}
            onChange={onChangeHandler}
            type="text"
            placeholder="Zip Code"
          />
          <input
            required
            name="country"
            value={data.country}
            onChange={onChangeHandler}
            type="text"
            placeholder="Country"
          />
        </div>
        
        <input
          required
          name="phone"
          value={data.phone}
          onChange={onChangeHandler}
          type="text"
          placeholder="Phone"
        />
      </div>

      {/* Right Column: Checkout Summary & Payment Options */}
      <div className="place-order-right">
        {/* Payment Methods */}
        <div className="payment-card glass-card">
          <h3>Payment Method</h3>
          <div className="payment-options">
            <label className={`pay-option ${paymentMethod === "COD" ? "selected" : ""}`}>
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === "COD"} 
                onChange={() => setPaymentMethod("COD")}
              />
              <span className="pay-emoji">💵</span>
              <div className="details">
                <b>Cash on Delivery (COD)</b>
                <p>Pay cash or scan QR code on delivery</p>
              </div>
            </label>
            
            <label className={`pay-option ${paymentMethod === "ONLINE" ? "selected" : ""}`}>
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === "ONLINE"} 
                onChange={() => setPaymentMethod("ONLINE")}
              />
              <span className="pay-emoji">💳</span>
              <div className="details">
                <b>Simulated Pay Online</b>
                <p>Instant checkout mockup (auto succeeds)</p>
              </div>
            </label>
          </div>
        </div>

        {/* Totals */}
        <div className="cart-total glass-card">
          <h2>Order Summary</h2>
          <hr />
          <div className="total-details-block">
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{currency}{getTotalCartAmount()}</p>
            </div>
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{currency}20</p>
            </div>
            <div className="cart-total-details">
              <p>Platform Fee</p>
              <p>{currency}2</p>
            </div>
            <hr />
            <div className="cart-total-details total-row">
              <b>To Pay</b>
              <b>{currency}{getTotalCartAmount() + 22}</b>
            </div>
          </div>
          
          <button type="submit" className="place-btn">
            CONFIRM & PLACE ORDER ➔
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

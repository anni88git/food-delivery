import React, { useContext, useEffect, useState } from "react";
import "./OrderTracking.css";
import { useParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const OrderTracking = () => {
  const { orderId } = useParams();
  const { url, currency } = useContext(StoreContext);
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const STATUS_STEPS = [
    { title: "Order Placed", desc: "We have received your order" },
    { title: "Order Confirmed", desc: "Restaurant has accepted your order" },
    { title: "Preparing Your Food", desc: "Chef is preparing your delicious meal" },
    { title: "Out for Delivery", desc: "Delivery partner is carrying your meal" },
    { title: "Delivered", desc: "Enjoy your food!" }
  ];

  const fetchTracking = async () => {
    try {
      const response = await axios.get(`${url}/api/order/track/${orderId}`);
      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching order tracking:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
    // Poll every 8 seconds to get the auto-progressing state updates
    const interval = setInterval(fetchTracking, 8000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="tracking-loading">
        <div className="skeleton title-skeleton"></div>
        <div className="skeleton card-skeleton"></div>
        <div className="skeleton timeline-skeleton"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="tracking-not-found glass-card">
        <h2>Order not found</h2>
        <p>We couldn't locate this order in our system.</p>
        <button onClick={() => navigate("/myorders")}>Go to Orders</button>
      </div>
    );
  }

  // Get index of current status
  const currentStatusIndex = STATUS_STEPS.findIndex(
    (step) => step.title.toLowerCase() === order.status.toLowerCase()
  );

  return (
    <div className="order-tracking-page animate-fade">
      <div className="tracking-header">
        <h2>Track Your Order</h2>
        <p className="order-id-label">ID: #{order._id}</p>
      </div>

      <div className="tracking-grid">
        {/* Left Side: Status Timeline */}
        <div className="timeline-card glass-card">
          <h3>Order Progress</h3>
          <div className="vertical-timeline">
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index < currentStatusIndex;
              const isActive = index === currentStatusIndex;
              const isFuture = index > currentStatusIndex;

              // Check if status history contains this step to display actual timestamp
              const historyItem = order.statusHistory?.find(
                (h) => h.status.toLowerCase() === step.title.toLowerCase()
              );
              
              const timestamp = historyItem 
                ? new Date(historyItem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : null;

              return (
                <div 
                  key={step.title} 
                  className={`timeline-step ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""} ${isFuture ? "future" : ""}`}
                >
                  <div className="step-indicator">
                    <div className="circle-dot">
                      {isCompleted && "✓"}
                      {isActive && <span className="pulsing-core"></span>}
                    </div>
                    {index < STATUS_STEPS.length - 1 && <div className="connector-line"></div>}
                  </div>
                  
                  <div className="step-content">
                    <div className="step-title-row">
                      <h4>{step.title}</h4>
                      {timestamp && <span className="step-time">{timestamp}</span>}
                    </div>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Delivery Partner & Summary */}
        <div className="tracking-details-panel">
          {/* Delivery Partner */}
          {order.status !== "Delivered" && (
            <div className="delivery-card glass-card">
              <div className="partner-avatar">🛵</div>
              <div className="partner-info">
                <span>Your Delivery Partner</span>
                <h4>{order.deliveryPartner || "Assigning..."}</h4>
                <p>ETA: {order.estimatedDelivery} mins</p>
              </div>
              <button 
                className="call-partner-btn" 
                onClick={() => alert(`Calling ${order.deliveryPartner}... (Simulated)`)}
              >
                📞 Call
              </button>
            </div>
          )}

          {/* Order Details summary */}
          <div className="order-summary-card glass-card">
            <h3>Order Details</h3>
            <p className="restaurant-name">📍 {order.restaurantName || "Restaurant"}</p>
            <hr />
            <div className="items-list-summary">
              {order.items.map((item) => (
                <div key={item._id} className="summary-item-row">
                  <span>{item.name} <b>x{item.quantity}</b></span>
                  <span>{currency}{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <hr />
            <div className="summary-bill">
              <div className="bill-row">
                <span>Subtotal</span>
                <span>{currency}{order.amount - 2}</span>
              </div>
              <div className="bill-row">
                <span>Delivery Partner Fee</span>
                <span>{currency}2</span>
              </div>
              <div className="bill-row total">
                <b>Total Amount</b>
                <b>{currency}{order.amount}</b>
              </div>
            </div>
            <hr />
            <div className="delivery-address-summary">
              <h5>Delivery Address:</h5>
              <p>{order.address.street}, {order.address.city}, {order.address.state}</p>
              <p>Phone: {order.address.phone}</p>
            </div>
            <button className="back-orders-btn" onClick={() => navigate("/myorders")}>
              View All Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

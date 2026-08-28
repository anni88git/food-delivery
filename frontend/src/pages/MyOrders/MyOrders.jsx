import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { url, token, currency } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "order placed": return "status-placed";
      case "order confirmed": return "status-confirmed";
      case "preparing your food": return "status-preparing";
      case "out for delivery": return "status-delivery";
      case "delivered": return "status-delivered";
      default: return "status-default";
    }
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="skeleton title-skeleton"></div>
        <div className="skeleton order-card-skeleton"></div>
        <div className="skeleton order-card-skeleton"></div>
      </div>
    );
  }

  return (
    <div className="my-orders-page animate-fade">
      <div className="orders-header">
        <h2>My Orders</h2>
        <p>View history and track your active deliveries</p>
      </div>

      {data.length === 0 ? (
        <div className="no-orders-state glass-card">
          <span className="orders-empty-emoji">📦</span>
          <h3>No orders placed yet</h3>
          <p>Hungry? Place your first order with BiteBolt now!</p>
          <button onClick={() => navigate("/")}>Order Food</button>
        </div>
      ) : (
        <div className="orders-list-container">
          {data.map((order, index) => {
            const formattedDate = new Date(order.date).toLocaleDateString([], {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div key={order._id || index} className="order-history-card glass-card">
                <div className="order-card-header">
                  <div className="rest-meta">
                    <h4>{order.restaurantName || "BiteBolt Restaurant"}</h4>
                    <span className="order-date">{formattedDate}</span>
                  </div>
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    ● {order.status}
                  </span>
                </div>

                <div className="order-card-body">
                  <div className="items-summary">
                    <p className="summary-title">Items Ordered:</p>
                    <p className="summary-text">
                      {order.items.map((item, idx) => (
                        <span key={item._id || idx}>
                          {item.name} <b>x{item.quantity}</b>
                          {idx < order.items.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                  </div>

                  <div className="order-price-details">
                    <span>Total Amount</span>
                    <h4>{currency}{order.amount}</h4>
                  </div>
                </div>

                <div className="order-card-footer">
                  <span className="items-count-badge">{order.items.length} Item{order.items.length > 1 ? "s" : ""}</span>
                  <div className="footer-actions">
                    <button 
                      className="track-btn" 
                      onClick={() => navigate(`/tracking/${order._id}`)}
                    >
                      Track Order 🛵
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;

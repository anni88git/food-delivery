import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import RestaurantPage from "./pages/RestaurantPage/RestaurantPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import OrderTracking from "./pages/OrderTracking/OrderTracking";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  
  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <ToastContainer theme="dark" position="bottom-right" />
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/tracking/:orderId" element={<OrderTracking />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;

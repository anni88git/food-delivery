import React from "react";
import "./Footer.css";
import { assets } from "../../assets/frontend_assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <div className="brand-logo-footer">
            <span className="brand-emoji">⚡</span>
            <h2>Bite<span>Bolt</span></h2>
          </div>
          <p>
            Experience lightning-fast deliveries from the finest local dining establishments. We bring gourmet flavors directly to your home.
          </p>
          <div className="footer-social-icons">
            <span className="social-icon">🔵</span>
            <span className="social-icon">🐤</span>
            <span className="social-icon">💼</span>
          </div>
        </div>
        
        <div className="footer-content-center">
          <h3>Company</h3>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery Info</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        
        <div className="footer-content-right">
          <h3>Get in touch</h3>
          <ul>
            <li>+91-98765-43210</li>
            <li>support@bitebolt.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        © {new Date().getFullYear()} BiteBolt.com - All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;

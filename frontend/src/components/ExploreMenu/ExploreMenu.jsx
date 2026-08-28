import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/frontend_assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <div className="explore-menu-header">
        <h2>What's on your mind?</h2>
        <p className="explore-menu-text">
          Choose from a diverse range of categories featuring delicious meals crafted by top chefs.
        </p>
      </div>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          const isActive = category === item.menu_name;
          return (
            <div 
              onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} 
              key={index} 
              className={`explore-menu-list-item ${isActive ? "active" : ""}`}
            >
              <div className="img-wrapper">
                <img src={item.menu_image} alt={item.menu_name} />
              </div>
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr className="divider" />
    </div>
  );
};

export default ExploreMenu;

import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [restaurants, setRestaurants] = useState([]);
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Connaught Place, Delhi");
  
  // Always run local backend
  const url = "http://localhost:4000";
  const currency = "₹";

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      try {
        const response = await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
        if (response.data.success) {
          toast.success("Item added to cart");
        } else {
          toast.error("Something went wrong");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to sync cart with server");
      }
    }
  };

  const removeFromCart = async (itemId) => {
    if (cartItems[itemId] > 0) {
      setCartItems((prev) => {
        const updated = { ...prev, [itemId]: prev[itemId] - 1 };
        if (updated[itemId] === 0) {
          delete updated[itemId];
        }
        return updated;
      });
      if (token) {
        try {
          const response = await axios.post(
            url + "/api/cart/remove",
            { itemId },
            { headers: { token } }
          );
          if (response.data.success) {
            toast.success("Item removed from cart");
          } else {
            toast.error("Something went wrong");
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to sync cart with server");
        }
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalCount += cartItems[item];
      }
    }
    return totalCount;
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      if (response.data.success) {
        setFoodList(response.data.data);
      } else {
        toast.error("Error! Products not fetching.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRestaurants = async (cuisine = "All", search = "", vegOnly = false) => {
    try {
      let queryUrl = `${url}/api/restaurant/list?`;
      if (cuisine && cuisine !== "All") queryUrl += `cuisine=${cuisine}&`;
      if (search) queryUrl += `search=${search}&`;
      if (vegOnly) queryUrl += `vegOnly=true&`;
      
      const response = await axios.get(queryUrl);
      if (response.data.success) {
        setRestaurants(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const loadCartData = async (tokenStr) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token: tokenStr } }
      );
      if (response.data.success && response.data.cartData) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const getCartRestaurant = () => {
    // Return restaurant info of items in cart (all items in a single order should ideally belong to one restaurant)
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const foodItem = food_list.find((f) => f._id === item);
        if (foodItem) {
          return restaurants.find((r) => r._id === foodItem.restaurantId);
        }
      }
    }
    return null;
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      await fetchRestaurants();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    url,
    currency,
    token,
    setToken,
    food_list,
    restaurants,
    fetchRestaurants,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getCartCount,
    getCartRestaurant,
    searchQuery,
    setSearchQuery,
    selectedLocation,
    setSelectedLocation,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

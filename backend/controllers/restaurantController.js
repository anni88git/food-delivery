import restaurantModel from "../models/restaurantModel.js";
import foodModel from "../models/foodModel.js";

// List all restaurants with optional filters
const listRestaurants = async (req, res) => {
  try {
    const { cuisine, search, vegOnly } = req.query;
    let filter = {};

    if (cuisine && cuisine !== "All") {
      filter.cuisines = { $in: [cuisine] };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { cuisines: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }

    if (vegOnly === "true") {
      filter.isVeg = true;
    }

    const restaurants = await restaurantModel.find(filter).sort({ promoted: -1, rating: -1 });
    res.json({ success: true, data: restaurants });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching restaurants" });
  }
};

// Get single restaurant with its menu
const getRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantModel.findById(req.params.id);
    if (!restaurant) {
      return res.json({ success: false, message: "Restaurant not found" });
    }

    const menu = await foodModel.find({ restaurantId: req.params.id });

    // Group menu by category
    const categories = {};
    menu.forEach((item) => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });

    res.json({
      success: true,
      data: {
        restaurant,
        menu,
        categories,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching restaurant" });
  }
};

// Search restaurants and dishes
const searchAll = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ success: true, data: { restaurants: [], dishes: [] } });
    }

    const restaurants = await restaurantModel.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { cuisines: { $elemMatch: { $regex: q, $options: "i" } } },
      ],
    }).limit(10);

    const dishes = await foodModel.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    }).limit(15);

    // Get restaurant info for each dish
    const dishRestaurantIds = [...new Set(dishes.map(d => d.restaurantId.toString()))];
    const dishRestaurants = await restaurantModel.find({ _id: { $in: dishRestaurantIds } });
    const restaurantMap = {};
    dishRestaurants.forEach(r => { restaurantMap[r._id.toString()] = r; });

    const dishesWithRestaurant = dishes.map(d => ({
      ...d.toObject(),
      restaurant: restaurantMap[d.restaurantId.toString()] || null,
    }));

    res.json({
      success: true,
      data: { restaurants, dishes: dishesWithRestaurant },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error searching" });
  }
};

export { listRestaurants, getRestaurant, searchAll };

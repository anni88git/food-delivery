import mongoose from "mongoose";
import "dotenv/config";
import restaurantModel from "./models/restaurantModel.js";
import foodModel from "./models/foodModel.js";

const MONGO_URL = process.env.MONGO_URL;

const restaurants = [
  {
    name: "Paradise Biryani",
    image: "food_1.png",
    cuisines: ["Biryani", "North Indian", "Mughlai"],
    rating: 4.3,
    deliveryTime: 35,
    costForTwo: 500,
    isVeg: false,
    address: "Jubilee Hills, Hyderabad",
    promoted: true,
    totalRatings: "10K+",
  },
  {
    name: "Barbeque Nation",
    image: "food_4.png",
    cuisines: ["North Indian", "BBQ", "Kebabs"],
    rating: 4.1,
    deliveryTime: 40,
    costForTwo: 800,
    isVeg: false,
    address: "Koramangala, Bangalore",
    promoted: true,
    totalRatings: "5K+",
  },
  {
    name: "Haldiram's",
    image: "food_21.png",
    cuisines: ["North Indian", "Street Food", "Sweets"],
    rating: 4.2,
    deliveryTime: 25,
    costForTwo: 350,
    isVeg: true,
    address: "Connaught Place, Delhi",
    promoted: false,
    totalRatings: "15K+",
  },
  {
    name: "Pizza Planet",
    image: "food_15.png",
    cuisines: ["Pizza", "Italian", "Pasta"],
    rating: 4.0,
    deliveryTime: 30,
    costForTwo: 450,
    isVeg: false,
    address: "MG Road, Pune",
    promoted: true,
    totalRatings: "8K+",
  },
  {
    name: "Burger Barn",
    image: "food_16.png",
    cuisines: ["Burger", "American", "Fast Food"],
    rating: 4.4,
    deliveryTime: 20,
    costForTwo: 400,
    isVeg: false,
    address: "Andheri West, Mumbai",
    promoted: false,
    totalRatings: "12K+",
  },
  {
    name: "Theobroma",
    image: "food_17.png",
    cuisines: ["Desserts", "Bakery", "Beverages"],
    rating: 4.5,
    deliveryTime: 30,
    costForTwo: 500,
    isVeg: true,
    address: "Linking Road, Mumbai",
    promoted: true,
    totalRatings: "20K+",
  },
  {
    name: "Dosa Plaza",
    image: "food_23.png",
    cuisines: ["South Indian", "Street Food"],
    rating: 4.1,
    deliveryTime: 25,
    costForTwo: 300,
    isVeg: true,
    address: "T Nagar, Chennai",
    promoted: false,
    totalRatings: "7K+",
  },
  {
    name: "Dragon Wok",
    image: "food_31.png",
    cuisines: ["Chinese", "Thai", "Asian"],
    rating: 4.0,
    deliveryTime: 35,
    costForTwo: 450,
    isVeg: false,
    address: "Salt Lake, Kolkata",
    promoted: false,
    totalRatings: "3K+",
  },
  {
    name: "Punjabi Tadka",
    image: "food_8.png",
    cuisines: ["North Indian", "Punjabi", "Mughlai"],
    rating: 4.2,
    deliveryTime: 30,
    costForTwo: 400,
    isVeg: false,
    address: "Sector 17, Chandigarh",
    promoted: false,
    totalRatings: "6K+",
  },
  {
    name: "Momo Central",
    image: "food_6.png",
    cuisines: ["Street Food", "Chinese", "Tibetan"],
    rating: 4.3,
    deliveryTime: 20,
    costForTwo: 250,
    isVeg: false,
    address: "Majnu Ka Tilla, Delhi",
    promoted: true,
    totalRatings: "4K+",
  },
  {
    name: "Café Mocha",
    image: "food_19.png",
    cuisines: ["Beverages", "Desserts", "Snacks"],
    rating: 4.4,
    deliveryTime: 25,
    costForTwo: 500,
    isVeg: true,
    address: "Indiranagar, Bangalore",
    promoted: false,
    totalRatings: "9K+",
  },
  {
    name: "Royal Kebab House",
    image: "food_7.png",
    cuisines: ["Kebabs", "Mughlai", "North Indian"],
    rating: 4.1,
    deliveryTime: 35,
    costForTwo: 600,
    isVeg: false,
    address: "Charbagh, Lucknow",
    promoted: false,
    totalRatings: "2K+",
  },
];

// Menu items per restaurant (index maps to restaurants array)
const menuItemsByRestaurant = [
  // 0: Paradise Biryani
  [
    { name: "Hyderabadi Chicken Dum Biryani", description: "Slow-cooked basmati rice layered with tender marinated chicken, saffron, and aromatic spices. Served with raita and salan.", price: 320, image: "food_1.png", category: "Biryani", isVeg: false, isBestseller: true },
    { name: "Mutton Biryani", description: "Premium goat meat cooked with aged basmati rice, whole spices, and caramelized onions in the traditional dum style.", price: 420, image: "food_2.png", category: "Biryani", isVeg: false, isBestseller: true },
    { name: "Veg Dum Biryani", description: "Fragrant basmati rice with seasonal vegetables, paneer, and a blend of biriyani spices cooked in dum style.", price: 240, image: "food_3.png", category: "Biryani", isVeg: true, isBestseller: false },
    { name: "Chicken 65", description: "Crispy deep-fried chicken bites tossed in a fiery red chili sauce with curry leaves and garlic.", price: 280, image: "food_4.png", category: "Starters", isVeg: false, isBestseller: true },
    { name: "Double Ka Meetha", description: "Classic Hyderabadi dessert — bread slices soaked in sweetened milk, garnished with nuts and saffron.", price: 120, image: "food_9.png", category: "Desserts", isVeg: true, isBestseller: false },
  ],
  // 1: Barbeque Nation
  [
    { name: "Tandoori Chicken", description: "Juicy whole chicken leg marinated in yogurt, kashmiri chili, and tandoori spices, chargrilled to perfection.", price: 380, image: "food_4.png", category: "Starters", isVeg: false, isBestseller: true },
    { name: "Paneer Tikka", description: "Chunks of cottage cheese marinated in hung curd and spices, grilled in a clay oven until smoky and charred.", price: 280, image: "food_21.png", category: "Starters", isVeg: true, isBestseller: true },
    { name: "Seekh Kebab", description: "Minced lamb mixed with fresh herbs, ginger, and green chilies, shaped on skewers and grilled over charcoal.", price: 340, image: "food_7.png", category: "Kebabs", isVeg: false, isBestseller: false },
    { name: "Veg Galouti Kebab", description: "Melt-in-mouth vegetarian kebabs made with raw banana, cashew, and aromatic Lucknowi spices.", price: 260, image: "food_22.png", category: "Kebabs", isVeg: true, isBestseller: false },
    { name: "Dal Makhani", description: "Creamy black lentils slow-cooked overnight with butter, cream, and a touch of kasuri methi.", price: 240, image: "food_23.png", category: "Main Course", isVeg: true, isBestseller: true },
  ],
  // 2: Haldiram's
  [
    { name: "Chole Bhature", description: "Fluffy deep-fried bread served with spicy chickpea curry, pickled onion, and green chutney.", price: 160, image: "food_8.png", category: "Street Food", isVeg: true, isBestseller: true },
    { name: "Pani Puri (6 pcs)", description: "Crispy hollow puris filled with spiced potato, chickpeas, and tangy tamarind-mint water.", price: 80, image: "food_5.png", category: "Street Food", isVeg: true, isBestseller: true },
    { name: "Raj Kachori", description: "Giant crispy kachori filled with yogurt, chutneys, sprouts, and crunchy sev.", price: 120, image: "food_6.png", category: "Street Food", isVeg: true, isBestseller: false },
    { name: "Gulab Jamun (2 pcs)", description: "Soft, spongy milk-solid dumplings soaked in rose-cardamom flavored sugar syrup.", price: 90, image: "food_9.png", category: "Sweets", isVeg: true, isBestseller: true },
    { name: "Aloo Tikki Chaat", description: "Crispy potato patties topped with yogurt, green and tamarind chutney, pomegranate, and sev.", price: 110, image: "food_24.png", category: "Street Food", isVeg: true, isBestseller: false },
  ],
  // 3: Pizza Planet
  [
    { name: "Margherita Pizza", description: "Classic Italian pizza with San Marzano tomato sauce, fresh mozzarella, basil on a thin crust.", price: 249, image: "food_13.png", category: "Pizza", isVeg: true, isBestseller: true },
    { name: "Pepperoni Feast", description: "Loaded with double pepperoni, mozzarella, and oregano on our signature hand-tossed dough.", price: 399, image: "food_14.png", category: "Pizza", isVeg: false, isBestseller: true },
    { name: "Farmhouse Pizza", description: "Garden-fresh capsicum, onion, tomato, and mushroom with mozzarella on a crispy thin crust.", price: 329, image: "food_15.png", category: "Pizza", isVeg: true, isBestseller: false },
    { name: "Penne Arrabbiata", description: "Penne pasta tossed in a spicy tomato sauce with garlic, red chili flakes, and fresh basil.", price: 259, image: "food_25.png", category: "Pasta", isVeg: true, isBestseller: false },
    { name: "Chicken Alfredo Pasta", description: "Creamy white sauce pasta with grilled chicken, parmesan, mushrooms, and a hint of garlic.", price: 329, image: "food_28.png", category: "Pasta", isVeg: false, isBestseller: true },
  ],
  // 4: Burger Barn
  [
    { name: "Classic Smash Burger", description: "Double smashed beef patties with American cheese, caramelized onions, pickles, and secret sauce.", price: 249, image: "food_16.png", category: "Burgers", isVeg: false, isBestseller: true },
    { name: "Crispy Chicken Burger", description: "Buttermilk-fried chicken thigh with spicy mayo, coleslaw, and pickled jalapeños on a brioche bun.", price: 219, image: "food_13.png", category: "Burgers", isVeg: false, isBestseller: true },
    { name: "Veg Crunch Burger", description: "Crispy vegetable patty with lettuce, tomato, onion rings, and chipotle sauce.", price: 179, image: "food_14.png", category: "Burgers", isVeg: true, isBestseller: false },
    { name: "Loaded Fries", description: "Golden crispy fries topped with melted cheese, jalapeños, sour cream, and bacon bits.", price: 159, image: "food_24.png", category: "Sides", isVeg: false, isBestseller: false },
    { name: "Oreo Milkshake", description: "Thick and creamy milkshake blended with Oreo cookies, vanilla ice cream, and whipped cream.", price: 149, image: "food_12.png", category: "Beverages", isVeg: true, isBestseller: true },
  ],
  // 5: Theobroma
  [
    { name: "Chocolate Truffle Cake (Slice)", description: "Rich, dense chocolate cake layered with dark chocolate ganache and a dusting of cocoa powder.", price: 180, image: "food_17.png", category: "Cakes", isVeg: true, isBestseller: true },
    { name: "Red Velvet Cake (Slice)", description: "Velvety smooth red cocoa cake with tangy cream cheese frosting and white chocolate shavings.", price: 195, image: "food_18.png", category: "Cakes", isVeg: true, isBestseller: true },
    { name: "Hazelnut Brownie", description: "Fudgy dark chocolate brownie loaded with roasted hazelnuts and a crackly top.", price: 150, image: "food_19.png", category: "Brownies", isVeg: true, isBestseller: true },
    { name: "Blueberry Cheesecake", description: "New York style baked cheesecake with a buttery biscuit base and wild blueberry compote.", price: 250, image: "food_10.png", category: "Cheesecakes", isVeg: true, isBestseller: false },
    { name: "Almond Croissant", description: "Buttery, flaky croissant filled with almond frangipane and topped with sliced almonds.", price: 160, image: "food_20.png", category: "Pastries", isVeg: true, isBestseller: false },
  ],
  // 6: Dosa Plaza
  [
    { name: "Masala Dosa", description: "Crispy golden crepe made from fermented rice and lentil batter, filled with spiced potato masala.", price: 120, image: "food_23.png", category: "Dosa", isVeg: true, isBestseller: true },
    { name: "Mysore Masala Dosa", description: "Spicy version with red chutney spread inside, filled with potato masala. Extra crispy.", price: 140, image: "food_24.png", category: "Dosa", isVeg: true, isBestseller: true },
    { name: "Cheese Burst Dosa", description: "Our special dosa oozing with melted cheese, served with sambar and coconut chutney.", price: 180, image: "food_21.png", category: "Dosa", isVeg: true, isBestseller: false },
    { name: "Filter Coffee", description: "Authentic South Indian filter coffee — strong decoction with frothy hot milk.", price: 60, image: "food_11.png", category: "Beverages", isVeg: true, isBestseller: true },
    { name: "Medu Vada (2 pcs)", description: "Crispy urad dal fritters, golden outside and fluffy inside. Served with sambar and chutney.", price: 80, image: "food_22.png", category: "Snacks", isVeg: true, isBestseller: false },
  ],
  // 7: Dragon Wok
  [
    { name: "Chicken Manchurian", description: "Crispy chicken balls tossed in a tangy, spicy Manchurian sauce with spring onions and peppers.", price: 280, image: "food_29.png", category: "Chinese", isVeg: false, isBestseller: true },
    { name: "Veg Hakka Noodles", description: "Stir-fried noodles with crunchy vegetables, soy sauce, and a hint of vinegar.", price: 200, image: "food_30.png", category: "Noodles", isVeg: true, isBestseller: true },
    { name: "Chicken Fried Rice", description: "Wok-tossed basmati rice with chicken, egg, vegetables, and aromatic soy-garlic sauce.", price: 240, image: "food_31.png", category: "Rice", isVeg: false, isBestseller: false },
    { name: "Dragon Chicken", description: "Fiery stir-fried chicken with dried red chilies, Sichuan pepper, and crispy garlic.", price: 320, image: "food_32.png", category: "Chinese", isVeg: false, isBestseller: true },
    { name: "Veg Spring Rolls (4 pcs)", description: "Crispy rolls stuffed with shredded cabbage, carrots, and glass noodles, served with sweet chili sauce.", price: 160, image: "food_5.png", category: "Starters", isVeg: true, isBestseller: false },
  ],
  // 8: Punjabi Tadka
  [
    { name: "Butter Chicken", description: "Tender chicken pieces in a rich, creamy tomato-butter gravy with kasuri methi. A true classic.", price: 320, image: "food_7.png", category: "Main Course", isVeg: false, isBestseller: true },
    { name: "Paneer Butter Masala", description: "Soft paneer cubes simmered in a velvety tomato-cashew gravy with butter and cream.", price: 280, image: "food_21.png", category: "Main Course", isVeg: true, isBestseller: true },
    { name: "Garlic Naan (2 pcs)", description: "Soft tandoor-baked flatbread brushed with garlic butter and fresh coriander.", price: 80, image: "food_8.png", category: "Breads", isVeg: true, isBestseller: false },
    { name: "Chicken Tikka (8 pcs)", description: "Succulent boneless chicken chunks marinated in spiced yogurt, grilled in tandoor.", price: 300, image: "food_4.png", category: "Starters", isVeg: false, isBestseller: true },
    { name: "Lassi (Sweet / Salted)", description: "Thick, creamy yogurt drink churned with sugar or salt. The perfect Punjabi accompaniment.", price: 90, image: "food_12.png", category: "Beverages", isVeg: true, isBestseller: false },
  ],
  // 9: Momo Central
  [
    { name: "Steamed Chicken Momos (8 pcs)", description: "Handmade dumplings stuffed with minced chicken, ginger, garlic, and fresh herbs. Served with spicy red chutney.", price: 160, image: "food_6.png", category: "Momos", isVeg: false, isBestseller: true },
    { name: "Fried Paneer Momos (8 pcs)", description: "Crispy golden fried momos filled with spiced paneer and vegetables.", price: 180, image: "food_5.png", category: "Momos", isVeg: true, isBestseller: true },
    { name: "Afghani Momos (8 pcs)", description: "Steamed momos drenched in creamy cashew-cream sauce with a mild smoky flavor.", price: 200, image: "food_3.png", category: "Momos", isVeg: false, isBestseller: true },
    { name: "Tandoori Momos (8 pcs)", description: "Momos grilled in tandoor with a spicy tikka marinade, smoky and charred.", price: 220, image: "food_2.png", category: "Momos", isVeg: false, isBestseller: false },
    { name: "Kurkure Momos (8 pcs)", description: "Double-fried extra crunchy momos with a crispy coating, served with mayo dip.", price: 190, image: "food_1.png", category: "Momos", isVeg: false, isBestseller: false },
  ],
  // 10: Café Mocha
  [
    { name: "Cappuccino", description: "Perfectly balanced espresso with steamed milk and a thick layer of velvety foam.", price: 180, image: "food_11.png", category: "Coffee", isVeg: true, isBestseller: true },
    { name: "Iced Caramel Latte", description: "Chilled espresso with milk, drizzled with buttery caramel syrup and crushed ice.", price: 220, image: "food_12.png", category: "Coffee", isVeg: true, isBestseller: true },
    { name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten chocolate center, served with vanilla ice cream.", price: 250, image: "food_17.png", category: "Desserts", isVeg: true, isBestseller: true },
    { name: "Veg Club Sandwich", description: "Triple-decker sandwich with grilled vegetables, cheese, lettuce, and herb mayo on toasted bread.", price: 230, image: "food_15.png", category: "Snacks", isVeg: true, isBestseller: false },
    { name: "Belgian Waffle", description: "Crispy waffle topped with fresh fruits, Nutella, whipped cream, and maple syrup.", price: 260, image: "food_20.png", category: "Desserts", isVeg: true, isBestseller: false },
  ],
  // 11: Royal Kebab House
  [
    { name: "Galouti Kebab (4 pcs)", description: "Legendary melt-in-mouth kebabs made with finely minced mutton and 160 royal spices.", price: 380, image: "food_7.png", category: "Kebabs", isVeg: false, isBestseller: true },
    { name: "Kakori Kebab (4 pcs)", description: "Silky smooth minced lamb kebabs infused with saffron, cardamom, and raw papaya.", price: 350, image: "food_2.png", category: "Kebabs", isVeg: false, isBestseller: true },
    { name: "Lucknowi Chicken Biryani", description: "Fragrant Awadhi-style biryani with tender chicken, saffron strands, and whole spices.", price: 340, image: "food_1.png", category: "Biryani", isVeg: false, isBestseller: false },
    { name: "Shahi Tukda", description: "Royal Lucknowi dessert — fried bread soaked in reduced sweetened milk with silver varq.", price: 140, image: "food_20.png", category: "Desserts", isVeg: true, isBestseller: false },
    { name: "Roomali Roti (2 pcs)", description: "Paper-thin, silky soft rotis made on an inverted tawa — the Lucknowi specialty.", price: 60, image: "food_8.png", category: "Breads", isVeg: true, isBestseller: false },
  ],
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await restaurantModel.deleteMany({});
    await foodModel.deleteMany({});
    console.log("🗑️  Cleared existing restaurants and foods");

    // Insert restaurants
    const createdRestaurants = await restaurantModel.insertMany(restaurants);
    console.log(`🍽️  Created ${createdRestaurants.length} restaurants`);

    // Insert menu items for each restaurant
    let totalFoods = 0;
    for (let i = 0; i < createdRestaurants.length; i++) {
      const restaurantId = createdRestaurants[i]._id;
      const items = menuItemsByRestaurant[i].map((item) => ({
        ...item,
        restaurantId,
      }));
      await foodModel.insertMany(items);
      totalFoods += items.length;
      console.log(`  ✅ ${createdRestaurants[i].name}: ${items.length} items`);
    }

    console.log(`\n🎉 Seeded ${createdRestaurants.length} restaurants with ${totalFoods} menu items!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seed();

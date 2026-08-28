import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  cuisines: { type: [String], required: true },
  rating: { type: Number, default: 4.0 },
  deliveryTime: { type: Number, default: 30 }, // minutes
  costForTwo: { type: Number, default: 400 }, // in ₹
  isVeg: { type: Boolean, default: false },
  address: { type: String, default: "" },
  isOpen: { type: Boolean, default: true },
  promoted: { type: Boolean, default: false },
  totalRatings: { type: String, default: "100+" },
}, { timestamps: true });

const restaurantModel = mongoose.models.restaurant || mongoose.model("restaurant", restaurantSchema);

export default restaurantModel;

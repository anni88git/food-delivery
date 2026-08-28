import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant", required: true },
  isVeg: { type: Boolean, default: true },
  isBestseller: { type: Boolean, default: false },
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "Order Placed" },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },
  paymentMethod: { type: String, default: "COD" },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant" },
  restaurantName: { type: String, default: "" },
  estimatedDelivery: { type: Number, default: 35 }, // minutes
  deliveryPartner: { type: String, default: "" },
  statusHistory: {
    type: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;

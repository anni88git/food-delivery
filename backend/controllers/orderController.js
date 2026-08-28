import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const DELIVERY_PARTNERS = [
  "Rahul S.", "Amit K.", "Priya M.", "Vikram R.", "Deepak J.",
  "Neha P.", "Suresh B.", "Anita G.", "Kiran T.", "Rajesh D."
];

const STATUS_FLOW = [
  "Order Placed",
  "Order Confirmed",
  "Preparing Your Food",
  "Out for Delivery",
  "Delivered"
];

// Auto-progress order status through the pipeline
const autoProgressOrder = async (orderId) => {
  const delays = [15000, 30000, 45000, 60000]; // 15s, 30s, 45s, 60s

  for (let i = 1; i < STATUS_FLOW.length; i++) {
    const delay = delays[i - 1] || 30000;
    setTimeout(async () => {
      try {
        const order = await orderModel.findById(orderId);
        if (!order || order.status === "Cancelled") return;

        order.status = STATUS_FLOW[i];
        order.statusHistory.push({
          status: STATUS_FLOW[i],
          timestamp: new Date(),
        });
        await order.save();
        console.log(`Order ${orderId}: ${STATUS_FLOW[i]}`);
      } catch (err) {
        console.log(`Auto-progress error for ${orderId}:`, err.message);
      }
    }, delay);
  }
};

// placing user order — simulated payment (no Stripe)
const placeOrder = async (req, res) => {
  try {
    const partner = DELIVERY_PARTNERS[Math.floor(Math.random() * DELIVERY_PARTNERS.length)];
    const estimatedDelivery = Math.floor(Math.random() * 15) + 25; // 25-40 min

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      paymentMethod: req.body.paymentMethod || "COD",
      payment: req.body.paymentMethod === "ONLINE",
      restaurantId: req.body.restaurantId || null,
      restaurantName: req.body.restaurantName || "",
      estimatedDelivery,
      deliveryPartner: partner,
      status: "Order Placed",
      statusHistory: [
        { status: "Order Placed", timestamp: new Date() },
      ],
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Start auto-progression
    autoProgressOrder(newOrder._id);

    res.json({
      success: true,
      message: "Order placed successfully!",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error placing order" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true" || success === true) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.body.userId })
      .sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Track a single order
const trackOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error tracking order" });
  }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const orders = await orderModel.find({}).sort({ date: -1 });
      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// api for updating status
const updateStatus = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const order = await orderModel.findById(req.body.orderId);
      order.status = req.body.status;
      order.statusHistory.push({
        status: req.body.status,
        timestamp: new Date(),
      });
      await order.save();
      res.json({ success: true, message: "Status Updated Successfully" });
    } else {
      res.json({ success: false, message: "You are not an admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, trackOrder };

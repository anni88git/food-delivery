import express from "express";
import { listRestaurants, getRestaurant, searchAll } from "../controllers/restaurantController.js";

const restaurantRouter = express.Router();

restaurantRouter.get("/list", listRestaurants);
restaurantRouter.get("/search", searchAll);
restaurantRouter.get("/:id", getRestaurant);

export default restaurantRouter;

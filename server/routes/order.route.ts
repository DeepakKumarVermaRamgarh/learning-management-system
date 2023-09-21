import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import { createOrder, getAllOrders } from "../controllers/order.controller";
import { authorizeRole } from "../controllers/user.controller";
const router = express();

router.post("/create-order", isAuthenticated, createOrder);

router.get(
  "/get-all-orders",
  isAuthenticated,
  authorizeRole("admin"),
  getAllOrders
);

export default router;

import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import { createOrder, getAllOrders } from "../controllers/order.controller";
import { authorizeRole, updateAccessToken } from "../controllers/user.controller";
const router = express();

router.post("/create-order", updateAccessToken, isAuthenticated, createOrder);

router.get(
  "/get-all-orders",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  getAllOrders
);

export default router;

import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  authorizeRole,
  updateAccessToken,
} from "../controllers/user.controller";
import {
  createLayout,
  editLayout,
  getLayoutByType,
} from "../controllers/layout.controller";
const router = Router();

router.post(
  "/create-layout",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  createLayout
);

router.put(
  "/edit-layout",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  editLayout
);

router.get("/get-layout/:type", getLayoutByType);

export default router;

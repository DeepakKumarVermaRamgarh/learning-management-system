import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import { authorizeRole } from "../controllers/user.controller";
import {
  createLayout,
  editLayout,
  getLayoutByType,
} from "../controllers/layout.controller";
const router = Router();

router.post(
  "/create-layout",
  isAuthenticated,
  authorizeRole("admin"),
  createLayout
);

router.put("/edit-layout", isAuthenticated, authorizeRole("admin"), editLayout);

router.get("/get-layout", getLayoutByType);

export default router;

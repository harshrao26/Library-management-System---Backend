import express from "express";
import {
  registerAdmin,
  loginAdmin,
  registerUser,
  loginUser,
  deleteUser,
  updateUser,
  approveUser,
} from "../controllers/authController.js";
import { roleMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/register-admin", registerAdmin);
router.post("/login-admin", loginAdmin);

router.post("/register", registerUser);
router.post("/login", loginUser);

router.patch("/:id/approve", roleMiddleware(["Admin"]), approveUser);

router.put("/:id/update", roleMiddleware(["Admin"]), updateUser);

router.delete("/:id/delete", roleMiddleware(["Admin"]), deleteUser);

export default router;

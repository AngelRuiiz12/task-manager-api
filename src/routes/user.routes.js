import { Router } from "express";
import {
  getUsers,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserByIdHandler);
router.put("/:id", updateUserHandler);
router.delete("/:id", deleteUserHandler);

export default router;

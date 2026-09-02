import { Router } from "express";
import {
  getTasks,
  getTaskByIdHandler,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from "../controllers/task.controller.js";

const router = Router();

router.get("/", getTasks);
router.get("/:id", getTaskByIdHandler);
router.post("/", createTaskHandler);
router.put("/:id", updateTaskHandler);
router.delete("/:id", deleteTaskHandler);

export default router;

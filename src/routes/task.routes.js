import { Router } from "express";
import {
  getTasks,
  getTaskByIdHandler,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
  addTagToTaskHandler,
  removeTagFromTaskHandler,
} from "../controllers/task.controller.js";

const router = Router();

router.get("/", getTasks);
router.get("/:id", getTaskByIdHandler);
router.post("/", createTaskHandler);
router.post("/:id/tags", addTagToTaskHandler);
router.put("/:id", updateTaskHandler);
router.delete("/:id", deleteTaskHandler);
router.delete("/:id/tags/:tagId", removeTagFromTaskHandler);

export default router;

import { Router } from "express";
import { getTasks, createTaskHandler } from "../controllers/task.controller.js";

const router = Router();

router.get("/", getTasks);
router.post("/", createTaskHandler);

export default router;

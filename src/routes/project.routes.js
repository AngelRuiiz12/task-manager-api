import { Router } from "express";
import {
  getProjects,
  getProjectByIdHandler,
  createProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
} from "../controllers/project.controller.js";

const router = Router();

router.get("/", getProjects);
router.get("/:id", getProjectByIdHandler);
router.post("/", createProjectHandler);
router.put("/:id", updateProjectHandler);
router.delete("/:id", deleteProjectHandler);

export default router;

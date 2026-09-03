import { Router } from "express";
import {
  getTags,
  getTagByIdHandler,
  createTagHandler,
  updateTagHandler,
  deleteTagHandler,
} from "../controllers/tag.controller.js";

const router = Router();

router.get("/", getTags);
router.get("/:id", getTagByIdHandler);
router.post("/", createTagHandler);
router.put("/:id", updateTagHandler);
router.delete("/:id", deleteTagHandler);

export default router;

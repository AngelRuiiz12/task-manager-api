import {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} from "../services/tag.service.js";
import { createTagSchema, updateTagSchema } from "../schemas/tag.schema.js";

export async function getTags(req, res) {
  const tags = await getAllTags();
  return res.status(200).json(tags);
}

export async function getTagByIdHandler(req, res) {
  const id = Number(req.params.id);
  const tag = await getTagById(id);

  if (!tag) {
    return res.status(404).json({ message: "Tag not found" });
  }

  return res.status(200).json(tag);
}

export async function createTagHandler(req, res, next) {
  try {
    const result = createTagSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error.issues);
    }

    const tag = await createTag(result.data);
    return res.status(201).json(tag);
  } catch (error) {
    next(error);
  }
}

export async function updateTagHandler(req, res, next) {
  try {
    const result = updateTagSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error.issues);
    }

    const id = Number(req.params.id);
    const tag = await updateTag(id, result.data);

    return res.status(200).json(tag);
  } catch (error) {
    next(error);
  }
}

export async function deleteTagHandler(req, res, next) {
  try {
    const id = Number(req.params.id);
    await deleteTag(id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

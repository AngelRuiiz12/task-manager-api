import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../services/task.service.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema.js";

export async function getTasks(req, res) {
  const tasks = await getAllTasks();
  return res.status(200).json(tasks);
}

export async function getTaskByIdHandler(req, res) {
  const id = Number(req.params.id);
  const task = await getTaskById(id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  return res.status(200).json(task);
}

export async function createTaskHandler(req, res, next) {
  try {
    const result = createTaskSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error.issues);
    }

    const task = await createTask(result.data);
    return res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

export async function updateTaskHandler(req, res, next) {
  try {
    const result = updateTaskSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error.issues);
    }

    const id = Number(req.params.id);
    const updatedTask = await updateTask(id, result.data);

    return res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
}

export async function deleteTaskHandler(req, res, next) {
  try {
    const id = Number(req.params.id);

    await deleteTask(id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

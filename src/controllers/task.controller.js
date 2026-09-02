import { getAllTasks, createTask } from "../services/task.service.js";
import { createTaskSchema } from "../schemas/task.schema.js";

export async function getTasks(req, res) {
  const tasks = await getAllTasks();
  return res.status(200).json(tasks);
}

export async function createTaskHandler(req, res) {
  const result = createTaskSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json(result.error.issues);
  }

  const task = await createTask(result.data);
  return res.status(201).json(task);
}

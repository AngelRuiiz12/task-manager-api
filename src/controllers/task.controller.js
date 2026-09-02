import { getAllTasks } from "../services/task.service.js";

export async function getTasks(req, res) {
  const tasks = await getAllTasks();
  return res.status(200).json(tasks);
}

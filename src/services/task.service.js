import prisma from "../lib/prisma.js";

export async function getAllTasks() {
  const tasks = await prisma.task.findMany();
  return tasks;
}

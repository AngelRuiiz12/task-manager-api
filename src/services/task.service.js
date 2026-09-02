import prisma from "../lib/prisma.js";

export async function getAllTasks() {
  const tasks = await prisma.task.findMany();
  return tasks;
}

export async function createTask(data) {
  const task = await prisma.task.create({ data });
  return task;
}

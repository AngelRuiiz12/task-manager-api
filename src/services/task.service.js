import prisma from "../lib/prisma.js";

export async function getAllTasks() {
  const tasks = await prisma.task.findMany();
  return tasks;
}

export async function getTaskById(id) {
  const task = await prisma.task.findUnique({ where: { id } });
  return task;
}

export async function createTask(data) {
  const task = await prisma.task.create({ data });
  return task;
}

export async function updateTask(id, data) {
  const task = await prisma.task.update({ where: { id }, data });
  return task;
}

export async function deleteTask(id) {
  await prisma.task.delete({ where: { id } });
}

export async function addTagToTask(taskId, tagId) {
  const task = await prisma.task.update({
    where: { id: taskId },
    data: { tags: { connect: { id: tagId } } },
    include: { tags: true },
  });
  return task;
}

export async function removeTagFromTask(taskId, tagId) {
  const task = await prisma.task.update({
    where: { id: taskId },
    data: { tags: { disconnect: { id: tagId } } },
    include: { tags: true },
  });
  return task;
}

import prisma from "../lib/prisma.js";
import { getProjectById } from "./project.service.js";

export async function getAllTasks(userId, filters) {
  const { page, limit, status, sortBy, order } = filters;

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where: { project: { userId }, status },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.task.count({ where: { project: { userId } } }),
  ]);

  return {
    data: tasks,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getTaskById(id, userId) {
  const task = await prisma.task.findFirst({
    where: { id, project: { userId } },
  });
  return task;
}

export async function createTask(data, userId) {
  const project = await getProjectById(data.projectId, userId);

  if (!project) {
    return null;
  }

  const task = await prisma.task.create({ data });
  return task;
}

export async function updateTask(id, data, userId) {
  const task = await getTaskById(id, userId);

  if (!task) {
    return null;
  }

  if (data.projectId) {
    const project = await getProjectById(data.projectId, userId);

    if (!project) {
      return null;
    }
  }

  const updatedTask = await prisma.task.update({ where: { id }, data });
  return updatedTask;
}

export async function deleteTask(id, userId) {
  const task = await getTaskById(id, userId);

  if (!task) {
    return null;
  }

  await prisma.task.delete({ where: { id } });
  return true;
}

export async function addTagToTask(taskId, tagId, userId) {
  const task = await getTaskById(taskId, userId);

  if (!task) {
    return null;
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { tags: { connect: { id: tagId } } },
    include: { tags: true },
  });
  return updatedTask;
}

export async function removeTagFromTask(taskId, tagId, userId) {
  const task = await getTaskById(taskId, userId);

  if (!task) {
    return null;
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { tags: { disconnect: { id: tagId } } },
    include: { tags: true },
  });
  return updatedTask;
}

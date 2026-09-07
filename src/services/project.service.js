import prisma from "../lib/prisma.js";

export async function getAllProjects(userId, filters) {
  const { page, limit, sortBy, order } = filters;

  const where = { userId };

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.project.count({ where }),
  ]);

  return {
    data: projects,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProjectById(id, userId) {
  const project = await prisma.project.findFirst({ where: { id, userId } });
  return project;
}

export async function createProject(data, userId) {
  const project = await prisma.project.create({ data: { ...data, userId } });
  return project;
}

export async function updateProject(id, data, userId) {
  const project = await prisma.project.findFirst({ where: { id, userId } });

  if (!project) {
    return null;
  }

  const updatedProject = await prisma.project.update({ where: { id }, data });
  return updatedProject;
}

export async function deleteProject(id, userId) {
  const project = await prisma.project.findFirst({ where: { id, userId } });

  if (!project) {
    return null;
  }

  await prisma.project.delete({ where: { id } });
  return true;
}

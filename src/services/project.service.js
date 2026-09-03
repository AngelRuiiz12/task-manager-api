import prisma from "../lib/prisma.js";

export async function getAllProjects() {
  const projects = await prisma.project.findMany();
  return projects;
}

export async function getProjectById(id) {
  const project = await prisma.project.findUnique({ where: { id } });
  return project;
}

export async function createProject(data) {
  const project = await prisma.project.create({ data });
  return project;
}

export async function updateProject(id, data) {
  const project = await prisma.project.update({ where: { id }, data });
  return project;
}

export async function deleteProject(id) {
  await prisma.project.delete({ where: { id } });
}

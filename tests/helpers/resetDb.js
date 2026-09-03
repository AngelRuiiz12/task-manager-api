import prisma from "../../src/lib/prisma.js";

export async function resetDatabase() {
  await prisma.task.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
}

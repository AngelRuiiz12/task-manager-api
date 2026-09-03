import prisma from "../lib/prisma.js";

export async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users;
}

export async function getUserById(id) {
  const user = await prisma.user.findUnique({ where: { id } });
  return user;
}

export async function createUser(data) {
  const user = await prisma.user.create({ data });
  return user;
}

export async function updateUser(id, data) {
  const user = await prisma.user.update({ where: { id }, data });
  return user;
}

export async function deleteUser(id) {
  await prisma.user.delete({ where: { id } });
}

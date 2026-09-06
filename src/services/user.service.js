import prisma from "../lib/prisma.js";

export async function getUserById(id, reqId) {
  if (id !== reqId) {
    return null;
  }

  const user = await prisma.user.findUnique({ where: { id } });
  return user;
}

export async function updateUser(id, data, reqId) {
  if (id !== reqId) {
    return null;
  }

  const user = await prisma.user.update({ where: { id }, data });
  return user;
}

export async function deleteUser(id, reqId) {
  if (id !== reqId) {
    return null;
  }

  await prisma.user.delete({ where: { id } });
  return true;
}

import prisma from "../lib/prisma.js";

export async function getAllTags() {
  const tags = await prisma.tag.findMany();
  return tags;
}

export async function getTagById(id) {
  const tag = await prisma.tag.findUnique({ where: { id } });
  return tag;
}

export async function createTag(data) {
  const tag = await prisma.tag.create({ data });
  return tag;
}

export async function updateTag(id, data) {
  const tag = await prisma.tag.update({ where: { id }, data });
  return tag;
}

export async function deleteTag(id) {
  await prisma.tag.delete({ where: { id } });
}

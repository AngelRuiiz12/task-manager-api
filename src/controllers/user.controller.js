import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../services/user.service.js";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema.js";

export async function getUsers(req, res) {
  const users = await getAllUsers();
  return res.status(200).json(users);
}

export async function getUserByIdHandler(req, res) {
  const id = Number(req.params.id);
  const user = await getUserById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
}

export async function createUserHandler(req, res, next) {
  try {
    const result = createUserSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error.issues);
    }

    const user = await createUser(result.data);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUserHandler(req, res, next) {
  try {
    const result = updateUserSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error.issues);
    }

    const id = Number(req.params.id);
    const user = await updateUser(id, result.data);

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function deleteUserHandler(req, res, next) {
  try {
    const id = Number(req.params.id);
    await deleteUser(id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

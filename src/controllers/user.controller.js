import {
  getUserById,
  updateUser,
  deleteUser,
} from "../services/user.service.js";
import { updateUserSchema } from "../schemas/user.schema.js";

export async function getUserByIdHandler(req, res) {
  const id = Number(req.params.id);
  const reqId = req.user.id;
  const user = await getUserById(id, reqId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
}

export async function updateUserHandler(req, res, next) {
  try {
    const result = updateUserSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error.issues);
    }

    const id = Number(req.params.id);
    const reqId = req.user.id;
    const user = await updateUser(id, result.data, reqId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function deleteUserHandler(req, res, next) {
  try {
    const id = Number(req.params.id);
    const reqId = req.user.id;
    const result = await deleteUser(id, reqId);

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

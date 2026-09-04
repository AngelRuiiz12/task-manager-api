import {
  register,
  login,
  InvalidCredentialsError,
} from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

export async function registerHandler(req, res, next) {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error.issues);
    }

    const { user, token } = await register(result.data);
    return res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
}

export async function loginHandler(req, res, next) {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error.issues);
    }

    const { user, token } = await login(result.data);
    return res.status(200).json({ user, token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
}

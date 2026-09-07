import { Router } from "express";
import {
  registerHandler,
  loginHandler,
} from "../controllers/auth.controller.js";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, name, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: Usuario creado correctamente, incluye el token JWT
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El email ya está registrado
 */
router.post("/register", registerHandler);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Logear un usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario logeado correctamente, incluye el token JWT
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", loginHandler);

export default router;

import { Router } from "express";
import {
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
} from "../controllers/user.controller.js";

const router = Router();

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtiene un usuario por su id
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", getUserByIdHandler);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 */
router.put("/:id", updateUserHandler);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Elimina un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/:id", deleteUserHandler);

export default router;

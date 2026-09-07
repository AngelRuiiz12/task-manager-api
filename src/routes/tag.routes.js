import { Router } from "express";
import {
  getTags,
  getTagByIdHandler,
  createTagHandler,
  updateTagHandler,
  deleteTagHandler,
} from "../controllers/tag.controller.js";

const router = Router();

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Obtiene todas las etiquetas
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Etiquetas encontradas
 */
router.get("/", getTags);

/**
 * @swagger
 * /tags/{id}:
 *   get:
 *     summary: Obtiene una etiqueta por su id
 *     tags: [Tags]
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
 *         description: Etiqueta encontrada
 *       404:
 *         description: Etiqueta no encontrada
 */
router.get("/:id", getTagByIdHandler);

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Crea una nueva etiqueta
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Etiqueta creada correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/", createTagHandler);

/**
 * @swagger
 * /tags/{id}:
 *   put:
 *     summary: Actualiza una etiqueta existente
 *     tags: [Tags]
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
 *     responses:
 *       200:
 *         description: Etiqueta actualizada correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Etiqueta no encontrada
 */
router.put("/:id", updateTagHandler);

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     summary: Elimina una etiqueta
 *     tags: [Tags]
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
 *         description: Etiqueta eliminada correctamente
 *       404:
 *         description: Etiqueta no encontrada
 */
router.delete("/:id", deleteTagHandler);

export default router;

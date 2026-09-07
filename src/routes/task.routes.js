import { Router } from "express";
import {
  getTasks,
  getTaskByIdHandler,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
  addTagToTaskHandler,
  removeTagFromTaskHandler,
} from "../controllers/task.controller.js";

const router = Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Obtiene todas las tareas, aplicando o no filtros
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *            type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *            type: integer
 *       - in: query
 *         name: status
 *         schema:
 *            type: string
 *            enum: [PENDING, IN_PROGRESS, DONE]
 *       - in: query
 *         name: sortBy
 *         schema:
 *            type: string
 *            enum: [createdAt, title]
 *       - in: query
 *         name: order
 *         schema:
 *            type: string
 *            enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Tareas encontradas
 *       400:
 *         description: Parámetros de consulta inválidos
 */
router.get("/", getTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Obtiene una tarea por su id
 *     tags: [Tasks]
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
 *         description: Tarea encontrada
 *       404:
 *         description: Tarea no encontrada o no pertenece al usuario
 */
router.get("/:id", getTaskByIdHandler);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Crea una nueva tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, projectId]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, DONE]
 *               projectId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tarea creada correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: El proyecto indicado no existe o no pertenece al usuario
 */
router.post("/", createTaskHandler);

/**
 * @swagger
 * /tasks/{id}/tags:
 *   post:
 *     summary: Conecta una etiqueta a una tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tagId]
 *             properties:
 *               tagId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Etiqueta conectada correctamente, devuelve la tarea con sus tags
 *       404:
 *         description: Tarea o etiqueta no encontradas
 */
router.post("/:id/tags", addTagToTaskHandler);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Actualiza una tarea existente
 *     tags: [Tasks]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, DONE]
 *               projectId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Tarea actualizada correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Tarea no encontrada, o el nuevo proyecto no pertenece al usuario
 */
router.put("/:id", updateTaskHandler);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Elimina una tarea
 *     tags: [Tasks]
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
 *         description: Tarea eliminada correctamente
 *       404:
 *         description: Tarea no encontrada o no pertenece al usuario
 */
router.delete("/:id", deleteTaskHandler);

/**
 * @swagger
 * /tasks/{id}/tags/{tagId}:
 *   delete:
 *     summary: Desconecta una etiqueta de una tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Etiqueta desconectada correctamente, devuelve la tarea con sus tags
 *       404:
 *         description: Tarea no encontrada o no pertenece al usuario
 */
router.delete("/:id/tags/:tagId", removeTagFromTaskHandler);

export default router;

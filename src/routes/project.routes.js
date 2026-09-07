import { Router } from "express";
import {
  getProjects,
  getProjectByIdHandler,
  createProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
} from "../controllers/project.controller.js";

const router = Router();

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Obtiene todos los proyectos del usuario, aplicando o no filtros
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Proyectos encontrados
 *       400:
 *         description: Parámetros de consulta inválidos
 */
router.get("/", getProjects);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Obtiene un proyecto por su id
 *     tags: [Projects]
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
 *         description: Proyecto encontrado
 *       404:
 *         description: Proyecto no encontrado o no pertenece al usuario
 */
router.get("/:id", getProjectByIdHandler);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Crea un nuevo proyecto
 *     tags: [Projects]
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
 *         description: Proyecto creado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/", createProjectHandler);

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Actualiza un proyecto existente
 *     tags: [Projects]
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
 *         description: Proyecto actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Proyecto no encontrado o no pertenece al usuario
 */
router.put("/:id", updateProjectHandler);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Elimina un proyecto
 *     tags: [Projects]
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
 *         description: Proyecto eliminado correctamente
 *       404:
 *         description: Proyecto no encontrado o no pertenece al usuario
 */
router.delete("/:id", deleteProjectHandler);

export default router;

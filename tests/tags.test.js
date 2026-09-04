import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { resetDatabase } from "./helpers/resetDb.js";
import prisma from "../src/lib/prisma.js";

beforeEach(async () => {
  await resetDatabase();
});

describe("GET /tags", () => {
  test("responde con un error 404 al buscar una etiqueta con id que no existe (999999)", async () => {
    // Arrange
    const tag = await prisma.tag.create({
      data: { name: "Test Tag" },
    });

    // Act
    const response = await request(app).get("/tags/999999");

    // Assert
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Tag not found" });
  });

  test("devolver la etiqueta que se pide correctamente", async () => {
    // Arrange
    const tag = await prisma.tag.create({
      data: { name: "Test Tag" },
    });

    // Act
    const response = await request(app).get(`/tags/${tag.id}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: "Test Tag",
    });
  });
});

describe("POST /tags", () => {
  test("devolver un error 400 al enviar datos inválidos", async () => {
    // Act
    const response = await request(app).post("/tags").send({
      name: 123,
    });

    // Assert
    expect(response.status).toBe(400);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("crea una etiqueta correctamente", async () => {
    // Act
    const response = await request(app).post("/tags").send({
      name: "Test Tag",
    });

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: "Test Tag",
    });
  });

  // ------- CASO ESPECIAL: RELACION N:M -------
  test("conecta una etiqueta con una tarea correctamente", async () => {
    // Arrange
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      },
    });
    const project = await prisma.project.create({
      data: { name: "Proyecto de test", userId: user.id },
    });
    const task = await prisma.task.create({
      data: { title: "Tarea de test", projectId: project.id },
    });
    const tag = await prisma.tag.create({
      data: { name: "Test Tag" },
    });

    // Act
    const response = await request(app).post(`/tasks/${task.id}/tags`).send({
      tagId: tag.id,
    });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.tags).toContainEqual({ id: tag.id, name: tag.name });
  });
});

describe("PUT /tags", () => {
  test("actualiza una etiqueta correctamente", async () => {
    // Arrange
    const tag = await prisma.tag.create({
      data: { name: "Test Tag" },
    });

    // Act
    const response = await request(app).put(`/tags/${tag.id}`).send({
      name: "Test Tag updated",
    });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: "Test Tag updated",
    });
  });
});

describe("DELETE /tags", () => {
  test("elimina una etiqueta correctamente", async () => {
    // Arrange
    const tag = await prisma.tag.create({
      data: { name: "Test Tag" },
    });

    // Act 1 - borrar
    const deleteResponse = await request(app).delete(`/tags/${tag.id}`);

    // Assert 1
    expect(deleteResponse.status).toBe(204);

    // Act 2 - confirmar que ya no existe la tarea
    const getResponse = await request(app).get(`/tags/${tag.id}`);

    // Assert
    expect(getResponse.status).toBe(404);
  });

  // ------- CASO ESPECIAL: RELACION N:M -------
  test("desconecta una etiqueta de una tarea correctamente", async () => {
    // Arrange
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      },
    });
    const project = await prisma.project.create({
      data: { name: "Proyecto de test", userId: user.id },
    });
    const task = await prisma.task.create({
      data: { title: "Tarea de test", projectId: project.id },
    });
    const tag = await prisma.tag.create({
      data: { name: "Test Tag" },
    });
    await request(app).post(`/tasks/${task.id}/tags`).send({
      tagId: tag.id,
    });

    // Act
    const response = await request(app).delete(
      `/tasks/${task.id}/tags/${tag.id}`,
    );

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.tags).toEqual([]);
  });
});

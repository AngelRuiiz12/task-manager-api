import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { resetDatabase } from "./helpers/resetDb.js";
import prisma from "../src/lib/prisma.js";

beforeEach(async () => {
  await resetDatabase();
});

describe("GET /tasks", () => {
  test("responde con un error 404 al buscar una tarea con id que no existe (999999)", async () => {
    const response = await request(app).get("/tasks/999999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Task not found" });
  });

  test("devolver la tarea que se pide correctamente", async () => {
    //Arrange
    const user = await prisma.user.create({
      data: { email: "test@example.com", name: "Test User" },
    });
    const project = await prisma.project.create({
      data: { name: "Proyecto de test", userId: user.id },
    });
    const task = await prisma.task.create({
      data: { title: "Tarea de test", projectId: project.id },
    });

    // Act
    const response = await request(app).get(`/tasks/${task.id}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      title: "Tarea de test",
      status: "PENDING",
      projectId: project.id,
    });
  });
});

describe("POST /tasks", () => {
  test("debe responder un error 400", async () => {
    const response = await request(app).post("/tasks").send({ projectId: 1 });

    expect(response.status).toBe(400);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("crea una tarea correctamente", async () => {
    // Arrange
    const user = await prisma.user.create({
      data: { email: "test@example.com", name: "Test User" },
    });
    const project = await prisma.project.create({
      data: { name: "Proyecto de test", userId: user.id },
    });

    // Act
    const response = await request(app)
      .post("/tasks")
      .send({ title: "Tarea de test", projectId: project.id });

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      title: "Tarea de test",
      status: "PENDING",
      projectId: project.id,
    });
  });
});

describe("PUT /tasks", () => {
  test("actualiza una tarea correctamente", async () => {
    // Arrange
    const user = await prisma.user.create({
      data: { email: "test@example.com", name: "Test User" },
    });
    const project = await prisma.project.create({
      data: { name: "Proyecto de test", userId: user.id },
    });
    const task = await prisma.task.create({
      data: { title: "Tarea de test", projectId: project.id },
    });

    // Act
    const response = await request(app).put(`/tasks/${task.id}`).send({
      status: "DONE",
    });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: "DONE",
    });
  });
});

describe("DELETE /tasks", () => {
  test("elimina una tarea correctamente", async () => {
    // Arrange
    const user = await prisma.user.create({
      data: { email: "test@example.com", name: "Test User" },
    });
    const project = await prisma.project.create({
      data: { name: "Proyecto de test", userId: user.id },
    });
    const task = await prisma.task.create({
      data: { title: "Tarea de test", projectId: project.id },
    });

    // Act 1: borrar
    const deleteResponse = await request(app).delete(`/tasks/${task.id}`);

    // Assert 1
    expect(deleteResponse.status).toBe(204);

    // Act 2: confirmar que ya no existe la tarea
    const getResponse = await request(app).get(`/tasks/${task.id}`);

    // Assert 2
    expect(getResponse.status).toBe(404);
  });
});

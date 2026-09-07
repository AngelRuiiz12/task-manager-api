import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { resetDatabase } from "./helpers/resetDb.js";
import prisma from "../src/lib/prisma.js";
import { registerTestUser } from "./helpers/auth.js";

beforeEach(async () => {
  await resetDatabase();
});

describe("GET /tasks", () => {
  test("responde con un error 404 al buscar una tarea con id que no existe (999999)", async () => {
    const { token } = await registerTestUser();

    const response = await request(app)
      .get("/tasks/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Task not found" });
  });

  test("devolver la tarea que se pide correctamente", async () => {
    //Arrange
    const { user, token } = await registerTestUser();
    const project = await prisma.project.create({
      data: { name: "Proyecto de test", userId: user.id },
    });
    const task = await prisma.task.create({
      data: { title: "Tarea de test", projectId: project.id },
    });

    // Act
    const response = await request(app)
      .get(`/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      title: "Tarea de test",
      status: "PENDING",
      projectId: project.id,
    });
  });

  test("no se permite acceder a la tarea de otro usuario", async () => {
    // Arrange
    const { user: userA } = await registerTestUser({
      email: "usuarioA@example.com",
    });
    const { token: tokenB } = await registerTestUser({
      email: "usuarioB@example.com",
    });
    const project = await prisma.project.create({
      data: { name: "Proyecto de test", userId: userA.id },
    });
    const task = await prisma.task.create({
      data: { title: "Tarea de test", projectId: project.id },
    });

    // Act
    const response = await request(app)
      .get(`/tasks/${task.id}`)
      .set("Authorization", `Bearer ${tokenB}`);

    // Assert
    expect(response.status).toBe(404);
  });

  test("paginación no rompe el filtrado por propiedad que ya tenemos y solo devuelve tareas tuyas", async () => {
    // Arrange
    const { user: userA, token: tokenA } = await registerTestUser({
      email: "usuarioA@example.com",
    });
    const projectA = await prisma.project.create({
      data: { name: "Proyecto de test A", userId: userA.id },
    });
    const task1 = await prisma.task.create({
      data: { title: "Tarea de test", projectId: projectA.id },
    });
    const task2 = await prisma.task.create({
      data: { title: "Tarea de test", projectId: projectA.id },
    });

    const { user: userB } = await registerTestUser({
      email: "usuarioB@example.com",
    });
    const projectB = await prisma.project.create({
      data: { name: "Proyecto de test B", userId: userB.id },
    });
    const task3 = await prisma.task.create({
      data: { title: "Task de test", projectId: projectB.id },
    });

    // Act
    const response = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${tokenA}`);

    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(2);
    expect(response.body.meta.total).toBe(2);
  });

  test("paginación correcta en los resultados con page y limit", async () => {
    // Arrange
    const { user, token } = await registerTestUser();
    const projectA = await prisma.project.create({
      data: { name: "Proyecto de test A", userId: user.id },
    });
    const task1 = await prisma.task.create({
      data: { title: "Tarea de test", projectId: projectA.id },
    });
    const task2 = await prisma.task.create({
      data: { title: "Tarea de test", projectId: projectA.id },
    });
    const task3 = await prisma.task.create({
      data: { title: "Tarea de test", projectId: projectA.id },
    });

    // Act 1
    const response1 = await request(app)
      .get("/tasks?page=1&limit=2")
      .set("Authorization", `Bearer ${token}`);

    // Assert 1
    expect(response1.status).toBe(200);
    expect(Array.isArray(response1.body.data)).toBe(true);
    expect(response1.body.data.length).toBe(2);
    expect(response1.body.meta.total).toBe(3);
    expect(response1.body.meta.totalPages).toBe(2);

    // Act 2
    const response2 = await request(app)
      .get("/tasks?page=2&limit=2")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response2.status).toBe(200);
    expect(Array.isArray(response2.body.data)).toBe(true);
    expect(response2.body.data.length).toBe(1);
  });

  test("filtra correctamente por status", async () => {
    // Arrange
    const { user, token } = await registerTestUser();
    const project = await prisma.project.create({
      data: { name: "Proyecto de test", userId: user.id },
    });
    const task1 = await prisma.task.create({
      data: { title: "Tarea de test PENDING", projectId: project.id },
    });
    const task2 = await prisma.task.create({
      data: { title: "Tarea de test PENDING", projectId: project.id },
    });
    const task3 = await prisma.task.create({
      data: {
        title: "Tarea de test DONE",
        status: "DONE",
        projectId: project.id,
      },
    });

    // Act
    const response = await request(app)
      .get("/tasks?status=DONE")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].status).toBe("DONE");
    expect(response.body.meta.total).toBe(1);
  });

  test("ordena correctamente por título de forma ascendente", async () => {
    // Arrange
    const { user, token } = await registerTestUser();
    const project = await prisma.project.create({
      data: { name: "Proyecto de test", userId: user.id },
    });
    const task1 = await prisma.task.create({
      data: { title: "Zapato", projectId: project.id },
    });
    const task2 = await prisma.task.create({
      data: { title: "Manzana", projectId: project.id },
    });
    const task3 = await prisma.task.create({
      data: { title: "Café", projectId: project.id },
    });

    // Act
    const response = await request(app)
      .get("/tasks?sortBy=title&order=asc")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    const titles = response.body.data.map((task) => task.title);
    expect(titles).toEqual(["Café", "Manzana", "Zapato"]);
  });

  test("responde con un error 400 si page no es un número válido", async () => {
    // Arrange
    const { token } = await registerTestUser();

    // Act
    const response = await request(app)
      .get("/tasks?page=abc")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(400);
  });
});

describe("POST /tasks", () => {
  test("devolver un error 400 al enviar datos inválidos", async () => {
    // Arrange
    const { token } = await registerTestUser();

    // Act
    const response = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ projectId: 1 });

    // Assert
    expect(response.status).toBe(400);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("crea una tarea correctamente", async () => {
    // Arrange
    const { user, token } = await registerTestUser();
    const project = await prisma.project.create({
      data: { name: "Proyecto de test", userId: user.id },
    });

    // Act
    const response = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Tarea de test", projectId: project.id });

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      title: "Tarea de test",
      status: "PENDING",
      projectId: project.id,
    });
  });

  test("no se permite crear una tarea en el proyecto de otro usuario", async () => {
    const { user: userA } = await registerTestUser({
      email: "usuarioA@example.com",
    });
    const { token: tokenB } = await registerTestUser({
      email: "usuarioB@example.com",
    });
    const projectA = await prisma.project.create({
      data: { name: "Proyecto de test", userId: userA.id },
    });

    // Act
    const response = await request(app)
      .post(`/tasks`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        title: "Tarea de test en proyecto ajeno",
        projectId: projectA.id,
      });

    // Assert
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Project not found" });
  });
});

describe("PUT /tasks", () => {
  test("actualiza una tarea correctamente", async () => {
    // Arrange
    const { user, token } = await registerTestUser();
    const project = await prisma.project.create({
      data: { name: "Proyecto de test", userId: user.id },
    });
    const task = await prisma.task.create({
      data: { title: "Tarea de test", projectId: project.id },
    });

    // Act
    const response = await request(app)
      .put(`/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
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
    const { user, token } = await registerTestUser();
    const project = await prisma.project.create({
      data: { name: "Proyecto de test", userId: user.id },
    });
    const task = await prisma.task.create({
      data: { title: "Tarea de test", projectId: project.id },
    });

    // Act 1: borrar
    const deleteResponse = await request(app)
      .delete(`/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert 1
    expect(deleteResponse.status).toBe(204);

    // Act 2: confirmar que ya no existe la tarea
    const getResponse = await request(app)
      .get(`/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert 2
    expect(getResponse.status).toBe(404);
  });
});

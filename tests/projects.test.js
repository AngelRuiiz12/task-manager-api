import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { resetDatabase } from "./helpers/resetDb.js";
import prisma from "../src/lib/prisma.js";

beforeEach(async () => {
  await resetDatabase();
});

describe("GET /projects", () => {
  test("responde con un error 404 al buscar un proyecto con id que no existe (999999)", async () => {
    // Act
    const response = await request(app).get("/projects/999999");

    // Assert
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Project not found" });
  });

  test("devolver el proyecto que se pide correctamente", async () => {
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

    // Act
    const response = await request(app).get(`/projects/${project.id}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: "Proyecto de test",
      userId: user.id,
    });
  });
});

describe("POST /projects", () => {
  test("devolver un error 400 al enviar datos inválidos", async () => {
    // Act
    const response = await request(app).post("/projects").send({
      userId: 999999,
    });

    // Assert
    expect(response.status).toBe(400);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("crear un proyecto correctamente", async () => {
    // Arrange
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      },
    });

    // Act
    const response = await request(app).post("/projects").send({
      name: "Proyecto de test",
      userId: user.id,
    });

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: "Proyecto de test",
      userId: user.id,
    });
  });
});

describe("PUT /projects", () => {
  test("actualiza un proyecto correctamente", async () => {
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

    // Act
    const response = await request(app).put(`/projects/${project.id}`).send({
      name: "Proyecto de test modificado",
    });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: "Proyecto de test modificado",
    });
  });
});

describe("DELETE /projects", () => {
  test("elimina un proyecto correctamente", async () => {
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

    // Act 1 - borrar
    const deleteResponse = await request(app).delete(`/projects/${project.id}`);

    // Assert 1
    expect(deleteResponse.status).toBe(204);

    // Act 2 - confirmar que ya no existe el proyecto
    const getResponse = await request(app).get(`/projects/${project.id}`);

    // Assert 2
    expect(getResponse.status).toBe(404);
  });
});

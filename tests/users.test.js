import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { resetDatabase } from "./helpers/resetDb.js";
import prisma from "../src/lib/prisma.js";

beforeEach(async () => {
  await resetDatabase();
});

describe("GET /users", () => {
  test("responde con un error 404 al buscar un usuario con id que no existe (999999)", async () => {
    // Act
    const response = await request(app).get("/users/999999");

    // Assert
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "User not found" });
  });

  test("devolver el usuario que se pide correctamente", async () => {
    // Arrange
    const user = await prisma.user.create({
      data: { email: "test@example.com", name: "Test User" },
    });

    // Act
    const response = await request(app).get(`/users/${user.id}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      email: "test@example.com",
      name: "Test User",
    });
  });
});

describe("POST /users", () => {
  test("devolver un error 400 al enviar datos inválidos", async () => {
    // Act
    const response = await request(app).post("/users").send({
      email: "emailErroneo",
    });

    // Assert
    expect(response.status).toBe(400);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("crear un usuario correctamente", async () => {
    // Act
    const response = await request(app).post("/users").send({
      email: "test@example.com",
      name: "Test User",
    });

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      email: "test@example.com",
      name: "Test User",
    });
  });
});

describe("PUT /users", () => {
  test("actualiza un usuario correctamente", async () => {
    // Arrange
    const user = await prisma.user.create({
      data: { email: "test@example.com", name: "Test User" },
    });

    // Act
    const response = await request(app).put(`/users/${user.id}`).send({
      name: "Test User Modified",
    });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: "Test User Modified",
    });
  });
});

describe("DELETE /users", () => {
  test("elimina un usuario correctamente", async () => {
    // Arrange
    const user = await prisma.user.create({
      data: { email: "test@example.com", name: "Test User" },
    });

    // Act 1 - borrar
    const deleteResponse = await request(app).delete(`/users/${user.id}`);

    // Assert 1
    expect(deleteResponse.status).toBe(204);

    // Act 2 - confirmar que ya no existe el usuario
    const getResponse = await request(app).get(`/users/${user.id}`);

    // Assert 2
    expect(getResponse.status).toBe(404);
  });
});

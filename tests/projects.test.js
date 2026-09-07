import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { resetDatabase } from "./helpers/resetDb.js";
import prisma from "../src/lib/prisma.js";
import { registerTestUser } from "./helpers/auth.js";

beforeEach(async () => {
  await resetDatabase();
});

describe("GET /projects", () => {
  test("responde con un error 404 al buscar un proyecto con id que no existe (999999)", async () => {
    // Arrange
    const { token } = await registerTestUser();

    // Act
    const response = await request(app)
      .get("/projects/999999")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Project not found" });
  });

  test("devolver el proyecto que se pide correctamente", async () => {
    // Arrange
    const { user, token } = await registerTestUser();
    const project = await prisma.project.create({
      data: { name: "Proyecto de test", userId: user.id },
    });

    // Act
    const response = await request(app)
      .get(`/projects/${project.id}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: "Proyecto de test",
      userId: user.id,
    });
  });

  test("no se permite acceder al proyecto de otro usuario", async () => {
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

    // Act
    const response = await request(app)
      .get(`/projects/${project.id}`)
      .set("Authorization", `Bearer ${tokenB}`);

    // Assert
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Project not found" });
  });

  test("paginación no rompe el filtrado por propiedad que ya tenemos y solo devuelve proyectos tuyos", async () => {
    // Arrange
    const { user: userA, token: tokenA } = await registerTestUser({
      email: "usuarioA@example.com",
    });
    const project1 = await prisma.project.create({
      data: { name: "Proyecto de test", userId: userA.id },
    });
    const project2 = await prisma.project.create({
      data: { name: "Proyecto de test", userId: userA.id },
    });

    const { user: userB } = await registerTestUser({
      email: "usuarioB@example.com",
    });
    const project3 = await prisma.project.create({
      data: { name: "Proyecto de test", userId: userB.id },
    });

    // Act
    const response = await request(app)
      .get("/projects")
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
    const project1 = await prisma.project.create({
      data: { name: "Proyecto de test", userId: user.id },
    });
    const project2 = await prisma.project.create({
      data: { name: "Proyecto de test", userId: user.id },
    });
    const project3 = await prisma.project.create({
      data: { name: "Proyecto de test", userId: user.id },
    });

    // Act 1
    const response1 = await request(app)
      .get("/projects?page=1&limit=2")
      .set("Authorization", `Bearer ${token}`);

    // Assert 1
    expect(response1.status).toBe(200);
    expect(Array.isArray(response1.body.data)).toBe(true);
    expect(response1.body.data.length).toBe(2);
    expect(response1.body.meta.total).toBe(3);
    expect(response1.body.meta.totalPages).toBe(2);

    // Act 2
    const response2 = await request(app)
      .get("/projects?page=2&limit=2")
      .set("Authorization", `Bearer ${token}`);

    // Assert 2
    expect(response2.status).toBe(200);
    expect(Array.isArray(response2.body.data)).toBe(true);
    expect(response2.body.data.length).toBe(1);
  });

  test("ordena correctamente por name de forma ascendente", async () => {
    // Arrange
    const { user, token } = await registerTestUser();
    const project1 = await prisma.project.create({
      data: { name: "Zapato", userId: user.id },
    });
    const project2 = await prisma.project.create({
      data: { name: "Manzana", userId: user.id },
    });
    const project3 = await prisma.project.create({
      data: { name: "Café", userId: user.id },
    });

    // Act
    const response = await request(app)
      .get("/projects?sortBy=name&order=asc")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    const names = response.body.data.map((project) => project.name);
    expect(names).toEqual(["Café", "Manzana", "Zapato"]);
  });

  test("responde con un error 400 si page no es un número válido", async () => {
    // Arrange
    const { token } = await registerTestUser();

    // Act
    const response = await request(app)
      .get("/projects?page=abc")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(400);
  });
});

describe("POST /projects", () => {
  test("devolver un error 400 al enviar datos inválidos", async () => {
    // Arrange
    const { token } = await registerTestUser();

    // Act
    const response = await request(app)
      .post("/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: 999999,
      });

    // Assert
    expect(response.status).toBe(400);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("crear un proyecto correctamente", async () => {
    // Arrange
    const { user, token } = await registerTestUser();

    // Act
    const response = await request(app)
      .post("/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({
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
    const { user, token } = await registerTestUser();
    const project = await prisma.project.create({
      data: { name: "Proyecto de test", userId: user.id },
    });

    // Act
    const response = await request(app)
      .put(`/projects/${project.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
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
    const { user, token } = await registerTestUser();
    const project = await prisma.project.create({
      data: { name: "Proyecto de test", userId: user.id },
    });

    // Act 1 - borrar
    const deleteResponse = await request(app)
      .delete(`/projects/${project.id}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert 1
    expect(deleteResponse.status).toBe(204);

    // Act 2 - confirmar que ya no existe el proyecto
    const getResponse = await request(app)
      .get(`/projects/${project.id}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert 2
    expect(getResponse.status).toBe(404);
  });
});

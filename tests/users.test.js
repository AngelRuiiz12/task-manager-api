import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { resetDatabase } from "./helpers/resetDb.js";
import { registerTestUser } from "./helpers/auth.js";

beforeEach(async () => {
  await resetDatabase();
});

describe("GET /users", () => {
  test("responde con un error 404 al buscar un usuario con id que no existe (999999)", async () => {
    // Arrange
    const { token } = await registerTestUser();

    // Act
    const response = await request(app)
      .get("/users/999999")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "User not found" });
  });

  test("devolver el usuario que se pide correctamente", async () => {
    // Arrange
    const { user, token } = await registerTestUser();

    // Act
    const response = await request(app)
      .get(`/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      email: "test@example.com",
      name: "Test User",
    });
    expect(response.body).not.toHaveProperty("password");
  });
});

describe("PUT /users", () => {
  test("actualiza un usuario correctamente", async () => {
    // Arrange
    const { user, token } = await registerTestUser();

    // Act
    const response = await request(app)
      .put(`/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test User Modified",
      });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: "Test User Modified",
    });
    expect(response.body).not.toHaveProperty("password");
  });
});

describe("DELETE /users", () => {
  test("elimina un usuario correctamente", async () => {
    // Arrange
    const { user, token } = await registerTestUser();

    // Act 1 - borrar
    const deleteResponse = await request(app)
      .delete(`/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert 1
    expect(deleteResponse.status).toBe(204);

    // Act 2 - confirmar que ya no existe el usuario
    const getResponse = await request(app)
      .get(`/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert 2
    expect(getResponse.status).toBe(404);
  });
});

import { describe, test, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("GET /", () => {
  test("responde con el mensaje de bienvenida", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "API funcionando" });
  });
});

describe("GET /tasks/999999 (id que no existe)", () => {
  test("responde con un error 404", async () => {
    const response = await request(app).get("/tasks/999999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Task not found" });
  });
});

describe("POST /tasks sin title en el body", () => {
  test("debe responder un error 400", async () => {
    const response = await request(app).post("/tasks").send({ projectId: 1 });

    expect(response.status).toBe(400);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

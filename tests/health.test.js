import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { resetDatabase } from "./helpers/resetDb.js";

beforeEach(async () => {
  await resetDatabase();
});

describe("GET /", () => {
  test("responde con el mensaje de bienvenida", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "API funcionando" });
  });
});

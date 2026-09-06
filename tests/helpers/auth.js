import request from "supertest";
import app from "../../src/app.js";

export async function registerTestUser(overrides = {}) {
  const response = await request(app)
    .post("/auth/register")
    .send({
      email: overrides.email ?? "test@example.com",
      name: overrides.name ?? "Test User",
      password: overrides.password ?? "password123",
    });

  return response.body;
}

const request = require("supertest");
const app = require("../src/app");

describe("Server basic routes", () => {
  test("GET /api/health should return 200", async () => {
    const response = await request(app).get("/api/health");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Backend is running",
    });
  });

  test("unknown route should return 404", async () => {
    const response = await request(app).get("/unknown");

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
  });
});

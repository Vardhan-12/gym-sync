const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/User");

describe("Auth Flow", () => {

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await User.deleteMany({ email: "testuser@test.com" });
    await mongoose.connection.close();
  });

  let accessToken;
  let refreshToken;

  test("Register User", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({
        name: "Test User",
        email: "testuser@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
  });

  test("Login User", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({
        email: "testuser@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  test("Access Protected Route", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
  });

  test("Refresh Token", async () => {
    const res = await request(app)
      .post("/api/users/refresh-token")
      .send({ refreshToken });

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

});
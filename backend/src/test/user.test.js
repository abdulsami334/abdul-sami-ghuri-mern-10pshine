import request from "supertest";
import app from "../app.js";
import { expect } from "chai";

let token;

describe("User API", () => {

  // Login first
  before(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "codewithsami05@gmail.com",
        password: "123456"
      });

    token = res.body.token;
  });

  // Get profile
  it("should get my profile", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("email");
  });

  // Update profile
  it("should update my profile", async () => {
    const res = await request(app)
      .put("/api/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Sami"
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message");
  });

});

import request from "supertest";
import { expect } from "chai";
import app from "../app.js";
import { findUserByEmail } from "../models/user.model.js";

describe("Auth API", () => {

const testUser = {
  name: "Sami",
  email: `sami${Date.now()}@gmail.com`,
  password: "123456"
};

  // Signup
  it("should signup user", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send(testUser);

    expect(res.status).to.be.oneOf([200, 201]);
  });

  // Login
  it("should login user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
  });

  //Forgot password
 let resetToken;

it("should generate reset token", async () => {
  await request(app)
    .post("/api/auth/forgot-password")
    .send({ email: testUser.email });

  const user = await findUserByEmail(testUser.email);
  resetToken = user.reset_token;
});

//   // Reset password
 it("should reset password", async () => {
console.log("RESET TOKEN:", resetToken);
  const res = await request(app)
    .post("/api/auth/reset-password")
    .send({
      token: resetToken,
      password: "newpassword123"
    });


  expect(res.status).to.equal(200);
});


});

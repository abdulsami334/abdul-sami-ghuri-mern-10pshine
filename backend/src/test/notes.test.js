import request from "supertest";
import app from "../app.js";
import { expect } from "chai";

let token;
let noteId;

describe("Notes API", () => {

  before(async () => {

    // Login
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "codewithsami05@gmail.com",
        password: "123456"
      });

    token = loginRes.body.token;
    console.log("TOKEN:", token);

    // Create note
    const createRes = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Note",
        content: "Hello world"
      });

    console.log("CREATE RESPONSE:", createRes.body);

    // IMPORTANT: adjust if response structure different
    noteId = createRes.body.id || createRes.body.note?.id;

    console.log("CREATED NOTE ID:", noteId);
  });

  it("should get all notes", async () => {
    const res = await request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
  });

  it("should get note by id", async () => {
    console.log("GET USING NOTE ID:", noteId);

    const res = await request(app)
      .get(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("GET RESPONSE:", res.status, res.body);

    expect(res.status).to.equal(200);
  });

  it("should update note", async () => {
    const res = await request(app)
      .put(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Title" });

    expect(res.status).to.equal(200);
  });

  it("should pin note", async () => {
    const res = await request(app)
      .put(`/api/notes/${noteId}/pin`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
  });

  it("should unpin note", async () => {
    const res = await request(app)
      .put(`/api/notes/${noteId}/unpin`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
  });

  it("should delete note", async () => {
    console.log("DELETE USING NOTE ID:", noteId);

    const res = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("DELETE RESPONSE:", res.status, res.body);

    expect(res.status).to.equal(200);
  });

  it("should get notes stats", async () => {
    const res = await request(app)
      .get("/api/notes/stats")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
  });

});

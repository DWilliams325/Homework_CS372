import request from "supertest";
import app from "../server.js";
describe("POST /accounts", function () {
  it("valid input 1", function (done) {
    request(app)
      .post("/accounts")
      .send({
        balance: 100,
        name: "checking",
      })
      .expect(201, { id: 0 }, done);
  });
  it("valid input 2", function (done) {
    request(app)
      .post("/accounts")
      .send({
        balance: 200,
        name: "saving",
      })
      .expect(201, { id: 1 }, done);
  });
});
describe("GET /accounts", function () {
  it("get accounts", function (done) {
    request(app)
      .get("/accounts")
      .expect(
        200,
        [
          { balance: 100, name: "checking" },
          { balance: 200, name: "saving" },
        ],
        done
      );
  });
});
describe("PUT /accounts", function () {
  it("update an account", function (done) {
    request(app)
      .put("/accounts/0")
      .send({
        balance: 300,
        name: "saving",
      })
      .expect(200, { balance: 300, name: "saving" }, done);
  });
});
describe("GET /accounts", function () {
  it("get users", function (done) {
    request(app)
      .get("/accounts")
      .expect(
        200,
        [
          { balance: 300, name: "saving" },
          { balance: 200, name: "saving" },
        ],
        done
      );
  });
});
describe("DELETE /accounts", function () {
  it("remove an account", function (done) {
    request(app).delete("/accounts/0").expect(204, {}, done);
  });
});
describe("GET /accounts", function () {
  it("get users", function (done) {
    request(app)
      .get("/accounts")
      .expect(200, [{ balance: 200, name: "saving" }], done);
  });
});

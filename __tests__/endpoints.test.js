const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/topics", () => {
  describe("GET", () => {
    test("status: 200 - responds with an array of all the topic objects.", () => {
      return request(app).get("/api/topics").expect(200);
    });
    test("status: 404 - responds with a 404 if route does not exist.", () => {
      return request(app)
        .get("/api/topic/")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Error 404 - Route not found");
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("status: 200 - responds with the specified article.", () => {
      return request(app)
        .get("/api/articles/10")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            author: "rogersop",
            title: "Seven inspirational thought leaders from Manchester UK",
            article_id: 10,
            body: expect.any(String),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
    });
    test("status: 404 - responds with a 404 if requested ID does not exist.", () => {
      return request(app)
        .get("/api/articles/10000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No article found for article_id: 10000");
        });
    });
    test("status: 400 - responds with a 400 if ID is not valid.", () => {
      return request(app)
        .get("/api/articles/ten")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
  describe("PATCH", () => {
    test('should update votes on article and return correct article.', () => {
      return request(app)
        .patch("/api/articles/10")
        .send({ inc_votes: 15 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            author: "rogersop",
            title: "Seven inspirational thought leaders from Manchester UK",
            article_id: 10,
            body: expect.any(String),
            topic: "mitch",
            created_at: expect.any(String),
            votes: 15,
          });
        });
    });
    test("should return 400 when submitting invalid key.", () => {
      return request(app)
        .patch("/api/articles/10")
        .send({ change_votes: 15 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("should return 400 when submitting invalid value.", () => {
      return request(app)
        .patch("/api/articles/10")
        .send({ inc_votes: 'banana' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});

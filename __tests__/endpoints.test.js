const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Topics", () => {
  describe("/api/topics", () => {
    describe("GET", () => {
      test("status: 200 - responds with an array of all the topic objects.", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics.length > 1).toBe(true);
            expect(body.topics[0]).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
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
});

describe("Articles", () => {
  describe("/api/articles", () => {
    describe("GET", () => {
      test("should return a list of articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length > 1).toBe(true);
            expect(body.articles[0]).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            });
          });
      });
      test("should return articles by descending date", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0]).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: "2020-11-03T09:12:00.000Z",
            votes: expect.any(Number),
          });
          expect(body.articles[body.articles.length - 1]).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: "2020-01-07T14:08:00.000Z",
            votes: expect.any(Number),
          });
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
      test("should update votes on article and return correct article.", () => {
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
          .send({ inc_votes: "banana" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("should return 400 when submitting multiple keys.", () => {
        return request(app)
          .patch("/api/articles/10")
          .send({ change_votes: 15, title: "New Name" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("should return 404 when patching to an article that doesn't exist.", () => {
        return request(app)
          .patch("/api/articles/1000000")
          .send({ change_votes: 15 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("No article found for article_id: 1000000");
          });
      });
      test("should return 400 when patching to an invalid article ID.", () => {
        return request(app)
          .patch("/api/articles/ten")
          .send({ change_votes: 15 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
    });
  });
});

describe("Users", () => {
  describe("/api/users", () => {
    describe("GET", () => {
      test("should return a list of users", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            expect(body.users.length > 1).toBe(true);
            expect(body.users[0]).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
      });
    });
  });
});

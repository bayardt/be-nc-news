const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Endpoints', () => {
  describe('/api', () => {
    test('should return JSON of available endpoints', () => {
      return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toMatchObject({
          'GET /api': expect.any(Object)
        })
      })
    });
  });
});

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
              comment_count: expect.any(String),
            });
          });
      });
      test("should return articles by descending date", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy('created_at', {descending: true});
          });
      });
      test("should correctly return articles based on query of sort_by and order", () => {
        return request(app)
          .get("/api/articles?sort_by=author&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length > 1).toBe(true);
            expect(body.articles[0]).toMatchObject({
              author: "butter_bridge",
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            });
          });
      });
      test("should correctly return articles based on query of topic", () => {
        return request(app)
          .get("/api/articles?sort_by=author&order=asc&topic=mitch")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("author", {
              ascending: true,
            });
          });
      });
      test("should return an error on bad sort query", () => {
        return request(app)
          .get("/api/articles?sort_by=smell&order=asc&topic=mitch")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("should return an error on bad order query", () => {
        return request(app)
          .get("/api/articles?sort_by=author&order=goingup&topic=mitch")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid query");
          });
      });
      test("should return an error if topic doesn't exist", () => {
        return request(app)
          .get("/api/articles?sort_by=author&order=asc&topic=elephants")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("No topic found for: elephants");
          });
      });
    });
  });
  describe("/api/articles/:article_id", () => {
    describe("GET", () => {
      test("status: 200 - responds with the specified article including comment count.", () => {
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
              comment_count: "0",
            });
          });
      });
      test("should respond with the specified article including comment count.", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: 1,
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: "11",
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
  describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
      test("status: 200 - responds with the specified article including comment count.", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments[0]).toMatchObject({
              comment_id: expect.any(Number),
              body: expect.any(String),
              article_id: 1,
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            });
          });
      });
      test("status: 200 - responds with custom message if there are no comments.", () => {
        return request(app)
          .get("/api/articles/10/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBe(
              "There are no comments for this article."
            );
          });
      });
    });
    describe("POST", () => {
      test("should post a new comment on specified article", () => {
        return request(app)
          .post("/api/articles/10/comments")
          .send({ username: "rogersop", body: "I am posting a comment!" })
          .expect(201)
          .then(({ body }) => {
            expect(body.comment).toMatchObject({
              comment_id: expect.any(Number),
              body: expect.any(String),
              article_id: 10,
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            });
          });
      });
      test("should return an error if user does not exist", () => {
        return request(app)
          .post("/api/articles/10/comments")
          .send({ username: "bayard", body: "I am posting a comment!" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request: Username does not exist");
          });
      });
      test("should return an error if article does not exist", () => {
        return request(app)
          .post("/api/articles/10000/comments")
          .send({ username: "bayard", body: "I am posting a comment!" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request: Article does not exist");
          });
      });
      test("should return an error if user submits blank comment", () => {
        return request(app)
          .post("/api/articles/10/comments")
          .send({ username: "rogersop", body: "" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("You cannot submit an empty comment.");
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

describe("Comments", () => {
  describe("/api/comments", () => {
    describe("DELETE", () => {
      test("should remove specified comment", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204)
          .then(({ body }) => {
            expect(body.msg).toBe(undefined);
          });
      });
      test("should return an error if user attempts to delete a non-existing comment", () => {
        return request(app)
          .delete("/api/comments/10000000")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("No comment found for comment_id: 10000000");
          });
      });
      test("should return an error if user attempts to delete an invalid comment", () => {
        return request(app)
          .delete("/api/comments/ten")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
    });
  });
});

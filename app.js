const express = require("express");
const { getEndpoints } = require("./controllers/endpoints.controllers")
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  updateArticleVotes,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("./controllers/articles.controllers");
const { getUsers } = require("./controllers/users.controllers");
const { removeCommentById } = require("./controllers/comments.controllers")
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index");
const cors = require('cors');

const app = express();

app.use(cors());


app.use(express.json());

// api
app.get("/api", getEndpoints)

// Topics
app.get("/api/topics", getTopics);

// Articles
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/articles", getArticles);
app.patch("/api/articles/:article_id", updateArticleVotes);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

// Users
app.get("/api/users", getUsers);

// Comments
app.delete("/api/comments/:comment_id", removeCommentById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Error 404 - Route not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;

const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getArticleById, updateArticleVotes, getArticles, getCommentsByArticleId, postCommentByArticleId} = require("./controllers/articles.controllers");
const { getUsers } = require("./controllers/users.controllers")
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id",  updateArticleVotes);

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Error 404 - Route not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);



module.exports = app;

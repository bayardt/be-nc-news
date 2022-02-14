const express = require("express");
const { getTopics } = require('./controllers/topics.controllers')
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Error 404 - Route not found" });
});

module.exports = app;

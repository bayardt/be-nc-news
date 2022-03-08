const {
  selectArticleById,
  adjustArticleVotes,
  selectArticles,
  selectCommentsByArticleId,
  insertCommentByArticleId,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, limit } = req.query;
  selectArticles(sort_by, order, topic, limit)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.updateArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  adjustArticleVotes(article_id, inc_votes)
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => res.status(200).send({ comments }))
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  insertCommentByArticleId(article_id, username, body)
    .then((comment) => res.status(201).send({ comment }))
    .catch(next);
};

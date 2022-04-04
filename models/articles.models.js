const { type } = require("express/lib/response");
const db = require("../db/connection");

exports.selectArticles = (
  sort_by = "created_at",
  order = "DESC",
  topic = "",
  limit = 10
) => {
  order = order.toUpperCase();
  limit = parseInt(limit);

  // check criteria is valid
  const validSort =
    sort_by === "created_at" ||
    sort_by === "comment_count" ||
    sort_by === "votes";
  const validOrder = order === "ASC" || order === "DESC";

  // if query is invalid, return error
  if (!validSort || !validOrder) {
    return Promise.reject({
      status: 400,
      msg: "Invalid query",
    });
  }

  // assemble SQL query based on parameters
  const allQueries =
    "SELECT articles.*, COUNT(comments.body) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id ";
  const topicQueries = "WHERE topic = $1";
  const queryGrouping = topic
    ? `GROUP BY articles.article_id ORDER BY ${sort_by} ${order} LIMIT $2;`
    : `GROUP BY articles.article_id ORDER BY ${sort_by} ${order} LIMIT $1;`;
  const customQuery = topic
    ? allQueries + topicQueries + queryGrouping
    : allQueries + queryGrouping;
  const customValues = topic ? [topic, limit] : [limit];

  // query postgreSQL database
  return db.query(customQuery, customValues).then(({ rows }) => {
    if (!rows[0])
      return Promise.reject({
        status: 404,
        msg: `No topic found for: ${topic}`,
      });
    return rows;
  });
};

exports.selectArticleById = (requestedArticleId) => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.body) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id ;",
      [requestedArticleId]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${requestedArticleId}`,
        });
      }
      return article;
    });
};

exports.selectCommentsByArticleId = (requestedArticleId) => {
  return db
    .query(
      "SELECT comments.*, articles.article_id FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 ;",
      [requestedArticleId]
    )
    .then(({ rows }) => {
      const comments = rows;
      if (!comments[0]) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${requestedArticleId}`,
        });
      }
      if (!comments[0].comment_id)
        return "There are no comments for this article.";
      return comments;
    });
};

exports.adjustArticleVotes = (requestedArticleId, voteCount) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [voteCount, requestedArticleId]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${requestedArticleId}`,
        });
      }
      return article;
    });
};

exports.insertCommentByArticleId = (
  requestedArticleId,
  commentAuthor,
  commentBody
) => {
  if (!commentBody) {
    return Promise.reject({
      status: 400,
      msg: `You cannot submit an empty comment.`,
    });
  }
  return db
    .query(
      "INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;",
      [commentBody, requestedArticleId, commentAuthor]
    )
    .then(({ rows }) => {
      const comment = rows[0];
      return comment;
    });
};

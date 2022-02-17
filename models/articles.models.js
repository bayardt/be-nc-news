const db = require("../db/connection");

exports.selectArticles = () => {
  return db
    .query("SELECT * FROM articles ORDER BY created_at DESC;")
    .then(({ rows }) => rows);
};

exports.selectArticleById = (requestedArticleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [
      requestedArticleId,
    ])
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

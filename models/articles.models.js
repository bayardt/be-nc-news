const db = require("../db/connection");

exports.selectArticles = (
  sortingQuery = "created_at",
  orderQuery = "desc",
  topicQuery,
  limitQuery = 10
) => {
  const topicSearch = topicQuery ? `WHERE topic = '${topicQuery}'` : "";
  return db
    .query(
      `SELECT articles.*, COUNT(comments.body) AS comment_count FROM articles LEFT JOIN comments on articles.article_id = comments.article_id ${topicSearch} GROUP BY articles.article_id ORDER BY ${sortingQuery} ${orderQuery} LIMIT ${limitQuery};`
    )
    .then(({ rows }) => {
      const articles = rows;
      if (articles[0] == undefined) {
        return Promise.reject({
          status: 404,
          msg: `No topic found for: ${topicQuery}`,
        });
      }
      return articles
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

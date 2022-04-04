const db = require("../db/connection");

exports.deleteCommentById = (requestedCommentId) => {
  return db
    .query(
      `DELETE FROM comments WHERE comment_id = ${requestedCommentId} RETURNING *; `
    )
    .then(({ rows }) => {
      const deletedComment = rows
      if (!deletedComment[0]) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment_id: ${requestedCommentId}`,
        });
      }
      return deletedComment
      });
};

exports.adjustCommentVotes = (requestedCommentId, voteCount) => {
  return db
    .query(
      "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;",
      [voteCount, requestedCommentId]
    )
    .then(({ rows }) => {
      const comment = rows[0];
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment_id: ${requestedCommentId}`,
        });
      }
      return comment;
    });
};


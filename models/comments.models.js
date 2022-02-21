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

